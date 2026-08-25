# ADR-0010 — Requirements are Jira Epics; a required field discriminates them from change work packages

**Status:** Accepted (with a flagged limitation)

## Context
The chosen model uses native Jira Epics for requirements — no requirements
add-on. Separately, each Windchill ECR gets its own Jira Epic as a change work
package.

That makes `Epic` carry two incompatible meanings. Without a discriminator:
JQL and mapping predicates cannot separate them; Xray requirement coverage would
count change epics as requirements; the trace matrix would mix them; and the two
need different workflows.

## Decision
Requirements are Epics. A **required** single-select field, `Epic Category`
(`Requirement` | `Change`), discriminates them. Every filter, mapping predicate
and coverage roll-up keys on it. `onMissing: quarantine` — never guess.

Requirement hierarchy is expressed with `decomposes_to` / `derived_from` **issue
links** between Epics, since Epics cannot nest.

## Consequences
+ Works with native Jira; no add-on licence or extra API surface.
+ The discriminator is a single field the Bridge resolves by name at activation,
  so it adapts if the team later moves to separate issue types.
− **Requirement hierarchy is second-class.** Depth is unbounded, cycles are
  possible, Jira's UI will not render the tree, and Advanced Roadmaps will not
  understand it. Traversal must be cycle-safe and depth-limited (`INV-T4`).
− Jira Epics have no versioning, so requirement "revision" only exists as
  baseline membership (ADR-0008, `docs/14`).
− Xray will treat change epics as coverable issues; the Bridge must filter
  coverage by category and never report raw Xray coverage numbers.

**Revisit trigger:** if requirement count or hierarchy depth makes the trace
matrix the only usable view of the requirement tree, a requirements add-on
solves this natively. Raise it rather than working around it indefinitely.
