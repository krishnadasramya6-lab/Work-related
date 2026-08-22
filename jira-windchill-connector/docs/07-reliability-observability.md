# 07 — Reliability & Observability

## 1. Quarantine (the most important operational feature)

Anything that cannot be synced goes to quarantine — never to a log line that
nobody reads, and never silently dropped.

A quarantine item contains:

```
id, flowId, linkId?, side, sourceExternalId, sourceDisplayId,
reason (enum), message, occurredAt, attempts,
sourceSnapshot (canonical JSON), attemptedMutation (JSON),
targetResponse (raw), configVersion, traceId,
suggestedActions[], assignedTo?, status: open|acknowledged|resolved|ignored
```

Reason codes (stable, documented, alertable):

| Code | Typical cause | Suggested action |
|---|---|---|
| `MAPPING_ERROR` | Transform threw, missing required source field | Fix mapping, replay |
| `UNMAPPED_VALUE` | Enum value not in value map | Add value, replay |
| `NO_TRANSITION_PATH` | Jira workflow cannot reach target status | Fix workflow or state map |
| `TARGET_REJECTED` | 400 from target (required field, screen config) | Fix config, replay |
| `CONFLICT_MANUAL` | Both sides changed a `manual` field | Choose a side in console |
| `WRITE_CONTENTION` | 3 failed conditional writes | Replay |
| `PARENT_NOT_SYNCED` | Child arrived before parent | Sync parent, replay |
| `TARGET_CHECKED_OUT` | Windchill object checked out too long | Ask owner to check in |
| `TARGET_IMMUTABLE` | Windchill object RELEASED | Expected; usually `ignore` |
| `USER_UNRESOLVED` | No Jira account for a Windchill user | Add alias |
| `LOOP_SUSPECTED` | Loop breaker tripped | Investigate mapping symmetry |
| `AUTH_FAILURE` | Credentials expired | Rotate secret |
| `SCHEMA_DRIFT` | Field/status renamed or deleted in a system | Re-resolve schema, update mapping |

Console actions: **replay**, **replay with edit** (fix a value once), **ignore
with reason** (audited), **bulk replay by reason**.

## 2. Health model

| Signal | Meaning |
|---|---|
| Flow state | `active` \| `paused` \| `degraded` \| `failed` |
| Lag | `now − watermark` per flow per side |
| Backlog | queued work items per flow |
| Quarantine open count and age | the real quality metric |
| Endpoint circuit state | closed / half-open / open |

A flow is `degraded` when lag > 3× target, or quarantine open count grew by more
than X in an hour, or the circuit breaker opened.

## 3. Metrics (Prometheus names)

```
bridge_events_ingested_total{flow,side,source}
bridge_records_processed_total{flow,side,outcome}     # synced|dropped_echo|dropped_nochange|quarantined|deferred
bridge_propagation_seconds{flow,direction}            # histogram, source modifiedAt → target write ack
bridge_watermark_lag_seconds{flow,side}
bridge_queue_depth{flow}
bridge_quarantine_open{flow,reason}
bridge_api_requests_total{endpoint,operation,status}
bridge_api_duration_seconds{endpoint,operation}
bridge_rate_limited_total{endpoint}
bridge_conflicts_total{flow,field,policy,resolution}
bridge_loop_breaker_trips_total{flow}
bridge_users_unresolved_total{flow}
bridge_reconcile_drift_total{flow,kind}
```

## 4. Tracing

One trace per work item, spanning detect → normalize → map → write, with
attributes `flow.id`, `link.id`, `source.displayId`, `target.displayId`,
`config.version`. The support workflow is literally: *paste the Jira key, get the
trace, see the exact stage that failed and the payload it failed on.*

Correlate an inbound Windchill/Jira record to its trace via a `traceId` stored on
the work item and shown in the console and quarantine entry.

## 5. Logging rules

- Structured JSON only.
- Every log line carries `traceId`, `flowId`, `linkId?`.
- **No secrets, no full payloads at INFO.** Full canonical payloads are stored in
  the event store/quarantine, not sprayed into logs.
- PII: user display names and emails appear in payload storage (needed for the
  audit trail) but are redacted in logs by default, controlled by
  `logging.redactPii` (default true).

## 6. Alerting (default rules)

| Alert | Condition | Severity |
|---|---|---|
| `BridgeFlowStalled` | lag > 15 min for 10 min | page |
| `BridgeAuthFailure` | any `AUTH_FAILURE` | page |
| `BridgeLoopSuspected` | any loop breaker trip | page |
| `BridgeQuarantineGrowth` | +25 open items in 1 h | ticket |
| `BridgeQuarantineAging` | any item open > 3 business days | ticket |
| `BridgeEndpointCircuitOpen` | circuit open > 5 min | ticket |
| `BridgeReconcileDrift` | drift rate > 1 % of links | ticket |

## 7. Backup, recovery and replay

- Postgres PITR; the event store is the source of truth for replay.
- **Recovery drill (must be part of acceptance):** restore the DB to T−24 h, then
  replay events; the resulting link table and target systems must converge with
  zero duplicate creations. This exercise validates INV-3, INV-5 and idempotency
  in one go.
- If the Bridge DB is lost entirely, links are rebuilt from the tier-2
  correlation fields stored in both systems (`04`/`02 §3`) — which is why those
  fields are mandatory, not optional.

## 8. Capacity assumptions (sizing baseline)

| Parameter | Baseline |
|---|---|
| Linked record pairs | 50 000 |
| Change events/day | 20 000 |
| Peak burst | 500 events/min (bulk CN release) |
| Attachment volume | 2 GB/month |
| Steady-state workers | 4 |
| Postgres | 4 vCPU / 16 GB / 200 GB |

Bulk bursts are the interesting case: a Change Notice release can touch hundreds
of objects at once. The Windchill concurrency cap (4) is the binding constraint,
so bursts drain over minutes — this is why the p99 latency target is 5 minutes,
not 60 seconds.
