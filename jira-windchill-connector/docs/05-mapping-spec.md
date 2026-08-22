# 05 — Mapping Specification

Mapping is **declarative config**, not code. Anything a customer needs that
cannot be expressed here is a gap to close in the spec, not a script to bolt on.

## 1. Config object model

```
Endpoint      → connection + auth + capabilities
Flow          → { source, target, entityKinds, filter, direction, mapping, schedule }
Mapping       → { fields[], states, people, attachments, comments, relations, hooks }
FieldMapping  → { source, target, direction, transform?, ownership, onMissing }
```

Config is YAML, schema-validated, versioned, and stored in Git. Import to the
Bridge is an explicit, audited action. See `docs/examples/flow-pr-to-bug.yaml`.

## 2. Direction and ownership

Every field mapping declares one of:

| `direction` | Meaning |
|---|---|
| `source_to_target` | One-way write |
| `target_to_source` | One-way write, opposite |
| `bidirectional` | Requires `ownership` and a conflict policy |
| `initial_only` | Written at create, never updated (e.g. `reporter`) |
| `read_only_display` | Rendered into a description block / remote link, never a field write |

`ownership` options for bidirectional fields:

- `source_wins` / `target_wins` — deterministic, boring, preferred.
- `last_writer_wins` — allowed only for low-stakes fields (priority, labels), and
  requires trustworthy modification timestamps on both sides.
- `manual` — a divergence raises a quarantine item for a human. Required for any
  field that is GxP-relevant (state, approval, effectivity).

> **Rule:** no GxP-relevant field may be `last_writer_wins`.

## 3. Reference field mapping — Problem Report → Jira Bug (UC-1)

| Windchill (source) | Jira (target) | Direction | Notes |
|---|---|---|---|
| `Number` (PR000123) | `customfield:Windchill ID` | initial_only | Also in summary prefix |
| OID | `customfield:Windchill OID` | initial_only | Correlation key, tier-2 identity |
| `Name` | `summary` | source_to_target | Truncate to 255, ellipsis |
| `Description` | `description` | source_to_target | Text policy §7 |
| `Severity` enum | `priority` | source_to_target | Value map §4 |
| `Category`/soft type | `issuetype` | initial_only | Determines create shape |
| `Product`/container | `project` | initial_only | Routing table in flow config |
| `AffectedParts[]` | `customfield:Affected Parts` (labels/text) | source_to_target | Rendered as `PN-1234 rev B` |
| `LifecycleState` | `status` | source_to_target | Via canonical states §5 |
| `NeedDate` | `duedate` | bidirectional / source_wins | |
| `Originator` | `reporter` | initial_only | Party resolution §6 |
| `Assignee`/role | `assignee` | bidirectional / target_wins | Jira owns who does the work |
| — | `resolution` | target_to_source | Feeds Windchill `Resolution` attribute |
| — | `fixVersion` | target_to_source | Written to Windchill `SoftwareBuild` IBA |
| — | Jira key | Windchill `JIRA_KEY` IBA + remote link | initial_only |

## 4. Value maps (enums)

Value maps are explicit tables with a declared behaviour for unmapped values:

```yaml
priority:
  from: Severity
  map:
    Critical: Highest
    High:     High
    Medium:   Medium
    Low:      Low
  onUnmapped: quarantine   # quarantine | default | skip
  default: Medium
```

`onUnmapped: quarantine` is the default for anything decision-bearing. Silent
defaulting of a severity is exactly how a regulated integration loses trust.

## 5. State mapping

Two hops, via canonical states (`02-domain-model.md` §5):

```yaml
states:
  canonicalSet: change_workflow_v1
  source:                      # Windchill
    INWORK:       IN_WORK
    UNDERREVIEW:  IN_REVIEW
    APPROVED:     APPROVED_FOR_WORK
    RESOLVED:     VERIFIED
    CLOSED:       CLOSED
    CANCELLED:    CANCELLED
  target:                      # Jira
    "To Do":       NEW
    "In Progress": IN_WORK
    "In Review":   IN_REVIEW
    "Done":        CLOSED
    "Won't Do":    CANCELLED
  transitionPolicy:
    strategy: shortest_path     # shortest_path | direct_only
    onUnreachable: quarantine
    requiredFieldsOnTransition:
      Done: { resolution: "Done" }
```

Rules:
- A canonical state present on one side but absent on the other is a
  **validation error at config import**.
- Backward transitions (CLOSED → IN_WORK) require `allowReopen: true`, off by
  default, because reopening a released change record has compliance meaning.

## 6. People (party) resolution

Order of resolution:

1. Explicit alias table in config (`windchillUser → jiraAccountId`).
2. Email match (case-insensitive, normalized).
3. Username match.
4. Directory lookup via configured IdP/LDAP mapping (optional).
5. **Fallback:** assign to the flow's `fallbackAssignee`, set `resolved: false`,
   and add a comment naming the real person. Never fail the whole sync for an
   unresolvable user, but always make the gap visible in metrics.

Additional constraints:
- Jira Cloud requires `accountId`; email may be hidden by privacy settings, so
  the alias table is the reliable mechanism — build tooling to generate it.
- A person who is not a licensed Jira user cannot be an assignee. Detect at
  validation and fall back.

## 7. Text and rich content

Internal intermediate: a restricted subset — paragraphs, bold/italic/code,
ordered/unordered lists, links, code blocks, tables (degraded to plain if
unsupported).

- Windchill (plain/HTML) → intermediate → **ADF** for Jira Cloud.
- Jira ADF → intermediate → plain text (with markers) for Windchill.
- Unsupported nodes (panels, media, macros) become plain text with a
  `[unsupported: panel]` marker plus a remote link to the original — never
  dropped silently.
- Every synced description gets a **managed block**:

```
--- Synced from Windchill (do not edit below this line) ---
Problem Report: PR000123  (rev A, state INWORK)
Product: Alpha Pump  |  Originator: R. Nair
Last synced: 2026-08-22T09:14:03Z by Windchill Bridge
-----------------------------------------------------------
```

The managed block is delimited and replaced wholesale on each sync; content
outside it is never touched. This is what makes description sync safe.

## 8. Attachments

| Rule | Detail |
|---|---|
| Direction | Configurable; default Windchill→Jira for evidence, Jira→Windchill only for explicitly tagged files |
| Identity | SHA-256 of content + filename (INV-6) |
| Size cap | Per-flow `maxAttachmentBytes` (default 25 MB); larger → link instead of copy |
| Types | Allowlist by extension/MIME; CAD natives are **link-only**, never copied |
| Naming | Preserve original name; on collision append `(n)` |
| Deletion | Never delete on the target; mark superseded in the managed block |
| Virus scanning | If the customer has an ICAP scanner configured, stream through it before upload |

## 9. Comments

- Mirrored comments are prefixed with provenance:
  `[Windchill · R. Nair · 2026-08-22 09:14] …`
- Our own service account's mirrored comments carry an invisible marker
  (`bridge-comment-id`) so they are recognized as echoes and never re-mirrored.
- Editing a mirrored comment on the target does not propagate (v1); deletions do
  not propagate.
- Comment sync is optional per flow and **off by default** — it is the largest
  source of volume and the least regulatory value.

## 10. Relations

Mirrored as **remote links** with a stable `globalId`:

```
globalId: bridge://link/{flowId}/{sourceExternalId}
```

Windchill CN → Change Tasks becomes a Jira Epic → children only if
`createHierarchy: true`; otherwise it is a link set. Hierarchy creation is
opt-in because it mutates Jira structure.

## 11. Filters (what enters a flow at all)

```yaml
filter:
  source:
    kinds: [problem_report]
    predicate: >
      softType in ['com.acme.SoftwareProblemReport']
      and container.key in ['ALPHA','BETA']
      and attributes.Discipline == 'Software'
    excludeStates: [CANCELLED]
  target:
    projects: [SWQA]
```

Filters are evaluated on the canonical entity, so they are testable offline.
A record that *leaves* the filter scope (e.g. Discipline changed to Mechanical)
does **not** delete the target; it is marked `unlinked_out_of_scope` and stops
syncing, with an audit event. Deletion is never inferred.

## 12. Hooks (escape hatch, deliberately narrow)

Two hook points only, both pure functions in a sandboxed JS runtime with no
network and no I/O:

- `beforeMap(sourceEntity) → sourceEntity` (normalize odd customer data)
- `afterMap(mutation) → mutation` (final touch-ups)

Hooks are versioned config, run under a time limit, and their input/output are
recorded in the audit trail when they alter values.

## 13. Mapping change management

- The mapping schema has a `schemaVersion`. Any incompatible change bumps it.
- Import runs: schema validation → semantic validation (fields exist on both
  sides, states complete, users resolvable) → **dry run over the last N records**
  → diff report → operator approval → activation.
- Previous config versions are retained; every audit event references the config
  version that produced it.
