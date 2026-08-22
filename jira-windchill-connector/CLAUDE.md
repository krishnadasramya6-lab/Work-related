# CLAUDE.md — Jira ⇄ Windchill Design Control Bridge

> Root context for any agent or engineer on this product. Read this first, then
> load only the doc(s) your task needs from the routing table in §7.

## 1. What we are building

A bidirectional integration that keeps an **unbroken design control trace** across
two systems that between them own the whole V-model.

| Owns | System |
|---|---|
| Requirements (design inputs) | **Jira** — native Epics |
| Verification & Validation | **Jira + Xray** |
| Documents, Parts, BOM | **Windchill** |
| Change management (ECR/ECN) | **Windchill** |
| Project / phase gates | **Windchill** |
| Controlled records & approvals | **Windchill** |

The tool boundary runs straight through the middle of the design control
V-model. The trace chain that ISO 13485 §7.3 and 21 CFR 820.30 require —
*need → input → output → verification → change → release* — crosses that
boundary at least four times.

**This is not a convenience integration. It is the design control system.**
If it fails, the company does not have a slow process; it has an unprovable one.

## 2. The four settled decisions

These are decided. Do not relitigate them in code review; open an ADR if you
believe one is wrong.

| # | Decision | ADR |
|---|---|---|
| 1 | **Posture A.** Jira is the *working surface*; Windchill holds the *controlled record*. Baseline-and-publish is mandatory, not optional. | ADR-0008 |
| 2 | **Xray only** for test management. No Zephyr, no native-issue-type V&V. | ADR-0009 |
| 3 | **Requirements are Jira Epics.** Each Windchill ECR also gets its own Epic as a change work package, discriminated by a required field. | ADR-0010 |
| 4 | **Checkpoint-based result sync.** Test *Executions* at completion, never individual Test Runs. | ADR-0011 |

## 3. Why Posture A shapes everything

Jira has no revision control, no approval workflow, no effectivity, and no
e-signature. Requirements and V&V results *are* design control records. So:

- Engineers work freely in Jira. Nothing is frozen there.
- At each baseline — design review, phase gate, release — the Bridge **renders
  the Jira state into controlled Windchill documents** (SRS, V&V Plan, V&V
  Report, Trace Matrix) and submits them to Windchill's approval lifecycle.
- **Windchill's approval, with its e-signature, is what makes the record
  controlled.** The Bridge never creates or transfers a signature.
- Between baselines, the Bridge reports **drift**: how far current Jira state has
  moved from the last approved baseline. Drift is the signal to re-baseline.

Consequence: Jira needs only light validation. That is the entire point of
Posture A, and it is worth a lot of money and ongoing freedom for the Jira admins.

## 4. Architectural stance (the six rules)

1. **Every synced pair has a stable link record.** Never fuzzy title matching.
2. **Every cross-boundary link is revision-aware.** A link records the Windchill
   revision it was made against. This is what makes staleness detectable.
3. **Sync is idempotent and replayable.**
4. **Loops are structurally impossible, not heuristically avoided.**
5. **Field ownership is explicit per-field, per-direction.**
6. **Everything is an event in an append-only, hash-chained log.**

## 5. Non-goals

- **Not** a replacement for Jira, Xray or Windchill. Never a third source of truth.
- **Not** a CAD translator. Metadata and links only.
- **Not** a BOM authoring tool. BOM is read-only projection from Windchill.
- **No** e-signature creation or transfer (Posture A depends on this).
- **No** per-Test-Run sync. Volume would flood Windchill and destroy the value
  of the controlled record.
- **No** deletes in either target system, ever.
- **No** direct database writes. Supported APIs only.

## 6. Working agreements for agents

- **State assumptions in the artifact, not just in chat.**
- **Never invent an API shape.** Mark `// VERIFY:` and add it to the checklist in
  `docs/04-integration-contracts.md`, which tracks verification status per endpoint.
- **Xray Test Runs are not Jira issues.** They are reachable only via the Xray
  API. Getting this wrong is the most likely early design error.
- **Mapping changes are breaking changes** — migration note + schema version bump.
- Compliance-relevant paths are tagged `// GxP`; changing one requires updating
  `docs/08-security-compliance.md` and the traceability matrix.

## 7. Context routing — load what you need

Ordered by centrality, not by number.

| If your task is about… | Read |
|---|---|
| **The trace chain and staleness rules** (start here) | `docs/13-traceability-model.md` |
| **Baseline snapshots → controlled Windchill documents** | `docs/14-baseline-and-publish.md` |
| **Change impact analysis, re-verification scope** | `docs/15-change-impact.md` |
| Objectives, personas, success measures | `docs/00-product-brief.md` |
| Vocabulary (Windchill, Xray, regulatory) | `docs/01-glossary.md` |
| Canonical entities, identity, invariants | `docs/02-domain-model.md` |
| Services, deployment, pipeline | `docs/03-system-architecture.md` |
| Calling Jira, Xray or Windchill APIs | `docs/04-integration-contracts.md` |
| Field/state/party mapping rules | `docs/05-mapping-spec.md` |
| Change detection, conflicts, retries, volume control | `docs/06-sync-engine.md` |
| Failures, quarantine, metrics, alerting | `docs/07-reliability-observability.md` |
| Auth, Part 11, audit trail, validation package | `docs/08-security-compliance.md` |
| Tables, indexes, retention | `docs/09-data-model.md` |
| Bridge REST API and config format | `docs/10-api-surface.md` |
| Writing or reviewing tests | `docs/11-testing-strategy.md` |
| Sequencing, what to build first | `docs/12-roadmap.md` |
| Why a decision was made | `docs/adr/` |
| Concrete config/payload shapes | `docs/examples/` |
| Handing a scoped task to an agent | `context-packs/` |

## 8. Current status

Pre-implementation. This repository holds the **context and specification layer
only**. No connector code exists. First executable milestone is M1 in
`docs/12-roadmap.md`; the blocking prerequisite is the M0 discovery spike
(`context-packs/pack-05-discovery-spike.md`).
