# ADR-0001 — Normalize into a canonical entity model

**Status:** Accepted

## Context
Two options: map vendor payload → vendor payload directly (fewer moving parts),
or normalize both sides into a shared internal model.

Direct mapping is tempting with only two systems. But mapping logic is where
almost all defects and all compliance risk live, and vendor payloads (Jira ADF,
Windchill OData with soft types and IBAs) are impossible to fixture cleanly.

## Decision
All connectors normalize into `CanonicalEntity` (`docs/02-domain-model.md`).
Mapping, conflict resolution, filtering and echo detection operate only on
canonical entities.

## Consequences
+ Mapping logic is unit-testable with no live tenant — the main reason.
+ Adding a third system later is a connector, not a rewrite.
+ Filters and hooks have one stable shape to target.
− One extra hop and some information loss risk; mitigated by retaining
  `nativeType` and a raw payload reference for audit.
− Two mappings to maintain per system (native↔canonical, canonical↔config).
