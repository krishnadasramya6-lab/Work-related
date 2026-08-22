# 12 — Roadmap

Sequenced so that the riskiest unknowns are retired first and every milestone is
demonstrable.

## M0 — Discovery & verification (1–2 weeks)

Goal: convert `ASSUMED` rows in `04-integration-contracts.md` into `CONFIRMED`.

- Obtain Windchill test instance access; record version, modules, soft types.
- Capture real request/response pairs for: list changed CRs/PRs, fetch one,
  create one, patch attributes, lifecycle action, attachment download.
- Determine whether `$filter` on modification time works per entity set.
- Determine lifecycle drive mechanism (REST vs Info*Engine vs workflow task).
- Same for Jira: deployment type, workflows, required create fields, custom
  fields, webhook feasibility.

**Exit criteria:** the verification checklist in `04` Part C is fully ticked, and
recorded fixtures exist for every operation the connector will need.
*If Windchill create/lifecycle turns out to require Info\*Engine or a custom
resource, that changes the delivery model (customer must install something) —
which is exactly why this is M0.*

## M1 — One-way spine: Windchill PR → Jira Bug (3–4 weeks)

- Canonical model, config loader + schema validation
- Windchill source connector (poll + fetch), Jira target connector (create/update)
- Link table, watermarks, hash dedupe, idempotent create with correlation fields
- Field + enum + party mapping; managed description block
- Audit events, basic metrics, quarantine with 5 reason codes
- CLI/dry-run

**Demo:** create a PR in Windchill, see the Bug appear with correct data; run it
twice, still one Bug.

## M2 — Return path + state machine (3 weeks)

- Jira source connector (JQL polling + changelog)
- Canonical state sets, transition path solver, write-back to Windchill
- Echo suppression D1–D4, loop breaker
- Conflict detection and policies, `CONFLICT_MANUAL` quarantine
- Windchill checkout/RELEASED pre-flight checks

**Demo:** full round trip with no loop; deliberate conflict lands in quarantine.

## M3 — Operability (2–3 weeks)

- Quarantine console, link explorer, flow overview UI
- Replay, bulk replay, replay-with-edit
- Safe mode, pause/resume, circuit breakers
- Reconciliation sweep + report
- Backfill with dry run, cap, checkpointing
- Alert rules, dashboards, tracing end-to-end

**Demo:** break something on purpose in front of the customer and fix it from the
console in under two minutes. This demo sells the product.

## M4 — Content & structure (2–3 weeks)

- Attachments (both directions, hash index, size/type policy)
- Comment mirroring (opt-in)
- Relations as remote links; CN → Epic hierarchy (opt-in)
- Rich text intermediate + ADF renderer

## M5 — Compliance package (2–3 weeks, overlaps M3/M4)

- Hash-chained audit trail + `/audit/verify` + WORM checkpointing
- Audit and traceability exports (CSV/JSON/PDF)
- Roles, separation of duties, insert-only DB grants
- Validation package: URS/FS/DS/IQ/OQ scripts, risk assessment, trace matrix
- SBOM, dependency scanning, pen test

**Exit criteria:** a QA/RA lead can execute the OQ scripts and produce signed
evidence without engineering help.

## M6 — Second use case: Jira CR → Windchill CR (2 weeks)

- Windchill target connector (create in container, attribute patch)
- Reverse routing/container mapping
- Proves the connector abstraction is real rather than aspirational

## M7 — GA hardening (2–3 weeks)

- Helm chart + Compose bundle, upgrade/rollback procedure
- Load test at 3× baseline; burst test (S12)
- DR drill (S11) with documented RTO/RPO
- Runbooks per alert
- Customer onboarding guide + permission matrix generator

## Post-GA candidates

| Item | Value | Cost |
|---|---|---|
| Jira issue panel (Forge app) | High perceived value | Medium |
| Windchill portlet | High | Medium (customization) |
| Requirements traceability (UC-5) | High in MedTech | High |
| Per-user impersonation (ADR-0005) | Medium | High (licences, consent) |
| Additional endpoints (Azure DevOps, Polarion, Teamcenter) | Market expansion | High each |
| Flow analytics (cycle time across systems) | Differentiator vs scripts | Medium |

## Sequencing rationale

1. Discovery first because Windchill's actual API surface is the single largest
   schedule risk in this product.
2. One direction fully working beats two directions half-working: it is
   demonstrable, deployable, and generates real feedback on mapping.
3. Operability before breadth. A two-flow product with a great quarantine console
   is worth more than a ten-flow product that fails silently.
4. Compliance package before GA, not after — in MedTech it is a gating
   requirement, and retrofitting an audit trail is expensive.
