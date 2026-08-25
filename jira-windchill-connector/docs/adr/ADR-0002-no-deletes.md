# ADR-0002 — The Bridge never deletes records in a target system

**Status:** Accepted

## Context
Sources get deleted, cancelled, or fall out of a filter's scope. The "symmetric"
behaviour would be to delete the counterpart.

In a regulated context, records are evidence. A config typo that deletes a
thousand Jira issues is unrecoverable and reportable. Competitors' deletion
propagation is a known source of customer incidents.

## Decision
No code path in the Bridge issues a delete against Jira or Windchill.
Source deletion/cancellation results in `annotate` (default), `transition`, or
`unlink`, per `docs/06-sync-engine.md` §8.

## Consequences
+ The worst-case blast radius of a misconfiguration is noise, never data loss.
+ Simplifies the compliance risk assessment considerably.
− Orphaned target records accumulate; mitigated by labelling and reconciliation
  reports so cleanup is a deliberate human act.
