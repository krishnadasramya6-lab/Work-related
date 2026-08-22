# CLAUDE.md — Jira ⇄ Windchill PLM Integration ("Bridge")

> This file is the **root context** for any agent or engineer working on this
> product. Read it first, then load only the doc(s) relevant to your task from
> the "Context routing" table below. Do not load the whole `docs/` tree.

## 1. What we are building

A bidirectional, near-real-time synchronization and traceability platform between
**Atlassian Jira** (issue tracking / software + project execution) and
**PTC Windchill PLM** (product data, change management, documents, BOM).

Comparable commercial products: OpsHub Integration Manager (OIM), Tasktop Hub /
Planview Hub, ConnectALL, Kovair Omnibus. We are building a focused, opinionated
equivalent for **regulated MedTech / hardware-software product development**.

The core promise: *an engineer works only in Jira, a design-quality or
manufacturing stakeholder works only in Windchill, and both see the same truth
with a defensible audit trail.*

## 2. Why it exists (problem statement)

In regulated hardware+software companies:

- Software defects, tasks and sprints live in **Jira**.
- Product structure, CAD, specifications, Change Requests (CR), Change Notices
  (CN), Problem Reports (PR), CAPA-linked records and controlled documents live
  in **Windchill**.
- Design controls (ISO 13485 §7.3, 21 CFR 820.30) require traceability from a
  requirement → design output → verification → change → release.
- Today that link is manual: someone copies a Windchill Problem Report number
  into a Jira ticket description, and the two drift. Audits then fail on
  "objective evidence of traceability".

The Bridge removes the manual copy, keeps both systems authoritative for what
they are good at, and produces an immutable, exportable audit trail.

## 3. Non-goals (say no to these)

- **Not** a replacement for Jira or Windchill. We never become the system of record.
- **Not** a CAD data translator. We sync *metadata and links*, not geometry.
- **Not** a BOM authoring tool. BOM structure is read-only from Windchill.
- **Not** a general-purpose iPaaS. Two systems, done extremely well, beats twenty
  done shallowly.
- **No** direct database writes into Windchill or Jira. Public/supported APIs only.
- **No** silent data loss: if we cannot map it, we quarantine and alert.

## 4. Architectural stance (the five rules)

1. **Every synced pair has a stable link record.** Nothing is matched by title,
   summary text, or fuzzy heuristics at steady state.
2. **Sync is idempotent and replayable.** Re-running a sync from any watermark
   must converge to the same state. This makes disaster recovery and audits sane.
3. **Loops are structurally impossible, not heuristically avoided.** See
   `docs/06-sync-engine.md` §Echo suppression.
4. **Field ownership is explicit per-field, per-direction.** There is no
   "bidirectional" field without a declared conflict policy.
5. **Everything is an event in an append-only log.** The audit trail is a
   by-product of normal operation, not a separate feature.

## 5. Context routing — load what you need

| If your task is about… | Read |
|---|---|
| Vocabulary, "what is a CN vs CR" | `docs/01-glossary.md` |
| Product scope, personas, success metrics | `docs/00-product-brief.md` |
| Entities, their identity and lifecycle | `docs/02-domain-model.md` |
| Services, deployment, runtime topology | `docs/03-system-architecture.md` |
| Calling Jira or Windchill APIs | `docs/04-integration-contracts.md` |
| Field/state/user/attachment mapping rules | `docs/05-mapping-spec.md` |
| Change detection, conflicts, ordering, retries | `docs/06-sync-engine.md` |
| Failures, quarantine, alerting, metrics | `docs/07-reliability-observability.md` |
| Auth, secrets, Part 11, audit trail, validation | `docs/08-security-compliance.md` |
| Tables, indexes, retention | `docs/09-data-model.md` |
| Our own REST/admin API and config format | `docs/10-api-surface.md` |
| Writing or reviewing tests | `docs/11-testing-strategy.md` |
| Sequencing work, what to build first | `docs/12-roadmap.md` |
| Why a decision was made | `docs/adr/` |
| Concrete config/payload shapes | `docs/examples/` |
| Handing a scoped task to another agent | `context-packs/` |

## 6. Working agreements for agents

- **State assumptions in the artifact, not just in chat.** If you assume
  Windchill 13.0.2 with the OData/REST domain enabled, write it down.
- **Never invent an API shape.** If you are unsure whether an endpoint exists,
  mark it `// VERIFY:` and list what must be confirmed against a real tenant.
  `docs/04-integration-contracts.md` tracks verification status per endpoint.
- **Mapping changes are breaking changes.** Any edit to `05-mapping-spec.md`
  requires a migration note and a version bump of the mapping schema.
- **Compliance-relevant code paths are tagged** `// GxP` in source. Changing one
  requires updating `docs/08-security-compliance.md` and the traceability matrix.
- Prefer adding an ADR over relitigating a settled decision in code review.

## 7. Current status

Pre-implementation. This repository currently holds the **context and
specification layer only**. No connector code has been written yet. The intended
first executable milestone is M1 in `docs/12-roadmap.md`.
