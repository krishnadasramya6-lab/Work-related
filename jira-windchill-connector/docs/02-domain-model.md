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

| Canonical kind | Windchill native | Jira native (typical) | Sync direction (v1) |
|---|---|---|---|
| `problem_report` | `WTProductProblem` / soft type | Issue type `Bug` | W→J create; J→W status/resolution |
| `change_request` | `WTChangeRequest2` | Issue type `Change Request` | J→W create; W→J state |
| `change_notice` | `WTChangeOrder2` | Issue type `Epic` | W→J create (read-mostly) |
| `change_task` | `WTChangeActivity2` | Issue type `Task` | W→J create; J→W status/effort |
| `document` | `WTDocument` | — (referenced only) | W→J reference/link only |
| `part` | `WTPart` | — (referenced only) | W→J reference/link only |
| `requirement` | requirement soft type | Issue type `Story` link | Bidirectional link only, v2 |

Anything not in this matrix is **rejected at config validation time**, not at
runtime.

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

## 4. Relations

```ts
type Relation = {
  type: 'parent' | 'child' | 'affects' | 'resolves' | 'references'
      | 'duplicates' | 'blocks' | 'implements';
  targetExternalId: string;
  targetKind?: EntityKind;
  targetDisplayId?: string;
};
```

Windchill relationship semantics we consume:
- CN → Change Task (`parent`/`child`)
- CR → CN (`resolves`)
- PR → CR (`resolves`)
- CN → affected/resulting WTPart, WTDocument (`affects`)

Jira relationship semantics we consume:
- Epic → Story (`parent`/`child`)
- `is blocked by` / `blocks` issue links
- Subtask (`parent`/`child`)

Relation sync is **link-only** in v1: we mirror the *existence* of a relation as
a remote link, never restructure the target system's hierarchy.

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
