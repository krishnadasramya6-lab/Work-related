# 01 — Glossary

Shared vocabulary. When a term below appears in code, use exactly this spelling.

## Windchill (PTC PLM) terms

| Term | Meaning | Notes for integration |
|---|---|---|
| **WTPart** | A part / assembly node in the product structure | Has number, name, revision, view (Design/Manufacturing), lifecycle state |
| **EPMDocument** | CAD document (model, drawing) | We reference, never transfer content |
| **WTDocument** | Non-CAD controlled document (spec, protocol, SOP) | Common Jira link target |
| **Problem Report (PR)** | Formal record of a discovered problem; `WTProductProblem`/`WTChangeIssue` | Primary source for UC-1 |
| **Change Request (CR)** | Proposal to change, with analysis and CCB decision; `WTChangeRequest2` | Target for UC-3 |
| **Change Notice (CN)** | Approved change implementation container; `WTChangeOrder2` | Parent of Change Tasks, UC-2 |
| **Change Task / Change Activity** | Unit of work under a CN; `WTChangeActivity2` | Maps 1:1 to a Jira issue |
| **Lifecycle state** | e.g. `INWORK`, `UNDERREVIEW`, `APPROVED`, `RELEASED`, `CANCELLED` | Drives status mapping |
| **Revision / Iteration** | Revision = controlled version (A, B, C); Iteration = working save (A.1, A.2) | We sync at **revision** granularity; iterations are noise |
| **Container / Context** | Product, Library, Project, or Organization scoping objects | Determines where a created object lands; must be in mapping config |
| **OID / UFID** | Windchill object identifier (`OR:wt.change2.WTChangeOrder2:12345`) | Our canonical `externalId` on the Windchill side |
| **Info*Engine** | Legacy task/webject-based integration layer | Fallback when REST coverage is missing |
| **Windchill REST (OData)** | Modern `/Windchill/servlet/odata/...` domain-based API | Preferred integration surface |
| **Team / Role** | Role-based participant assignment on an object | Source for assignee resolution |
| **Soft type** | Customer-defined subtype of an out-of-the-box type | Mapping must be soft-type aware, not just base-type aware |

## Jira (Atlassian) terms

| Term | Meaning | Notes |
|---|---|---|
| **Issue** | Unit of work | Identified by `key` (PROJ-123) and immutable `id` |
| **Issue type** | Bug, Story, Task, Epic, custom | Maps from Windchill object type |
| **Project** | Container for issues | Target selection depends on Windchill container/product |
| **Status / Transition** | Workflow position and the legal moves between positions | We must transition, not set status directly |
| **Resolution** | Terminal outcome (Done, Won't Do…) | Often required by a transition screen |
| **Custom field** | `customfield_10023` | Never hard-code IDs; resolve by name at bootstrap |
| **Webhook** | Outbound HTTP callback on issue events | Primary change signal for Jira |
| **Changelog / History** | Per-issue field change history | Used for delta detection and echo suppression |
| **App/Connect/Forge** | Jira Cloud extension models | Only relevant if we ship a Jira-side panel |

## Bridge (our) terms

| Term | Meaning |
|---|---|
| **Endpoint** | A configured instance of a system (e.g. `jira-prod`, `windchill-qa`) |
| **Connector** | Code implementing the port interface for one system type |
| **Entity** | A normalized record fetched from an endpoint (see `02-domain-model.md`) |
| **Link** | Persistent 1:1 association between an entity on side A and side B |
| **Mapping** | Declarative rules turning entity A into entity B |
| **Flow** | A configured, runnable mapping between two endpoints with a direction and filter |
| **Watermark** | Per-flow, per-side cursor marking "we have processed everything up to here" |
| **Echo** | A change event caused by our own write, which must not be re-propagated |
| **Quarantine** | Durable holding area for records that failed to sync and need human action |
| **Replay** | Re-processing events from the log from a chosen point |
| **Dry run** | Full pipeline execution with all writes suppressed and diffed |
| **Provenance** | Record of which actor/system caused each field value |

## Regulatory terms

| Term | Meaning | Why we care |
|---|---|---|
| **ISO 13485 §7.3** | Design and development controls | Requires traceability of design changes |
| **21 CFR 820.30** | US FDA design control regulation | Design history file evidence |
| **21 CFR Part 11** | Electronic records / electronic signatures | Audit trail, record integrity, access control |
| **CSV / CSA** | Computer System Validation / Computer Software Assurance | We must be validatable: IQ/OQ/PQ artifacts |
| **DHF** | Design History File | Our exports feed it |
| **CAPA** | Corrective and Preventive Action | Often the parent of a PR/CR chain |
| **ALCOA+** | Attributable, Legible, Contemporaneous, Original, Accurate (+) | Audit trail design criteria |
