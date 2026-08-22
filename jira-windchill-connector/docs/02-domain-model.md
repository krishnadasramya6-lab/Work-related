# 02 — Domain Model

The Bridge never passes vendor payloads around internally. Every connector
normalizes into the **canonical entity model** below; mapping operates only on
canonical entities. This keeps mapping logic testable without a live tenant.

## 1. Canonical entity

```ts
type CanonicalEntity = {
  /** Stable identity assigned by the source system. Never a title or number
      that a human can edit. Windchill: OID. Jira: numeric issue id. */
  externalId: string;

  /** Human-facing identifier. Jira: "PROJ-123". Windchill: "CN000145". */
  displayId: string;

  endpointId: string;            // "windchill-prod"
  systemType: 'jira' | 'windchill';

  /** Canonical kind, after soft-type resolution. */
  kind: EntityKind;

  /** Vendor-native type string, retained for mapping predicates and audit. */
  nativeType: string;            // "wt.change2.WTChangeActivity2" | "Bug"

  /** Version identity. Windchill: revision (+iteration, informational only).
      Jira: has no revisioning; version = null. */
  revision?: string | null;
  iteration?: string | null;

  /** Optimistic concurrency token used to detect lost updates. */
  versionToken: string;          // Jira: updated timestamp; Windchill: ETag/modifyStamp

  /** Container/scoping context on the source side. */
  context: {
    containerId?: string;        // Windchill container OID / Jira project id
    containerKey?: string;       // "PROJ" / "PRODUCT-ALPHA"
    containerType?: string;      // "Product" | "Library" | "Project" | "JiraProject"
  };

  fields: Record<string, FieldValue>;
  people: { reporter?: Party; assignee?: Party; approvers?: Party[]; watchers?: Party[] };
  lifecycle: { state: string; isTerminal: boolean; stateSetId: string };
  timestamps: { createdAt: string; modifiedAt: string };
  relations: Relation[];
  attachments: AttachmentRef[];
  comments?: CommentRef[];

  /** Actor that produced the latest change, used for echo suppression. */
  lastModifiedBy: Party;

  /** Raw payload hash — cheap change detection without storing PII. */
  payloadHash: string;
};

type EntityKind =
  | 'problem_report' | 'change_request' | 'change_notice' | 'change_task'
  | 'part' | 'document' | 'requirement'
  | 'issue' | 'epic' | 'subtask';

type FieldValue =
  | { t: 'string'; v: string }
  | { t: 'text'; v: string; format: 'plain' | 'adf' | 'html' }
  | { t: 'number'; v: number }
  | { t: 'bool'; v: boolean }
  | { t: 'date'; v: string }        // ISO-8601, always UTC internally
  | { t: 'enum'; v: string; label?: string }
  | { t: 'multi'; v: string[] }
  | { t: 'party'; v: Party }
  | { t: 'ref'; v: EntityRef };

type Party = {
  canonicalId?: string;   // resolved Bridge identity
  email?: string;
  username?: string;
  displayName: string;
  resolved: boolean;      // false => fell back to a service identity
};
```

## 2. Entity kind matrix

| Canonical kind | Native | System | Sync role (v1) |
|---|---|---|---|
| `requirement` | Issue type `Epic`, `Epic Category = Requirement` | Jira | Source of trace; coverage written back |
| `change_work_package` | Issue type `Epic`, `Epic Category = Change` | Jira | Created from ECR (T3); progress rolls up |
| `test` | Issue type `Test` | Xray/Jira | Verification definition (T2) |
| `test_set` / `test_plan` | Issue types | Xray/Jira | Grouping; scope for executions |
| `test_execution` | Issue type `Test Execution` | Xray/Jira | **The sync checkpoint** (ADR-0011) |
| `test_run` | Xray-internal, **not a Jira issue** | Xray API only | Read for roll-up; never synced individually |
| `defect` | Issue type `Bug` | Jira | Linked from failed runs |
| `document` | `WTDocument` (+ soft types) | Windchill | T1 target; baseline publication target |
| `part` | `WTPart` | Windchill | T1 target; BOM node for impact |
| `cad_document` | `EPMDocument` | Windchill | T1 target, reference only |
| `change_request` | `WTChangeRequest2` (ECR) | Windchill | Drives T3; receives impact analysis |
| `change_notice` | `WTChangeOrder2` (ECN) | Windchill | Release gate consumer |
| `baseline` | Bridge-internal | Bridge | Snapshot; publishes to `document` |

Anything not in this matrix is **rejected at config validation time**, not at
runtime.

### The Epic discriminator

`Epic` carries two incompatible meanings (ADR-0010). Every mapping predicate,
filter and Xray coverage configuration keys on a **required discriminator
field**, `Epic Category`, resolved by name at flow activation:

```yaml
discriminator:
  field: "Epic Category"        # resolved to customfield_NNNNN at activation
  requirement: "Requirement"
  changeWorkPackage: "Change"
  onMissing: quarantine          # never guess
```

`onMissing: quarantine` is not negotiable. An Epic with no category is
ambiguous, and guessing would corrupt both the trace matrix and Xray coverage
metrics.

### Xray API boundary — read this twice

| Entity | Reachable via Jira API | Reachable via Xray API |
|---|---|---|
| Test, Test Set, Test Plan, Test Execution | Yes (they are issues) | Yes |
| **Test Run** (status, evidence, executed-by, dates) | **No** | Yes only |
| **Test Step results** | **No** | Yes only |
| Requirement coverage status | No | Yes only |

Test *results* — the actual V&V evidence — exist only behind the Xray API. A
connector built on the Jira API alone would sync test *definitions* and no
*evidence*, which is worse than useless in a design control context.

## 3. Identity and matching

Identity resolution has exactly three tiers, tried in order:

1. **Link table** (`links` in `09-data-model.md`) — steady state, O(1), authoritative.
2. **Correlation key written into the target** — a dedicated custom field on the
   Jira issue (`Windchill OID`) and an attribute or link on the Windchill object
   (`JIRA_KEY`). Recovers links after a Bridge database restore.
3. **Bootstrap reconciliation** — an explicit, admin-triggered, dry-run-first
   matching pass over `displayId` (never free text). Produces a proposed link set
   for human approval.

> **Rule:** the runtime sync path uses tiers 1 and 2 only. Fuzzy matching never
> executes automatically. This is the single most important safeguard against
> duplicate record creation.

## 4. Relations and trace links

Two distinct concepts — do not conflate them:

- **Relations** are native to a system (Jira issue links, Windchill CN→Task).
  We read them; we mirror their *existence* as remote links only.
- **Trace links (T1–T5)** are the cross-boundary assertions the Bridge owns and
  maintains. They are revision-aware and are the substance of the product.
  Fully specified in `13-traceability-model.md`.

```ts
type Relation = {
  type: 'parent' | 'child' | 'decomposes_to' | 'derived_from'
      | 'affects' | 'resolves' | 'references' | 'blocks' | 'covers' | 'tested_by';
  targetExternalId: string;
  targetKind?: EntityKind;
  targetDisplayId?: string;
};
```

Requirement hierarchy uses `decomposes_to` / `derived_from` issue links between
Epics, because Jira Epics cannot nest. Traversal must be **cycle-safe and
depth-limited** (`13` §6, `INV-T4`).

Relation sync is link-only in v1: we never restructure a target system's
hierarchy.

## 5. Lifecycle abstraction

Direct state-name mapping is brittle across customers who rename states. We map
through a **canonical state set**:

```
NEW → ANALYSIS → APPROVED_FOR_WORK → IN_WORK → IN_REVIEW → VERIFIED → CLOSED
                                                          ↘ REJECTED / CANCELLED
```

Each side declares `nativeState → canonicalState`. Cross-side transitions are
computed as `canonicalState → target nativeState → transition path`. This means:

- Renaming a Jira status only touches the Jira state map.
- A missing target state is a **config error surfaced at validation**, not a
  runtime crash.
- Terminal detection (`isTerminal`) is a property of the canonical state, so
  "is this done?" logic is written once.

## 6. Invariants (assert these in code)

- `INV-1` An entity has exactly one link per (flow, opposite endpoint).
- `INV-2` A link's two sides never both change in the same sync transaction.
- `INV-3` `payloadHash` unchanged ⇒ no outbound write, ever.
- `INV-4` A write always records `versionToken` observed before the write; a
  mismatch on write means conflict, not overwrite.
- `INV-5` No entity is created in a target without a pre-allocated link row in
  `PENDING` state (so a crash mid-create is detectable, never duplicated).
- `INV-6` Attachments are content-addressed by SHA-256; the same bytes are never
  uploaded twice to the same target entity.
- `INV-7` Every Epic entering a flow carries a resolved `Epic Category`; an
  unresolved one is quarantined, never defaulted.
- `INV-8` Test evidence is read from the Xray API. A `test_execution` synced
  without its run results is incomplete and must not be treated as evidence.

Trace-specific invariants (`INV-T1`–`INV-T5`) live in `13-traceability-model.md`
§8 and are equally binding.
