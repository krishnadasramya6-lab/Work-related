# ADR-0006 — Mapping configuration is versioned YAML in Git, imported explicitly

**Status:** Accepted

## Context
Alternative is a database-backed UI editor where changes take effect immediately.
That is friendlier but produces no reviewable diff, no approval step, and no
reproducible baseline — all of which a validated system needs.

## Decision
YAML, JSON-Schema-validated, stored in the customer's Git. Import → validate →
dry run → approve → activate, all audited. The UI edits the YAML and shows the
diff; it does not bypass the pipeline.

## Consequences
+ A mapping change follows the customer's existing change-control SOP naturally.
+ Every audit event references the exact config version that produced it.
+ Rollback is `git revert` + re-import.
− Slower than clicking; deliberate.
