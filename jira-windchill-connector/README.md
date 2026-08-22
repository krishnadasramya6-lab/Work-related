# Jira ⇄ Windchill Design Control Bridge — Context Pack

Specification and context layer for a bidirectional integration that keeps an
unbroken design control trace across **Jira + Xray** (requirements, V&V) and
**PTC Windchill** (documents, parts, BOM, change, project management).

**No connector code exists yet.** This repository holds the context engineering:
vocabulary, traceability model, architecture, integration contracts, mapping
specification, compliance design, and scoped work packages.

## Start here

- **`CLAUDE.md`** — root context. Read it first; it routes you to the right doc.
- **`docs/13-traceability-model.md`** — the trace chain. The centre of the product.

## The scope split

| Domain | System |
|---|---|
| Requirements (design inputs) | Jira — native Epics |
| Verification & Validation | Jira + Xray |
| Documents, Parts, BOM | Windchill |
| Change management (ECR/ECN) | Windchill |
| Project / phase gates | Windchill |
| Approvals & e-signature | Windchill (sole authority) |

The tool boundary runs through the middle of the design control V-model. The
trace chain ISO 13485 §7.3 and 21 CFR 820.30 require crosses it at least four
times. This is not a convenience integration — it is the design control system.

## The four settled decisions

| # | Decision | ADR |
|---|---|---|
| 1 | **Posture A** — Jira is the working surface; Windchill holds the controlled record | ADR-0008 |
| 2 | **Xray only** for test management | ADR-0009 |
| 3 | **Requirements are Epics**, discriminated from change work packages by a required field | ADR-0010 |
| 4 | **Checkpoint-based result sync** — Test Executions, never individual Test Runs | ADR-0011 |

## Contents

| Path | What it is |
|---|---|
| `CLAUDE.md` | Root context, settled decisions, six rules, context routing |
| `docs/00-product-brief.md` | Objectives O1–O9, personas, use cases, success metrics |
| `docs/01-glossary.md` | Windchill / Jira / Xray / baseline / regulatory vocabulary |
| `docs/02-domain-model.md` | Canonical entities, Epic discriminator, Xray API boundary, invariants |
| `docs/03-system-architecture.md` | Topology, services, pipeline, ports, concurrency |
| `docs/04-integration-contracts.md` | Jira, **Xray**, and Windchill APIs with verification status |
| `docs/05-mapping-spec.md` | Field, state, party, attachment and projection mapping |
| `docs/06-sync-engine.md` | Echo suppression, watermarks, conflicts, volume control, derived state |
| `docs/07-reliability-observability.md` | Quarantine, metrics, tracing, alerts, capacity |
| `docs/08-security-compliance.md` | Posture A validation boundary, Part 11, ALCOA+, risk |
| `docs/09-data-model.md` | PostgreSQL schema incl. trace links, baselines, where-used cache |
| `docs/10-api-surface.md` | Bridge REST API — trace, baselines, impact, gate readiness |
| `docs/11-testing-strategy.md` | Test pyramid, properties, chaos, 25 acceptance scenarios |
| `docs/12-roadmap.md` | M0–M9 with exit criteria and sequencing rationale |
| **`docs/13-traceability-model.md`** | **The trace chain, T1–T5 links, staleness, coverage roll-up** |
| **`docs/14-baseline-and-publish.md`** | **Snapshot → controlled Windchill documents (Posture A engine)** |
| **`docs/15-change-impact.md`** | **Automated re-verification scoping** |
| `docs/adr/` | Eleven accepted decision records |
| `docs/examples/` | Reference flow YAMLs, trace link, baseline snapshot, audit event |
| `context-packs/` | Eight scoped briefs for handing work to an agent or engineer |

## The mechanism that matters most

Every cross-boundary link records the Windchill revision it was asserted
against. When that revision moves, the link goes stale and the requirement's
verification status drops from `PASSED` to `STALE` — however green its last test
run was.

A requirement whose design output has revised is not verified any more. Almost
every organization gets this wrong manually, and it is exactly what an auditor
probes when they ask *"how do you know this test result is still valid?"*

## Next step

`context-packs/pack-05-discovery-spike.md` (M0). Three API surfaces now need
verification — Windchill, Xray and Jira — and Windchill's remains the largest
schedule risk.
