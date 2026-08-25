# ADR-0005 — Defer per-user impersonation to v2

**Status:** Accepted

## Context
Some customers will require that a status change made by Priya in Jira appears
in Windchill as made by Priya.

## Decision
Deferred. v1 ships ADR-0004. v2 may add optional OAuth 3LO impersonation for
Jira and delegated Windchill principals, per-flow and opt-in.

## Consequences
+ Removes licence/consent complexity from the v1 critical path.
− A customer with a hard impersonation requirement is a v2 customer; qualify for
  this in the sales process rather than discovering it during validation.
