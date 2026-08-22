# 00 — Product Brief & Objectives

## 1. One-liner

Keep an unbroken, machine-verifiable design control trace across Jira (+Xray),
which owns requirements and V&V, and Windchill, which owns documents, parts,
BOM, change and project management.

## 2. Scope split (settled)

| Domain | System | Role |
|---|---|---|
| Requirements / design inputs | Jira — native Epics | Working surface |
| Verification & Validation | Jira + Xray | Working surface |
| Documents, specifications | Windchill | Controlled record |
| Parts, BOM, product structure | Windchill | Controlled record |
| Change management (ECR/ECN) | Windchill | Controlled record |
| Project / phase gates | Windchill | Controlled record |
| Approvals & e-signature | Windchill | Sole authority |

## 3. Objectives

Stated as objective + measurable outcome. These are the acceptance criteria for
the programme, not aspirations.

**O1 — Maintain an unbroken, machine-verifiable trace chain across the tool
boundary.**
Every requirement traces to its design outputs, its verification, and any change
affecting it — as queryable links, not text references.
*Measure:* 100% of requirements have a complete trace chain at each gate; trace
matrix produced on demand in minutes.

**O2 — Make cross-boundary links revision-aware.**
A link knows which Windchill revision it was asserted against; when that revision
moves, linked verification is flagged stale.
*Measure:* zero requirements carrying `PASSED` status against a superseded
revision. This is the failure mode that quietly invalidates a V&V package.

**O3 — Automate change impact analysis in both directions.**
*Measure:* time to scope re-verification after a change drops from days to
minutes; impact analysis is reproducible and explainable, not tribal.

**O4 — Gate Windchill change and release on Jira verification evidence.**
The Bridge computes readiness; Windchill's workflow enforces it.
*Measure:* zero releases with incomplete or failed linked V&V evidence.

**O5 — Convert Jira working records into Windchill controlled records at defined
baselines.**
*Measure:* every design review and gate has an approved, revision-controlled
Windchill document that provably matches the Jira state at that instant.

**O6 — Give each side the context it needs without a second licence or login.**
Test engineers see part number, revision and governing spec revision in Jira;
design engineers see requirement coverage and test results in Windchill.
*Measure:* no growth in cross-tool licence demand; elimination of "which revision
am I testing against?" queries.

**O7 — Compute phase-gate readiness automatically.**
*Measure:* gate review preparation effort; accuracy of reported gate status.

**O8 — Produce audit and DHF evidence on demand across both systems.**
*Measure:* "show me the full trace and change history for requirement X" answered
self-service in under five minutes.

**O9 — Preserve single-system-of-record clarity.**
Every data element has exactly one owning system; the Bridge never becomes a
third truth.
*Measure:* zero data elements writable from both sides without a declared
ownership policy.

## 4. Personas

| Persona | Lives in | Pain today | What the Bridge gives them |
|---|---|---|---|
| **Requirements owner / systems engineer** | Jira | Writes requirements nobody can trace to design outputs | Live links to Windchill specs and parts, with staleness flags |
| **Test engineer** | Jira + Xray | Does not know which part revision the test applies to | Part/spec revision context in the Jira issue |
| **Design engineer** | Windchill | Cannot see whether requirements are verified | Coverage and results projected onto the Windchill object |
| **Change analyst / CCB chair** | Windchill | Manual impact analysis before every board | Automated, explainable impact set on the ECR |
| **QA / RA lead** | Neither, painfully | Assembles trace matrices by hand before audits | On-demand trace matrix; approved baselines in Windchill |
| **Program manager** | Both | Manual gate-readiness roll-up | Computed gate readiness |
| **Integration admin** | The Bridge | — | Config-as-code, dry run, quarantine console |

## 5. Primary use cases (ranked, drives the roadmap)

**UC-1 — Requirement ↔ design output linkage with staleness detection.**
The spine. Everything else depends on T1 links existing and being revision-aware.

**UC-2 — Verification coverage projection.**
Xray coverage and results roll up per requirement and become visible in Windchill.

**UC-3 — Baseline & publish.**
Snapshot Jira, render SRS / V&V Plan / V&V Report / Trace Matrix, publish as
controlled WTDocument revisions, submit to Windchill approval.

**UC-4 — Change impact analysis (Windchill → Jira).**
ECR/ECN produces a re-verification scope automatically.

**UC-5 — ECR change work package.**
Each Windchill ECR gets a Jira Epic; progress and completion roll back up.

**UC-6 — Gate readiness.**
Computed for a phase gate or ECN release; enforced by Windchill.

**UC-7 — Requirement change → change control (Jira → Windchill).**
A material change to a baselined requirement prepares a draft ECR.

**UC-8 — Context projection.**
Part/BOM/spec context read-only in Jira; coverage read-only in Windchill.

## 6. Out of scope

- CAD geometry transfer or viewable generation
- BOM authoring or write-back from Jira
- E-signature creation or transfer (ADR-0008 depends on this exclusion)
- Per-Test-Run synchronisation (ADR-0011)
- Zephyr, native-issue-type V&V, or requirements add-ons (ADR-0009, ADR-0010)
- Jira Service Management portals
- Windchill workflow authoring

## 7. Success metrics

| Metric | Target |
|---|---|
| Requirements with complete trace chain at gate | 100% |
| Requirements `PASSED` against a superseded revision | 0 (hard requirement) |
| Time to scope re-verification after a change | < 30 min (from days) |
| Trace matrix production time | < 5 min, self-service |
| Median propagation latency | < 60 s |
| p99 propagation latency | < 5 min |
| Duplicate records created by the Bridge | 0 (hard requirement) |
| Gate review preparation effort | −70% |
| Baseline publication → Windchill approval submission | < 15 min for a full product |
| Audit response time for a single-requirement trace | < 5 min |

## 8. Deployment assumptions

- Windchill is on-premise or private cloud, behind the corporate firewall, and
  must not be required to reach the public internet.
- Jira and Xray are Cloud (assumption to confirm in M0); the Bridge egresses to
  them over HTTPS and reaches Windchill over the LAN.
- **Xray Test Runs are not Jira issues** and require the separate Xray API. The
  connector talks to three APIs, not two.
