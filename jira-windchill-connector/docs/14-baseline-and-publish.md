# 14 — Baseline & Publish

The engine of Posture A (ADR-0008). Jira is the working surface; this is how its
content becomes a controlled record.

## 1. Why this exists

Jira has no revision control, no approval workflow, no effectivity dates, and no
e-signature. Requirements and V&V results are design control records under
ISO 13485 §7.3 and 21 CFR 820.30, and must be approved, revision-managed and
retrievable.

Rather than validating Jira as a Part 11 record system — expensive, permanently
constraining, and fighting the tool — we snapshot Jira at defined moments and
publish an approved document into Windchill, which already is that system.

**The Windchill approval, with its e-signature, is what makes the record
controlled. The Bridge never creates or transfers a signature.**

## 2. Trigger points

| Trigger | Typical scope |
|---|---|
| Design review / phase gate | All requirements + V&V for the product in scope |
| ECN release | Requirements and tests touched by the change |
| Regulatory submission | Full product baseline |
| Periodic (e.g. quarterly) | Full product baseline, drift control |
| On demand | Operator-selected scope |

Triggered by an operator, by a Windchill workflow calling the Bridge API, or by
schedule. Never automatic on every Jira edit — that would defeat the purpose.

## 3. The pipeline

```
 (1) SCOPE      resolve the JQL/filter scope → concrete entity set
 (2) FREEZE     immutable snapshot: entities, field values, links, Xray results,
                content hashes, config version
 (3) VALIDATE   completeness gate (§5) — refuse to publish an incoherent baseline
 (4) RENDER     snapshot → SRS, V&V Plan, V&V Report, Trace Matrix (PDF + JSON)
 (5) PUBLISH    create/revise WTDocument(s) in the target Windchill container,
                attach PDF + machine-readable JSON, set attributes
 (6) SUBMIT     hand to Windchill's approval lifecycle — and stop
 (7) RECORD     write back document number + revision to the Jira baseline marker
                and to every entity in scope; store snapshot permanently
```

The Bridge's involvement ends at (6). Approval is Windchill's, by humans, with
signatures. Step (7) runs when the Bridge observes the approval, not before.

## 4. The snapshot

The snapshot — not the PDF — is the durable artifact.

```ts
type Baseline = {
  id: string;                    // "BL-ALPHA-2026-08-22-001"
  label: string;                 // "Design Review 2 — Alpha Pump"
  scope: { jql: string; resolvedKeys: string[]; productContainer: string };
  createdAt: string; createdBy: Party;
  configVersion: number;
  entities: SnapshotEntity[];    // full field values at freeze time
  traceLinks: TraceLink[];       // with assertedAgainstRevision preserved
  xrayResults: ExecutionSnapshot[];
  contentHash: string;           // sha256 over canonical JSON
  publication?: {
    windchillOids: Record<DocKind, string>;
    documentNumbers: Record<DocKind, string>;
    revision: string;            // "B"
    approvedAt?: string;         // set when Windchill approval observed
    approvers?: Party[];
  };
};
```

**Regeneration requirement:** re-rendering from a stored snapshot must produce
content-identical documents. Auditors do ask. This means renderers are pure
functions of `(snapshot, templateVersion)`, template versions are recorded, and
nothing in a renderer may read the clock, the network, or current Jira state.

## 5. Completeness gate

A baseline that publishes an incoherent picture is worse than no baseline. Refuse
to proceed — or require explicit, audited operator override with justification —
when any of these hold:

| Check | Default action |
|---|---|
| Requirement with no `verified_by` test | Warn; list in the document's gap section |
| Requirement with `NOT_RUN` coverage | Warn |
| Requirement with `FAILED` coverage | **Block** |
| T1 link `stale` or `unknown` | **Block** |
| Requirement with no `satisfied_by` design output | Warn |
| Linked Windchill output not at a released revision | Warn (block for release baselines) |
| Open quarantine items in scope | **Block** |
| Xray execution incomplete for a test in scope | Warn |

Every override is recorded in the audit trail with the operator, the reason, and
rendered into the published document's deviation section. A silent override must
be impossible.

## 6. Rendered documents

| Kind | Content | Windchill soft type |
|---|---|---|
| **SRS** (Design Input Specification) | Requirement hierarchy, full text, attributes, rationale, acceptance criteria, source user needs | `DesignInputSpecification` |
| **V&V Plan** | Test definitions, preconditions, test sets/plans, method, coverage map, sampling rationale | `VerificationValidationPlan` |
| **V&V Report** | Executions, results, evidence references, deviations, failure analysis, pass/fail summary | `VerificationValidationReport` |
| **Trace Matrix** | Full matrix per `13-traceability-model.md` §7 | `TraceabilityMatrix` |

Each publishes as a **WTDocument revision** in the product container. Republishing
the same scope creates revision B, C, … — Windchill's own revision control gives
us the versioning Jira lacks. That is the entire mechanism.

Both a PDF (human/approvable) and the canonical JSON (machine-readable, for
regeneration and downstream tooling) are attached to every document.

## 7. Drift reporting

After publication, Jira keeps moving — by design. The Bridge continuously reports
divergence from the last approved baseline:

```
GET /baselines/{id}/drift
→ { added: [...], removed: [...], modified: [{key, field, baselineValue, currentValue}],
    coverageChanged: [...], newStaleLinks: [...], driftScore: 0.14 }
```

Drift is surfaced per requirement in Jira and per product in the console. It is
the signal for when to re-baseline, and it is the honest answer to *"is the
approved SRS still an accurate description of the design?"* — a question most
organizations cannot answer at all.

Alert when `driftScore` exceeds a configured threshold, or when any requirement
in an approved baseline gains a `FAILED` or `STALE` coverage status.

## 8. Failure modes to design against

| Failure | Handling |
|---|---|
| Crash between (5) and (6) | Idempotency key on the WTDocument create; on retry, detect existing revision and resume at (6) |
| Windchill approval rejected | Baseline stays `published_pending`; drift continues; a new revision is published after fixes |
| Snapshot references a deleted Jira issue | Snapshot is self-contained — it holds values, not just references. Rendering never re-reads Jira |
| Template changed since publication | Template version stored per baseline; regeneration uses the original |
| Scope JQL returns different results later | Resolved keys are frozen in the snapshot, not the JQL |
| Two operators baseline the same scope concurrently | Advisory lock per (product, scope hash); second waits and sees the first |

## 9. Invariants

- `INV-B1` A snapshot is immutable once frozen. No field is ever updated except
  `publication`, and that only additively.
- `INV-B2` Rendering is a pure function of `(snapshot, templateVersion)`.
- `INV-B3` The Bridge never approves and never signs. It submits.
- `INV-B4` No baseline publishes with a `FAILED` coverage or `stale` T1 link in
  scope without a recorded, justified operator override.
- `INV-B5` Every entity in scope records its baseline membership, so any Jira
  item can answer "which approved baselines contain me, at what revision?"
