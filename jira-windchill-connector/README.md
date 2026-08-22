# Jira ⇄ Windchill PLM Integration — Context Pack

Specification and context layer for a bidirectional, audit-grade integration
between **Atlassian Jira** and **PTC Windchill PLM**, aimed at regulated
MedTech / hardware+software product development (comparable to OpsHub, Tasktop
Hub, ConnectALL, Kovair).

**No connector code exists yet.** This repository currently holds the context
engineering: the shared vocabulary, domain model, architecture, integration
contracts, mapping specification, engine design, compliance design, and the
scoped work packages needed to build it.

## Start here

- **`CLAUDE.md`** — root context. Read it first; it routes you to the right doc.

## Contents

| Path | What it is |
|---|---|
| `CLAUDE.md` | Root context, non-goals, architectural rules, context routing table |
| `docs/00-product-brief.md` | Personas, use cases, success metrics, competitive framing |
| `docs/01-glossary.md` | Windchill / Jira / Bridge / regulatory vocabulary |
| `docs/02-domain-model.md` | Canonical entity model, identity, states, invariants |
| `docs/03-system-architecture.md` | Topology, services, pipeline, ports, concurrency |
| `docs/04-integration-contracts.md` | Jira and Windchill API surfaces, with verification status |
| `docs/05-mapping-spec.md` | Field/state/party/attachment/comment mapping rules |
| `docs/06-sync-engine.md` | Echo suppression, watermarks, conflicts, retries, reconciliation |
| `docs/07-reliability-observability.md` | Quarantine, metrics, tracing, alerts, capacity |
| `docs/08-security-compliance.md` | AuthN/Z, audit trail, Part 11, ALCOA+, validation package |
| `docs/09-data-model.md` | PostgreSQL schema, retention, key queries |
| `docs/10-api-surface.md` | Bridge REST API, admin UI, config shape |
| `docs/11-testing-strategy.md` | Test pyramid, properties, chaos, acceptance scenarios |
| `docs/12-roadmap.md` | M0–M7 milestones with exit criteria and rationale |
| `docs/adr/` | Seven accepted architecture decision records |
| `docs/examples/` | Reference flow YAML and canonical payload samples |
| `context-packs/` | Scoped briefs for handing a work package to an agent or engineer |

## The five rules everything follows

1. Every synced pair has a stable link record — never fuzzy title matching.
2. Sync is idempotent and replayable.
3. Loops are structurally impossible, not heuristically avoided.
4. Field ownership is explicit per-field, per-direction.
5. Everything is an event in an append-only, hash-chained log.

## Next step

`context-packs/pack-05-discovery-spike.md` (M0). The largest schedule risk is
Windchill's real API surface, which varies by version, installed modules and
customization — retire that before writing connector code.
