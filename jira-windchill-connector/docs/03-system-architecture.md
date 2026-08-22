# 03 — System Architecture

## 1. Runtime topology

```
                    corporate network
 ┌──────────────────────────────────────────────────────────┐
 │                                                          │
 │   ┌───────────┐        ┌──────────────────────────┐      │
 │   │ Windchill │◄──────►│      Bridge cluster      │      │
 │   │  (on-prem)│  LAN   │                          │      │
 │   └───────────┘        │  ingress-api             │      │
 │                        │  scheduler               │      │
 │                        │  worker × N              │──────┼──► Jira Cloud
 │                        │  admin-ui                │ HTTPS│    (egress only)
 │                        └───────┬──────────────────┘      │
 │                                │                         │
 │                   ┌────────────┴───────────┐             │
 │                   │ Postgres  │  Redis/NATS│             │
 │                   │ (state)   │  (queues)  │             │
 │                   │ Object store (attachments, staged)   │
 │                   └────────────────────────┘             │
 └──────────────────────────────────────────────────────────┘
```

Jira Cloud cannot reach into the customer network, so **Jira change signal is
obtained by outbound polling of the Jira `/search` + changelog API by default**,
with webhooks as an optional accelerator when a reverse proxy / Atlassian
connect app is permitted. Windchill, being local, can push (queue/webhook or
scheduled poll). See ADR-0003.

## 2. Services

| Service | Responsibility | Scaling |
|---|---|---|
| `ingress-api` | Receives webhooks, validates signature, writes raw event, ACKs fast | Stateless, HPA on RPS |
| `scheduler` | Owns per-flow watermarks; enqueues poll jobs; leader-elected | Single active leader |
| `worker` | Executes the sync pipeline for one work item at a time | Stateless, partitioned by link id |
| `admin-api` + `admin-ui` | Config CRUD, dry runs, quarantine console, audit export | Stateless |
| `connector-jira`, `connector-windchill` | In-process libraries implementing the port interface | — |

## 3. The sync pipeline (single path for every change)

```
 (1) DETECT      poll or webhook produces a RawEvent {endpoint, externalId, hintedAt}
        │
 (2) NORMALIZE   connector.fetch(externalId) → CanonicalEntity  (always re-fetch;
        │                                        never trust webhook payload as truth)
 (3) DEDUPE      payloadHash == last synced hash? → drop (INV-3)
        │
 (4) ECHO CHECK  did *we* cause this? (actor, echo token, pending-write table) → drop
        │
 (5) RESOLVE     find link; or decide "create in target"; or "ignore per filter"
        │
 (6) MAP         apply field/state/party/attachment transforms → TargetMutation
        │
 (7) CONFLICT    compare target versionToken + per-field ownership → resolve or quarantine
        │
 (8) WRITE       connector.apply(mutation) inside an outbox/idempotency-key guard
        │
 (9) RECORD      update link, watermark, payload hashes, append audit events
```

Every stage is a pure function of its input except (2) and (8). Stages 3–7 are
therefore unit-testable with fixtures and no network — this is the main reason
for the canonical model.

## 4. Port interfaces (what a connector must implement)

```ts
interface SourcePort {
  listChangedSince(cursor: Cursor, filter: EntityFilter): Promise<Page<ChangeRef>>;
  fetch(externalId: string): Promise<CanonicalEntity>;
  fetchAttachment(ref: AttachmentRef): Promise<ReadableStream>;
  describeSchema(kind: EntityKind, context: ContextRef): Promise<SchemaDescriptor>;
}

interface TargetPort {
  create(m: CreateMutation, idempotencyKey: string): Promise<CanonicalEntity>;
  update(m: UpdateMutation, expected: string): Promise<CanonicalEntity>; // expected = versionToken
  transition(externalId: string, toState: string, payload?: TransitionPayload): Promise<void>;
  addComment(externalId: string, c: CommentPayload): Promise<string>;
  addAttachment(externalId: string, a: AttachmentPayload): Promise<string>;
  addRemoteLink(externalId: string, l: RemoteLink): Promise<void>;
  capabilities(): TargetCapabilities;  // declares what this system can actually do
}
```

`capabilities()` matters: Windchill cannot freely set a lifecycle state (it is
workflow-driven), and Jira cannot set a status without a legal transition. The
mapper asks capabilities rather than assuming symmetry.

## 5. Concurrency model

- Work is partitioned by **link id** (or by `externalId` before a link exists).
  A single partition is processed serially → no intra-record races.
- Partition assignment is a consistent hash over the queue's workers.
- A per-partition **advisory lock in Postgres** is taken for the write phase, so
  two workers cannot write the same pair even during a rebalance.
- Ordering guarantee: **per-record ordering, not global ordering.** Cross-record
  ordering is reconstructed by re-fetch (stage 2), which is why we never trust
  webhook bodies.

## 6. Delivery semantics

At-least-once delivery + idempotent writes = **effectively-once** externally
visible behaviour.

- Every create carries an `idempotencyKey = sha256(flowId|sourceExternalId|"create")`.
- Jira: store the key in the correlation custom field; before creating, search by
  that field. Windchill: check the correlation attribute.
- Every update is a conditional write on `versionToken`.

## 7. Technology choices (defaults, see ADR-0001)

| Concern | Choice | Reason |
|---|---|---|
| Language | TypeScript (Node 20+) | Same language as admin UI; strong JSON/schema ecosystem; easy customer readability |
| DB | PostgreSQL 15+ | Transactional outbox, JSONB for payloads, advisory locks |
| Queue | NATS JetStream (or Redis Streams for small deployments) | Durable, replayable, small ops footprint |
| Config | YAML validated by JSON Schema, stored in Git, imported to DB | Config-as-code; diffable for audits |
| Object store | S3-compatible (MinIO on-prem) | Attachment staging |
| Observability | OpenTelemetry → Prometheus + OTLP traces | Per-record trace is the debugging story |
| Deployment | Docker Compose (small) / Helm chart (standard) | Customers are on-prem |

## 8. Failure domains and what happens

| Failure | Behaviour |
|---|---|
| Jira unreachable | Poll jobs fail fast, backoff; Windchill→Jira work items retry; nothing is lost (queue durable) |
| Windchill down for maintenance | Same, opposite direction; watermark unchanged so nothing is skipped |
| Bridge DB down | Workers stop; queues buffer; no writes issued (writes require DB txn) |
| Bad mapping deployed | Dry-run gate should catch it; if not, quarantine grows and alerting fires; config rollback is a Git revert + re-import |
| Poison event | After N attempts → quarantine with full context; pipeline continues |
| Clock skew | All comparisons use source-system tokens/ETags, never Bridge wall clock |
