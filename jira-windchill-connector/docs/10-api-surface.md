# 10 — Bridge API & Admin Surface

Everything the UI can do, the API can do. The API is the contract; the UI is a
client. This matters because customers script bulk operations and because audit
evidence must be exportable without clicking.

## 1. REST endpoints (`/api/v1`)

### Configuration
```
GET    /config/versions                       list config versions
POST   /config/import                         body: YAML → validate + store (does NOT activate)
POST   /config/{version}/validate             semantic validation against live endpoints
POST   /config/{version}/dry-run              body: {flowId, sampleSize|since} → diff report
POST   /config/{version}/activate             requires a passing dry run; audited
GET    /config/{version}/diff/{otherVersion}
```

### Flows
```
GET    /flows                                 with state, lag, backlog, quarantine counts
GET    /flows/{id}
POST   /flows/{id}/pause          {reason}
POST   /flows/{id}/resume
POST   /flows/{id}/backfill       {filter, cap, dryRun:boolean}
GET    /flows/{id}/backfill/{jobId}
POST   /flows/{id}/reconcile      {scope, dryRun}
```

### Links
```
GET    /links?flowId=&displayId=&status=
GET    /links/{id}
GET    /links/{id}/history                    audit events for this pair
POST   /links/{id}/resync         {direction}
POST   /links/{id}/unlink         {reason}    never deletes records
POST   /links                     {flowId, aExternalId, bExternalId, reason}  manual link
```

### Quarantine
```
GET    /quarantine?flowId=&reason=&status=&olderThan=
GET    /quarantine/{id}
POST   /quarantine/{id}/replay    {overrides?: {field: value}}
POST   /quarantine/{id}/ignore    {reason}    audited
POST   /quarantine/bulk-replay    {reason, flowId, limit}
```

### Operations
```
GET    /health                                liveness
GET    /ready                                 endpoint reachability + DB + queue
GET    /metrics                               Prometheus
POST   /ops/safe-mode             {enabled, reason}   global write kill switch
GET    /ops/endpoints/{id}/probe              auth + permission self-test
```

### Audit / evidence
```
GET    /audit/events?linkId=&from=&to=&action=
GET    /audit/export?flowId=&from=&to=&format=csv|json|pdf
GET    /audit/verify?partitionKey=&from=&to=  re-computes the hash chain, returns integrity result
GET    /reports/traceability?flowId=&from=&to=   record-by-record trace matrix
GET    /reports/reconciliation/{runId}
```

### Discovery (used by the config authoring UI)
```
GET    /discover/{endpointId}/kinds
GET    /discover/{endpointId}/fields?kind=&context=
GET    /discover/{endpointId}/states?kind=&context=
GET    /discover/{endpointId}/transitions?project=&issueType=
GET    /discover/{endpointId}/users?query=
```

## 2. Admin UI screens (minimum viable set)

1. **Overview** — flows with lag, backlog, quarantine, endpoint health; safe-mode toggle.
2. **Flow detail** — throughput chart, recent records, per-direction latency.
3. **Mapping editor** — YAML with schema-aware autocomplete from `/discover`,
   inline validation, "dry run" button producing a side-by-side diff.
4. **Quarantine console** — filter by reason, inspect payload + attempted
   mutation + target response, replay/ignore, bulk actions.
5. **Link explorer** — search by Jira key or Windchill number, see the pair, its
   field-by-field sync state, and full history.
6. **Audit export** — date range, flow, format; shows chain verification result.
7. **Settings** — endpoints, secrets (write-only), users/roles, alias table.

## 3. Config file shape (authoritative example in `examples/`)

```yaml
schemaVersion: 1
endpoints:
  windchill-prod: { systemType: windchill, baseUrl: https://plm.acme.local/Windchill, authRef: secret://wc-prod }
  jira-cloud:     { systemType: jira,      baseUrl: https://acme.atlassian.net,      authRef: secret://jira-prod }

flows:
  - id: pr-to-bug
    source: windchill-prod
    target: jira-cloud
    schedule: { pollIntervalSec: 60, reconcile: "0 2 * * *" }
    filter: { ... }
    mapping:
      fields: [ ... ]
      states: { ... }
      people: { ... }
      attachments: { ... }
```

## 4. API conventions

- Auth: bearer token (OIDC from the customer IdP) or API key for automation.
- Every mutating call requires `X-Reason` header when it affects synced data;
  the reason is recorded in the audit trail.
- All mutating calls accept `Idempotency-Key`.
- Errors: RFC 7807 `application/problem+json` with a stable `type` URI matching
  the quarantine reason codes where applicable.
- Pagination: cursor-based (`?cursor=&limit=`), never offset.
- Everything is timestamped in UTC ISO-8601.

## 5. Optional in-system surfaces (v2)

- **Jira issue panel** (Forge/Connect app): shows the linked Windchill record's
  number, revision, lifecycle state, and a link — read-only.
- **Windchill info page portlet**: shows linked Jira issues with status.

These are high-perceived-value, low-risk additions once the core is stable, and
they eliminate the "where do I see the other side?" complaint entirely.
