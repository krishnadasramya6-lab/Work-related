# ADR-0012 — Jira has its own requirement-level Change Request; Windchill remains the sole formal change record

**Status:** Accepted

## Context
The approach note (26-JAN-2026) shows Change Management and Impact Assessment
appearing natively in both systems: **Physical View** in Windchill, **Logical
View** in Jira, connected by a Change Control Notification. Confirmed with the
architecture owner: Windchill's ECR/ECN remains the only formally controlled
change record — but **Jira will also carry its own requirement-level Change
Request**, raised directly by engineers when a requirement itself needs to
change, not only as a Bridge-drafted stub.

This supersedes the original design in `docs/15-change-impact.md` §3 (pre-ADR-
0012), where Direction B had the Bridge silently prepare a **draft** ECR when a
baselined, released requirement changed. That design assumed Jira had no
change-record entity of its own. It now does.

## Decision
A new canonical entity, `requirement_cr`, native Jira issue type **"Change
Request"** (distinct from the Epic used for Requirements and from the Epic used
for Change Work Packages — three different things now carry the word "change").

- An engineer raises a `requirement_cr` directly in Jira, linked to the
  requirement Epic(s) it affects. This is the **Logical View** the deck names.
- The Bridge assesses, per the same threshold as before (`15` §3): are the
  linked outputs RELEASED, and is the requirement in an approved baseline?
  - **If yes**, formal change control is required. The Bridge creates a linked
    Windchill ECR (**T6**, `docs/13` §2) and the `requirement_cr` tracks the
    ECR's decision as it progresses — this is the **Physical View** and the
    **Change Control Notification** the deck names.
  - **If no**, the `requirement_cr` can be resolved inside Jira alone (e.g. a
    requirement not yet baselined, or referencing a design output still in
    work) — no Windchill record is created.
- Windchill's ECR/ECN remains the **sole formally controlled** change record.
  The Jira `requirement_cr` is a real Jira record, not a draft — but it does not
  itself carry approval, effectivity or e-signature. Posture A (ADR-0008)
  applies to it exactly as it applies to requirements and V&V.

## Consequences
+ Matches the confirmed architecture: two real records, one controlled.
+ Engineers get a natural, logical-level entry point for "this requirement
  needs to change" without first understanding Windchill's change process.
+ The threshold logic from `15` §3 is preserved — only released, baselined
  work triggers a Windchill ECR — so low-stakes, still-in-work changes don't
  generate change-control overhead they don't need.
− A third "Change"-flavoured Jira entity (Requirement Epic, Change Work Package
  Epic, Requirement CR) raises real confusion risk. Mitigated by using a
  **distinct issue type** (`Change Request`, not `Epic`) rather than a further
  overload of the `Epic Category` discriminator (ADR-0010) — the two change
  concepts are visibly different issue types in Jira's own UI.
− `requirement_cr` and `change_work_package` (ADR-0010) can both exist for the
  same ECR — one is the Jira-native change request that triggered it, the other
  is the Epic tracking the engineering work the ECN spawns. They are linked but
  not merged; do not conflate them in the trace matrix.
