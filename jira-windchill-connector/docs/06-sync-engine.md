# 06 — Sync Engine

This is the heart of the product. Most integration projects fail here, not at
the API layer.

## 1. Echo suppression (loop prevention)

An infinite loop looks like: we write to Jira → Jira emits a change → we read it
→ we write to Windchill → Windchill emits a change → we write to Jira → …

Four independent defences, all active (defence in depth, because any single one
can be defeated by a customer configuration):

**D1 — Actor filter.** Changes whose `lastModifiedBy` is our service account are
dropped at stage 4. Cheap and catches ~95 %.
*Weakness:* a human change made moments after ours can be attributed correctly
but arrive in the same webhook batch; and some Windchill workflow robots rewrite
the modifier. Hence D2–D4.

**D2 — Pending-write table.** Before any write we insert
`(linkId, side, expectedFieldHash, writeId, expiresAt)`. When a change event
arrives whose resulting field hash matches a pending write, it is consumed as an
echo and the row deleted. Rows expire after `2 × p99 propagation`.

**D3 — Content hash equality.** After mapping (stage 6), if the computed target
mutation is a no-op against the target's current values, we do not write.
This alone makes loops terminate: a loop requires each hop to change something.

**D4 — Loop breaker.** A per-link counter of writes within a sliding window
(default: 6 writes / 5 min). Exceeding it **pauses the link**, quarantines with
reason `LOOP_SUSPECTED`, and alerts. Nothing is more expensive than a silent
loop generating 40 000 audit entries overnight.

## 2. Change detection and watermarks

```
watermark(flow, side) = { cursor, lastAdvancedAt, safetyMarginSec }
```

- Cursor advances only after **all** work items derived from that window reach a
  terminal outcome (synced, dropped, or quarantined). A quarantined item does not
  block the watermark — it is durably recorded, so re-processing it is not needed.
- The effective query lower bound is `cursor - safetyMargin` (default 120 s),
  because both systems have coarse or slightly lagging modification timestamps.
- Overlap is safe because of INV-3 (hash dedupe).
- Watermarks are persisted transactionally with the work-item outcomes.

## 3. Ordering

Guaranteed: **per link, writes apply in source-observed order.**
Not guaranteed: cross-record ordering (e.g. a Change Task syncing before its
Change Notice).

Handling of the parent-not-yet-synced case:
- Mapping requests the parent link.
- If missing, the work item is **deferred** (re-queued with backoff, max 5
  attempts) rather than creating an orphan or a placeholder parent.
- After max attempts, quarantine with `PARENT_NOT_SYNCED`.

## 4. Conflict detection and resolution

A conflict exists when, since the last successful sync of a link:

- side A changed field F, **and**
- side B changed field F to a different value, **and**
- F is mapped `bidirectional`.

Detection uses the stored per-side snapshot (`links.last_synced_hash_a/b` plus a
per-field value snapshot for bidirectional fields only — full snapshots are
unnecessary and expensive).

Resolution by policy:

| Policy | Action |
|---|---|
| `source_wins` / `target_wins` | Overwrite loser; record an audit event `CONFLICT_RESOLVED_BY_POLICY` with both values |
| `last_writer_wins` | Compare source-system timestamps; tie → source wins; record both values |
| `manual` | No write. Quarantine `CONFLICT_MANUAL` with a side-by-side diff and one-click "take A / take B / merge" in the console |

Write-time conflict (someone changed the target between our read and write) is
detected by the conditional write on `versionToken` and results in a **retry of
the whole pipeline for that record** (re-fetch, re-map), not a blind overwrite.
Max 3 such retries, then quarantine `WRITE_CONTENTION`.

## 5. Retries and backoff

| Error class | Behaviour |
|---|---|
| Network / 5xx / timeout | Exponential backoff 2s,4s,8s,16s,32s; jitter; max 6 attempts |
| 429 | Honour `Retry-After`, do not count against the attempt budget |
| 401/403 | Fail the flow fast, alert `AUTH_FAILURE`; do not retry-storm |
| 400 validation | No retry — quarantine `TARGET_REJECTED` with the response body |
| Windchill `checked out` | Defer: retry at 5m, 15m, 1h, 4h; then quarantine |
| Mapping error | No retry — quarantine `MAPPING_ERROR` |

A circuit breaker per endpoint opens after N consecutive failures, pauses polling
for that endpoint, and emits an alert; it half-opens on a schedule.


## 5a. Volume control and checkpointing (ADR-0011)

Requirements and change objects are low-volume. Test Runs are not — a nightly
regression can produce thousands. The engine must treat them differently.

| Entity class | Detection | Sync unit |
|---|---|---|
| Requirement Epic, ECR, ECN, document, part | Poll on modified timestamp | The entity |
| Test, Test Set, Test Plan | Poll (Jira issues) | The entity |
| **Test Execution** | Poll + completion predicate | **The checkpoint** |
| **Test Run** | Never polled directly | Read via Xray only when its execution checkpoints |

Completion predicate, configurable per flow:

```yaml
testExecution:
  completeWhen: all_runs_terminal   # all_runs_terminal | issue_closed | either
  incompleteAgeAlertHours: 72
```

Rules:
- Never query `getTestRuns` across all executions. Query per checkpointed
  execution, paginated (Xray caps at 100/page).
- An execution that never completes never checkpoints — hence the age alert, and
  hence the completeness gate in `14` §5 blocks a baseline containing one.
- Re-opening a completed execution produces a new checkpoint; the roll-up is
  recomputed and the coverage status may move backwards. That is correct
  behaviour, and the audit trail records both.

## 5b. Derived-state recomputation

Staleness (`13` §3), coverage roll-up (`13` §4) and impact caches (`15` §5) are
**derived**, not synced. They are recomputed when:

| Trigger | Recompute |
|---|---|
| Windchill object revision changes | Staleness for every T1 link targeting it, then coverage for affected requirements |
| Test Execution checkpoints | Coverage for every requirement its tests cover |
| T1 link created/superseded | Staleness + coverage for that requirement |
| BOM structure changes | Invalidate `where_used_cache` for the affected subtree |
| Nightly reconciliation | Everything in scope, as a correctness backstop |

Recomputation is idempotent and cheap enough to re-run freely. When in doubt,
recompute — a stale derived value is a silent correctness failure, and INV-T2
depends on these being current.

## 6. Reconciliation sweep

Polling on modification timestamps cannot see: deletions, permission changes,
records modified while the Bridge was down and whose timestamp fell outside the
overlap window, and drift caused by manual edits on the target.

Therefore a scheduled **reconciliation** (default: nightly, off-hours):

1. Enumerate all active links for the flow.
2. Fetch both sides (cheap fields only, batched).
3. Compare hashes; re-sync drifted pairs.
4. Detect a missing source record → mark link `SOURCE_MISSING`, do **not** delete
   the target; raise a review item.
5. Detect a missing target record → depending on `onTargetDeleted`:
   `recreate` | `unlink` | `review` (default `review`).
6. Emit a reconciliation report (counts, drift rate) — this is also the customer's
   periodic evidence that the integration is functioning.

## 7. Backfill / initial load

Distinct from steady-state sync and always operator-driven:

1. **Scope** by filter, with a hard record cap and an estimated-duration preview.
2. **Dry run** producing a full diff report (creates, updates, conflicts,
   unresolvable users, unmapped enum values).
3. Operator approval.
4. **Throttled execution** with a rate ceiling well below the steady-state cap,
   checkpointed so it can be paused and resumed.
5. Backfill writes are tagged `origin: backfill` in the audit trail.

Never let a backfill and a live flow write the same link concurrently — the
backfill takes the link's advisory lock.

## 8. Deletion and archival semantics

The Bridge **never deletes** a record in a target system. Ever. Options on source
deletion/cancellation:

- `annotate` (default): comment + managed-block note + optional label
  `windchill-deleted`.
- `transition`: move to a configured terminal state (requires `allowReopen`-style
  explicit opt-in).
- `unlink`: break the link, stop syncing, keep both records.

Rationale: deletion is irreversible, cross-system, and in a regulated context
destroys evidence. An accidental filter change must never be able to delete a
thousand Jira issues.

## 9. Pause, resume, and safe mode

- Any flow can be paused; queued items persist.
- **Safe mode** (global kill switch) suspends all writes while continuing to
  detect and record events — so nothing is lost and the backlog is visible.
  This is the first thing an operator reaches for during an incident.
- Resume replays from the last watermark; INV-3 keeps it cheap.

## 10. Pseudocode of the write phase

```ts
async function applyMutation(link, mutation, observedVersion) {
  return db.tx(async t => {
    await t.advisoryLock(link.id);
    const pending = await t.insertPendingWrite({
      linkId: link.id, side: mutation.side,
      expectedHash: hashOfExpectedResult(mutation),
      writeId: mutation.idempotencyKey,
      expiresAt: now() + 2 * P99_PROPAGATION,
    });
    try {
      const result = await target.update(mutation, observedVersion); // conditional
      await t.updateLink(link.id, {
        lastSyncedHash: result.payloadHash,
        versionToken: result.versionToken,
        lastSyncedAt: now(),
      });
      await t.appendAudit({ type: 'WRITE_APPLIED', link, mutation, result });
      return result;
    } catch (e) {
      await t.deletePendingWrite(pending.id);
      throw classify(e);   // → retry | defer | quarantine
    }
  });
}
```

Note the ordering: the pending-write row is committed *before* the external call
completes, so an echo arriving faster than our own commit still finds it.
If the process crashes after the external call but before commit, the next run
re-fetches, sees the target already matches (INV-3), and converges — this is why
idempotency and re-fetch matter more than distributed transactions.
