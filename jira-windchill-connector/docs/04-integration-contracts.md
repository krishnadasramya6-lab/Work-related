# 04 — Integration Contracts

> **Verification discipline.** Every endpoint below carries a status:
> `CONFIRMED` (verified against a live tenant), `LIKELY` (documented by vendor,
> not yet exercised by us), `ASSUMED` (needs verification before implementation).
> Do not write connector code against an `ASSUMED` row without first adding a
> verification task. Windchill in particular varies by version, installed
> modules, and customization.

## Part A — Jira

Assumed baseline: **Jira Cloud, REST API v3** (Data Center: v2, ADF replaced by
wiki markup — see §A.7).

### A.1 Authentication

| Mode | Use | Status |
|---|---|---|
| API token + email (Basic) | Cloud, service account | LIKELY |
| OAuth 2.0 (3LO) | Cloud, per-user actions/impersonation | LIKELY |
| PAT (`Bearer`) | Data Center | LIKELY |

Decision: v1 uses a **single service account** ("Windchill Bridge") for all
writes, with the real actor recorded in the comment/description body and in our
audit trail. Per-user impersonation is v2 (ADR-0005) because it multiplies
licence and consent requirements.

### A.2 Endpoints used

| Purpose | Method + path | Status |
|---|---|---|
| Change detection | `GET /rest/api/3/search` with JQL `project = X AND updated >= "..."` , `fields=*all`, `expand=changelog` | LIKELY |
| Fetch one issue | `GET /rest/api/3/issue/{idOrKey}?expand=changelog,renderedFields` | LIKELY |
| Create issue | `POST /rest/api/3/issue` | LIKELY |
| Update fields | `PUT /rest/api/3/issue/{id}` | LIKELY |
| Legal transitions | `GET /rest/api/3/issue/{id}/transitions` | LIKELY |
| Execute transition | `POST /rest/api/3/issue/{id}/transitions` | LIKELY |
| Comment | `POST /rest/api/3/issue/{id}/comment` | LIKELY |
| Attachment | `POST /rest/api/3/issue/{id}/attachments` (`X-Atlassian-Token: no-check`) | LIKELY |
| Remote link | `POST /rest/api/3/issue/{id}/remotelink` | LIKELY |
| Field catalogue | `GET /rest/api/3/field` | LIKELY |
| Create metadata | `GET /rest/api/3/issue/createmeta` (Cloud: `/createmeta/{projectIdOrKey}/issuetypes/{id}`) | LIKELY |
| Users | `GET /rest/api/3/user/search` (Cloud returns `accountId`) | LIKELY |
| Webhooks (dynamic) | `POST /rest/api/3/webhook` (Connect apps) or admin-configured | ASSUMED |

### A.3 Change detection strategy

Default: **JQL polling on `updated`**, per flow, per project.

```
project in (SWQA, SWDEV) AND updated >= "-{{interval}}m" ORDER BY updated ASC
```

Pitfalls encoded in the implementation:

- `updated` has **minute granularity** in JQL. Always overlap the window by
  ≥ 2 minutes and rely on hash dedupe (INV-3) to suppress re-processing.
- Paginate with `startAt`/`nextPageToken`; a page boundary during an active edit
  can reorder results — ordering by `updated ASC` plus overlap handles it.
- The watermark advances to `max(updated) - safetyMargin`, never to `now()`.
- Deletions do not appear in `updated` search. Deletion detection is a separate
  low-frequency reconciliation sweep (see `06-sync-engine.md` §Reconciliation).

Webhooks, where available, are a **latency accelerator only**: they enqueue a
`RawEvent` that triggers a re-fetch. Losing a webhook must never lose data,
because the poll would have caught it anyway.

### A.4 Rate limits

Jira Cloud enforces per-tenant cost-based limits and returns `429` with
`Retry-After`. Implementation requirements:

- Central token-bucket limiter per endpoint, configurable ceiling.
- Honour `Retry-After` exactly; do not apply our own shorter backoff.
- Bulk read via `/search` with explicit `fields=` list, never `*all` in steady
  state (only during schema discovery).

### A.5 Field handling

- Never hard-code `customfield_NNNNN`. At flow activation, resolve field **names**
  to ids via `GET /field` and cache with the config version. A rename in Jira
  triggers a re-resolution warning, not a silent mis-write.
- Required fields for create come from `createmeta`; missing required fields are
  a **config validation error**, surfaced before the flow can be enabled.
- `resolution` can usually only be set through a transition screen, not `PUT`.

### A.6 Transitions

Never write `status` directly. Algorithm:

1. Fetch legal transitions for the current status.
2. If the target status is directly reachable, execute it.
3. If not, use a precomputed shortest path over the workflow graph (fetched once
   per project+issuetype and cached), executing each hop.
4. If unreachable, quarantine with reason `NO_TRANSITION_PATH` — never force.

### A.7 Text format

Cloud v3 uses **ADF (Atlassian Document Format)** JSON for description/comments.
Windchill descriptions are plain text or HTML. We therefore keep an internal
rich-text intermediate and render per target. Round-tripping rich text is lossy;
policy is in `05-mapping-spec.md` §Text.

## Part B — Windchill

Assumed baseline: **Windchill 12.x / 13.x with the REST (OData) services
installed**, domains `ProdMgmt`, `ChangeMgmt`, `DocMgmt`, `PrincipalMgmt`.

### B.1 Authentication

| Mode | Use | Status |
|---|---|---|
| Basic over HTTPS (service account) | Simplest on-prem | LIKELY |
| OAuth 2.0 via PingFederate / customer IdP | Enterprise standard for Windchill | ASSUMED — customer-specific |
| SSO/Kerberos | Common but hostile to service integration | ASSUMED |

Expect **CSRF token (`CSRF_NONCE`) requirements** on modifying REST calls in
recent versions: fetch a nonce, include it on POST/PATCH. Mark `ASSUMED`,
verify per version.

### B.2 Endpoints (OData style)

| Purpose | Shape | Status |
|---|---|---|
| Service root / metadata | `GET /Windchill/servlet/odata/$metadata` | LIKELY |
| List change objects | `GET /Windchill/servlet/odata/ChangeMgmt/ChangeRequests?$filter=...&$expand=...` | LIKELY |
| One object | `GET /Windchill/servlet/odata/ChangeMgmt/ChangeNotices('OR:wt.change2.WTChangeOrder2:12345')` | LIKELY |
| Create | `POST .../ChangeRequests` with container context | ASSUMED |
| Update attributes | `PATCH .../ChangeRequests('OID')` | ASSUMED |
| Documents | `GET /Windchill/servlet/odata/DocMgmt/Documents` | LIKELY |
| Parts | `GET /Windchill/servlet/odata/ProdMgmt/Parts` | LIKELY |
| Principals | `GET /Windchill/servlet/odata/PrincipalMgmt/Users` | LIKELY |
| Content/attachments | `.../PrimaryContent` or `/AttachmentContents` | ASSUMED |
| Lifecycle action | domain action, e.g. `POST .../SetState` | ASSUMED |

Where OData coverage is missing (notably lifecycle transitions, workflow actions
and some create-in-context cases), the fallback is **Info*Engine tasks**
(`/Windchill/servlet/IE/tasks/...`) or a small customer-installed custom REST
resource. The connector therefore has a **strategy layer**: `restFirst`, then
`ieFallback`, declared per operation in endpoint config.

### B.3 Change detection strategy

Preferred, in order:

1. **Delta query on `$filter=LastModified gt <watermark>`** with `$orderby`.
   Verify OData filterability of the modified attribute per domain — several
   Windchill entity sets restrict `$filter`. `ASSUMED`.
2. **Windchill event listener / queue publishing to our ingress** (a small
   customization: a listener on `PostStoreEvent`/`PostModifyEvent` that POSTs
   `{type, oid, timestamp}`). Highest fidelity, requires customer to install.
3. **Saved-search / report scheduled poll** as a last resort.

Whatever the signal, stage 2 of the pipeline always re-fetches.

### B.4 Windchill semantics that bite

- **Revision vs iteration.** Any attribute save creates a new iteration. If we
  react to iterations we will generate storms of updates. We compare at the
  **revision + attribute-hash** level and ignore pure iteration bumps.
- **Checkout state.** An object checked out by a user cannot be modified by us.
  Detect and defer with reason `TARGET_CHECKED_OUT`, retry with backoff, escalate
  after a configured age. Never force check-in.
- **Lifecycle is workflow-driven.** We may not be able to set an arbitrary state;
  we can usually only *complete a workflow task* or *set an attribute the
  workflow reads*. Model this explicitly in `capabilities()`.
- **Released objects are immutable.** Writes to a `RELEASED` object must be
  rejected at mapping time, not attempted.
- **Soft types.** `WTChangeRequest2` may be subtyped as
  `com.acme.SoftwareChangeRequest` with extra attributes. Type predicates must
  match on soft type, with base-type fallback.
- **Containers.** Creating an object requires a container OID. Mapping config
  must state the target container per flow; there is no sane default.
- **IBAs (Instance Based Attributes)** are addressed differently from modelled
  attributes. The schema descriptor must record which is which.

### B.5 Rate limits / load

Windchill has no published rate limit; the risk is the opposite — we can
overload a method server. Requirements:

- Hard concurrency cap per Windchill endpoint (default 4 concurrent requests).
- Configurable "quiet hours" throttle for bulk/reconciliation sweeps.
- Never run a full reconciliation during customer business hours by default.

## Part C — Verification checklist (do this before writing connector code)

- [ ] Windchill version, patch level, and installed REST domains
- [ ] Whether `$filter` on modification timestamp works for each needed entity set
- [ ] CSRF nonce requirement and header name
- [ ] Create-in-context payload shape for CR/PR (capture a real request)
- [ ] Whether lifecycle can be driven via REST or needs IE/workflow
- [ ] Soft types in use per customer, and their attribute lists
- [ ] Jira deployment (Cloud vs DC), API version, webhook feasibility
- [ ] Jira required-fields-on-create per target project + issue type
- [ ] Service account permission set on both sides (least privilege)
- [ ] Attachment size limits on both sides
