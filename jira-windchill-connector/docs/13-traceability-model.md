# 13 — Design Control Traceability Model

The central document. Everything else serves this.

## 1. The chain

```
  USER NEED                     Windchill WTDocument (User Needs / Intended Use)
      │ derived_from
      ▼
  DESIGN INPUT                  Jira Epic  [Epic Category = Requirement]
  (requirement)                     │
      │ decomposes_to (issue link)  │ verified_by
      ▼                             ▼
  SUB-REQUIREMENT               Xray Test ──► Test Execution ──► result
  (Jira Epic)                       (Jira)      (Jira issue)     (Xray-only)
      │ satisfied_by
      ▼
  DESIGN OUTPUT                 Windchill WTDocument (spec) │ WTPart │ EPMDocument
      │ used_in (BOM)
      ▼
  ASSEMBLY / PRODUCT            Windchill WTPart structure
      │
      │ affected_by
      ▼
  REQUIREMENT CR                Jira issue type "Change Request"  (Logical View,
  (requirement-level,                ADR-0012) — engineer-raised, real Jira record
   engineer-raised)                  │
      │ raises_change (T6, if formal control required)
      ▼
  CHANGE                        Windchill ECR ──► ECN   (Physical View — the
      │ implemented_by                │             sole formally controlled record)
      ▼                               ▼
  CHANGE WORK PACKAGE           Jira Epic  [Epic Category = Change]
      │
      ▼
  RELEASE                       Windchill lifecycle RELEASED, part revision bump
      │
      ▼
  BASELINE PUBLICATION          Windchill WTDocument: SRS, V&V Plan, V&V Report,
                                Trace Matrix  (see 14-baseline-and-publish.md)
```

Five of these arrows cross the tool boundary. Those five are the product.

## 2. Cross-boundary link types

These are the only link types the Bridge maintains. Each is a row in `trace_links`
(`09-data-model.md`), each is revision-aware, and each is auditable.

| # | Link | From | To | Owner of the assertion |
|---|---|---|---|---|
| **T1** | `satisfied_by` | Jira Epic (Requirement) | Windchill WTDocument / WTPart | Engineer, asserted in Jira |
| **T2** | `verified_by` | Jira Epic (Requirement) | Xray Test | Xray native coverage |
| **T3** | `implemented_by` | Windchill ECR | Jira Epic (Change) | Bridge, on ECR creation |
| **T4** | `impacts` | Windchill Part/Doc revision | Jira Requirement / Test | Bridge, **derived** (see `15`) |
| **T5** | `published_as` | Bridge baseline snapshot | Windchill WTDocument revision | Bridge, on publication |
| **T6** | `raises_change` | Jira `requirement_cr` (Logical View) | Windchill ECR (Physical View) | Bridge, created when the threshold in `15` §3 is met (ADR-0012) |

T2 is intra-Jira and Xray computes it natively — we **consume** Xray's coverage
rather than reinventing it. But it must be *projected into Windchill*, because
the Windchill-side reviewer cannot see Jira.

T4 is derived, not asserted. It is recomputed on every change; it is never a
stored user intent. Treat a stored T4 row as a cache with an invalidation rule.

T6 links a **real, human-raised** Jira record to a Windchill ECR — not every
`requirement_cr` gets one (`15` §3 threshold). Windchill's ECR/ECN stays the
sole *formally controlled* change record; the Jira Change Request is a real
record but not a controlled one, same as requirements and V&V (ADR-0008).

## 3. Revision-awareness — the core mechanism

This is rule 2 of the six, and the thing that makes the difference between a
trace matrix that means something and one that merely exists.

Every T1 link stores, at the moment the link was created or last confirmed:

```ts
type TraceLink = {
  id: string;
  type: 'satisfied_by' | 'verified_by' | 'implemented_by' | 'impacts' | 'published_as';
  jiraKey: string;                  // "REQ-142"
  windchillOid: string;
  windchillNumber: string;          // "SPEC-0031"
  /** The Windchill revision this assertion was made against. */
  assertedAgainstRevision: string;  // "B"
  assertedAt: string;
  assertedBy: Party;
  /** Recomputed continuously. */
  currentRevision: string;          // "C"
  staleness: 'current' | 'stale' | 'unknown';
  supersededAt?: string;
};
```

### The staleness rule

```
IF   currentRevision != assertedAgainstRevision
THEN link.staleness = 'stale'
     AND every Xray Test verifying the linked requirement is marked
         REQUIRES_REVERIFICATION
     AND the requirement's coverage status is reported as STALE, never PASSED
```

The second clause is the one that matters. A requirement whose design output has
revised is **not verified** any more, however green its last test run was. Almost
every organization gets this wrong manually, and it is exactly what an auditor
probes when they ask "how do you know this test result is still valid?"

`unknown` is a distinct state, not a synonym for current. If the Bridge cannot
determine the current revision (Windchill unreachable, object permissions), it
must report `unknown` and never silently assume `current`.

## 4. Coverage status roll-up

Per requirement Epic, computed by the Bridge and written back to Jira as a
read-only field, and projected into Windchill:

| Status | Meaning |
|---|---|
| `NOT_COVERED` | No T2 link — no test verifies this requirement |
| `NOT_RUN` | Tests exist, no completed Test Execution |
| `IN_PROGRESS` | Test Execution open |
| `FAILED` | Latest completed execution has failures |
| `PASSED` | Latest completed execution all-pass **and** no T1 link is stale |
| `STALE` | All-pass, but a linked design output has revised since |
| `BLOCKED` | Xray-reported blocked runs |

`PASSED` deliberately depends on T1 staleness. That coupling is the whole point;
do not let an optimisation break it.

## 5. Gate readiness

A Windchill phase gate or ECN release is *ready* when, for its scope:

- [ ] Every requirement Epic has coverage status `PASSED`
- [ ] Zero T1 links in `stale` or `unknown`
- [ ] Every linked Windchill design output is at a released revision
- [ ] Baseline documents published and **approved** in Windchill (`14`)
- [ ] Zero open quarantine items for the flow

The Bridge **computes and exposes** this readiness signal. Windchill's workflow
**enforces** it. We never gate a workflow ourselves — we supply the fact, the PLM
system makes the decision. This keeps the enforcement inside the validated
system of record.

## 6. Requirement hierarchy — a known limitation

Jira Epics cannot nest. MedTech design control normally wants
*user need → system requirement → subsystem requirement → component requirement*.

Approach: hierarchy is expressed with **Jira issue links** of type
`decomposes_to` / `derived_from` between Epics, not with parent-child.

Consequences to design around:
- Depth is unbounded and cycles are possible. The Bridge **must** cycle-detect
  when walking the hierarchy, with a configurable max depth (default 6).
- Jira's UI will not render the tree. The Bridge's trace matrix and the published
  SRS are where the hierarchy becomes visible — which raises their importance.
- Advanced Roadmaps will not understand this hierarchy. Accepted.

If requirement volume or hierarchy depth grows painful, revisit ADR-0010; a
requirements add-on solves this natively. Flag it rather than working around it
indefinitely.

## 7. The trace matrix (primary deliverable)

One row per requirement, produced on demand and at every baseline:

| Column | Source |
|---|---|
| Requirement ID / title | Jira Epic key + summary |
| Parent requirement | T-hierarchy issue link |
| Requirement revision | Baseline sequence number (Jira has none — see `14`) |
| Design output(s) | T1 → Windchill number + revision |
| Output lifecycle state | Windchill |
| Link staleness | T1 computed |
| Verification method | Xray Test type |
| Test ID(s) | Xray Test key |
| Latest execution + date | Xray Test Execution |
| Result | Xray, rolled up per §4 |
| Coverage status | Computed per §4 |
| Open defects | Xray defect links |
| Governing change | T3 → ECR/ECN number |
| Evidence location | Windchill published doc + revision |

Export formats: CSV, XLSX, PDF. The PDF form is attached to the published
baseline (`14`) and becomes the controlled record.

Target: any auditor question of the form *"show me the trace and change history
for requirement X"* is answered self-service in under five minutes.

## 8. Invariants

- `INV-T1` A T1 link always carries `assertedAgainstRevision`. A link without one
  is invalid and must be quarantined, not defaulted to current.
- `INV-T2` Coverage status `PASSED` is impossible while any T1 link on that
  requirement is `stale` or `unknown`.
- `INV-T3` T4 (`impacts`) is never persisted as user intent — it is derived and
  recomputed; a stale T4 cache is invalidated on any revision change.
- `INV-T4` Hierarchy traversal is cycle-safe and depth-limited.
- `INV-T5` Gate readiness is computed by the Bridge and enforced by Windchill —
  never enforced by the Bridge.
