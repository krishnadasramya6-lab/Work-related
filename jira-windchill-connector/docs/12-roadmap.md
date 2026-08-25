# 12 — Roadmap

Resequenced for the design control scope. Riskiest unknowns first; every
milestone demonstrable.

## M0 — Discovery & verification (2 weeks)

Goal: convert every `ASSUMED` row in `04-integration-contracts.md` into
`CONFIRMED`. Three APIs to verify now, not two.

- **Windchill:** version, modules, soft types; document create/revise/attach
  payloads; where-used (BOM parent) query shape and performance at real depth;
  whether the four publication soft types exist or can be created; lifecycle
  drive mechanism (REST vs Info\*Engine).
- **Xray:** Cloud vs Server/DC; API keys issued; `getTestRuns` and coverage query
  shapes; whether coverage results can be filtered by Epic Category.
- **Jira:** `Epic Category` field created and made required; option values fixed;
  Epic configured as a coverable issue type in Xray; Test Execution "complete"
  signal available.

**Exit criteria:** Part C checklist fully ticked; recorded fixtures for every
operation the connectors need.
*If Windchill document create/revise needs Info\*Engine or a custom resource,
that changes the delivery model — which is exactly why this is M0.*

## M1 — The trace spine (4 weeks) — UC-1

- Canonical model, config loader, schema validation, Epic discriminator
- Jira source connector (Epics, JQL polling, changelog)
- Windchill source connector (documents, parts, revisions)
- **T1 links** with `assertedAgainstRevision`, staleness computation
- Link table, watermarks, hash dedupe, idempotent writes
- Trace matrix v1 (CSV) — requirement → design output → staleness
- Audit events, quarantine, dry run

**Demo:** link a requirement Epic to a Windchill spec; revise the spec; watch the
link go stale and the requirement lose its verified status.

## M2 — Verification coverage (3 weeks) — UC-2

- Xray connector: tests, executions, and **run results via the Xray API**
- Checkpoint detection at Test Execution completion (ADR-0011)
- T2 consumption from Xray coverage, filtered by Epic Category
- Coverage roll-up per `13` §4, including the `PASSED`-blocked-by-`STALE` coupling
- Coverage projection into Windchill (read-only field / attribute on the object)
- Trace matrix v2 — full chain including verification and results

**Demo:** a full trace matrix showing a requirement whose tests all pass but
whose coverage reads `STALE` because its spec revised.

## M3 — Baseline & publish (4 weeks) — UC-3

The capability Posture A depends on. Do not compress this.

- Immutable snapshot store; pure renderers `(snapshot, templateVersion) → doc`
- SRS, V&V Plan, V&V Report, Trace Matrix templates (PDF + canonical JSON)
- Completeness gate with audited overrides (`14` §5)
- Windchill target connector: document create/revise, attach, set attributes,
  submit to approval lifecycle
- Approval observation → write-back of number + revision
- Drift reporting and drift alerting

**Demo:** publish a baseline; get it approved in Windchill; edit Jira; watch the
drift report grow.

**Exit criteria:** regeneration from a stored snapshot is content-identical.

## M4 — Change impact (3 weeks) — UC-4, UC-5

- Windchill ECR/ECN connector
- `where_used` projection with incremental refresh
- Impact expansion: BOM traversal (depth-limited, cycle-safe, view-aware)
- Impact classification with explainable paths and mandatory `NO_IMPACT`
  justification
- T3: ECR → Change Work Package Epic, with progress roll-up
- Impact Analysis report onto the ECR

**Demo:** raise an ECR on a part; get the re-verification scope in under 30 s.

## M5 — Operability (3 weeks)

- Quarantine console, link explorer, flow overview, baseline console
- Replay, bulk replay, replay-with-edit
- Safe mode, pause/resume, circuit breakers
- Reconciliation sweep + report
- Backfill with dry run, cap, checkpointing
- Alert rules, dashboards, end-to-end tracing

**Demo:** break something deliberately in front of the customer and fix it from
the console in under two minutes. This demo sells the product.

## M6 — Gate readiness & context projection (2 weeks) — UC-6, UC-8

- Gate readiness computation (`13` §5), exposed via API for Windchill workflow
- Part / BOM / spec-revision context projected read-only into Jira issues
- Coverage and test results projected read-only into Windchill

## M7 — Requirement change control (2 weeks) — UC-7

- Material-change detection on baselined requirements
- Draft ECR preparation with before/after diff
- `awaiting_change_control` flagging

## M8 — Compliance package (3 weeks, overlaps M5–M7)

- Hash-chained audit trail, `/audit/verify`, WORM checkpointing
- Audit, trace matrix and DHF exports
- Roles, separation of duties, insert-only DB grants
- Validation package: URS/FS/DS/IQ/OQ, risk assessment, traceability matrix
- SBOM, dependency scanning, penetration test

**Exit criteria:** a QA/RA lead executes the OQ scripts and produces signed
evidence with no engineering help.

## M9 — GA hardening (3 weeks)

- Helm chart + Compose bundle; upgrade/rollback procedure
- Load test at 3× baseline; regression-burst test; deep-BOM impact test
- DR drill with documented RTO/RPO
- Runbooks per alert; onboarding guide; permission matrix generator

## Sequencing rationale

1. **M0 first** because three API surfaces — Windchill's especially — are the
   largest schedule risk, and the answer can change the delivery model.
2. **Trace spine before coverage** (M1 → M2): staleness is the mechanism that
   makes coverage mean anything. Coverage built first would have to be reworked.
3. **Baseline before impact** (M3 → M4): baselines are what Posture A rests on,
   and impact analysis needs the notion of "in an approved baseline" to decide
   when change control is required.
4. **Operability before breadth** (M5): a two-flow product with a great
   quarantine console beats a ten-flow product that fails silently.
5. **Compliance package before GA**, not after — it is gating in MedTech, and
   retrofitting an audit trail is expensive.

Indicative total: ~29 weeks to GA. The critical path runs M0 → M1 → M2 → M3;
M5 onwards can overlap given a second engineer.
