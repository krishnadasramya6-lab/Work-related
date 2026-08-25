# 11 — Testing Strategy

The canonical model exists so that the hard logic can be tested without a live
Windchill. Exploit that.

## 1. Test pyramid

| Layer | What | Count | Runs where |
|---|---|---|---|
| Unit | Mapping transforms, state resolution, party resolution, hash/dedupe, conflict policy | ~hundreds | Every commit |
| Contract | Connector ↔ recorded API fixtures (VCR-style cassettes) | ~dozens per connector | Every commit |
| Integration | Full pipeline against **fakes** implementing the port interfaces with realistic semantics | ~dozens | Every commit |
| System | Against a real Jira sandbox + a Windchill test instance | ~30 scenarios | Nightly / pre-release |
| Validation (OQ) | Scripted, evidence-producing runs mapped to requirements | per release | Release gate |

## 2. Fakes must model the nasty bits

A fake that just stores JSON teaches you nothing. The fake Jira must enforce
workflow transitions, required fields on transition screens, ADF shape, rate
limits (429 with `Retry-After`), and minute-granularity `updated`. The fake
Windchill must enforce checkout locks, iteration-on-save, RELEASED immutability,
container requirements for create, and CSRF nonces.

Every bug found in production against a real system gets a corresponding
behaviour added to the fake, permanently.

## 3. Property-based tests (highest value here)

| Property | Statement |
|---|---|
| Staleness soundness | No requirement reports `PASSED` while any of its T1 links is `stale` or `unknown` (INV-T2) |
| Snapshot purity | Rendering the same snapshot with the same template version always yields identical content (INV-B2) |
| Traversal termination | BOM and requirement-hierarchy traversal terminates on any graph, including cyclic ones (INV-T4) |
| Convergence | For any sequence of source/target edits, running the engine to quiescence yields a state where mapped fields agree per ownership policy |
| Idempotency | Processing the same event N times produces the same final state and exactly one target record |
| No-loop | Given symmetric bidirectional mapping and no external edits, the engine reaches quiescence within K writes |
| Replay safety | Replaying the event log from any point produces the same links table |
| Monotonic watermark | The watermark never advances past an unprocessed event |
| No creation without link | Every target create is preceded by a committed `PENDING` link row |

## 4. Chaos / fault injection scenarios

- Kill a worker mid-write (after external call, before commit) → expect
  convergence, zero duplicates.
- Kill during baseline publish between document create and approval submission →
  resume without creating a duplicate Windchill revision.
- Xray token expires mid-execution-sync → refresh and resume, no lost results.
- Duplicate webhook delivery ×5 → one write.
- Out-of-order events (child before parent) → deferral then success.
- Target returns 200 but did not persist (simulated) → next reconcile repairs.
- Clock skew ±10 min between Bridge and Jira → no data loss (tokens, not clocks).
- Windchill returns 500 for 10 min → circuit opens, backlog drains after recovery.
- Config activated with a bad enum map → dry run blocks it; if forced, quarantine
  grows and nothing is corrupted.

## 5. System-test scenario catalogue (the acceptance list)

| # | Scenario | Expected |
|---|---|---|
| S1 | Link requirement Epic to Windchill spec | T1 link created with `assertedAgainstRevision`; visible both sides |
| S2 | Revise the linked spec B → C | Link goes `stale`; requirement coverage drops from `PASSED` to `STALE`; tests marked `REQUIRES_REVERIFICATION` |
| S3 | Epic created without `Epic Category` | Quarantined `UNMAPPED_VALUE`; never guessed, never defaulted |
| S4 | Change Epic (category `Change`) enters Xray coverage | Filtered out of requirement coverage roll-up |
| S5 | Test Execution completes with all-pass | Coverage → `PASSED` (only if no stale T1); projected into Windchill |
| S6 | Test Execution completes with a failure | Coverage → `FAILED`; defect link surfaced in trace matrix |
| S7 | 2,000 Test Runs in one nightly execution | One checkpoint sync at completion; zero per-run writes to Windchill |
| S8 | Test Execution left permanently open | Age alert fires; completeness gate blocks a baseline containing it |
| S9 | Baseline published, approved in Windchill | Documents at rev A; membership recorded on every in-scope issue |
| S10 | Re-publish same scope after edits | Windchill rev B; drift report resets |
| S11 | Regenerate documents from a stored snapshot | Content-identical to the original publication |
| S12 | Baseline attempted with a `FAILED` coverage in scope | **Blocked**; publishes only with a recorded, justified override |
| S13 | Jira issue deleted after being baselined | Snapshot renders unaffected — it holds values, not references |
| S14 | ECR raised on a part | Change Work Package Epic created; impact set computed < 30 s |
| S15 | ECN touching 300 parts | Impact runs as a background job; BOM traversal depth-limited and cycle-safe |
| S16 | BOM containing a cycle via a substitute | Traversal terminates; no stack overflow, no duplicate impact rows |
| S17 | `NO_IMPACT` classification submitted with no justification | Rejected by the API |
| S18 | Material change to a baselined requirement with released outputs | Draft ECR prepared; requirement flagged `awaiting_change_control` |
| S19 | Windchill unreachable during staleness computation | Links report `unknown`, never `current` |
| S20 | Gate readiness query with one stale link | Not ready; the blocking link is named |
| S21 | Bridge stopped 4 h, restarted | All missed changes propagate; no duplicates; watermark recovers |
| S22 | Bridge DB restored to T−24 h | Links rebuilt via correlation fields; zero duplicate creates |
| S23 | Human edits a `read_only_display` field in Jira | Reverted on next sync with an audit event |
| S24 | Audit export for one requirement | Complete chronological history; chain verification passes |
| S25 | Deliberate audit row tamper (test DB) | `/audit/verify` reports the break at the correct sequence |

## 6. Data for testing

- A seeded Windchill test container with representative soft types, and a Jira
  sandbox project cloned from the customer's real workflow (workflows are where
  the surprises live — clone them, don't invent them).
- Anonymized production-shaped fixtures for mapping unit tests.
- Never test against production. The dry-run path exists so that production-shape
  validation does not require production writes.

## 7. Definition of done for any sync feature

- [ ] Unit tests for the mapping logic, including the unmapped/missing cases
- [ ] Fake-based integration test for the happy path and one failure path
- [ ] Quarantine reason code defined and documented if a new failure exists
- [ ] Metric and audit event emitted
- [ ] Docs updated (mapping spec / contracts / this file)
- [ ] Dry-run output shows the change sensibly
- [ ] Idempotency verified by running the scenario twice
