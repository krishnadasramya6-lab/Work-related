# ADR-0004 — Writes use a single named service account, not user impersonation

**Status:** Accepted (revisit at v2, see ADR-0005)

## Context
Impersonation makes each change attributable to the original human in the target
system's own history, which auditors like. It also requires OAuth consent per
user, a Jira licence per user, admin-level trust, and doubles the failure modes
(one user's token expiring breaks their changes only — hard to diagnose).

## Decision
All writes are performed by a clearly named service account ("Windchill Bridge").
The originating human is recorded in (a) the Bridge audit trail, (b) the managed
description block, and (c) mirrored comment provenance prefixes.

## Consequences
+ Simple, robust, one credential to rotate.
+ Changes made by the integration are instantly recognizable in both systems.
+ Attribution requirement is met by our audit trail, which is stronger evidence
  than target-system history anyway.
− Target-system history shows the service account as the modifier; this must be
  explained in the validation package and accepted by QA.
