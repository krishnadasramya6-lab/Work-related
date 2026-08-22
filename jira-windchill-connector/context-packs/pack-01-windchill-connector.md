# Pack 01 — Build the Windchill source connector

## Mission
Implement `SourcePort` for Windchill: change detection, fetch, normalize to
`CanonicalEntity`, attachment download.

## Load
1. `CLAUDE.md` (§4 rules, §6 working agreements)
2. `docs/02-domain-model.md` (whole)
3. `docs/04-integration-contracts.md` Part B + Part C
4. `docs/examples/canonical-entity-sample.json`

## Prerequisites
M0 discovery complete. **Do not start if Part B still has `ASSUMED` rows for the
operations you need** — raise it instead; guessing Windchill payload shapes wastes
more time than waiting for a captured request.

## Must hold
- INV-3: identical `payloadHash` ⇒ no downstream work.
- Iteration bumps with unchanged attributes must not produce a change event
  (`04 §B.4` — this is the single most common Windchill integration failure).
- Soft types resolve to canonical kinds via config, with base-type fallback.
- Every fetch records `versionToken` for later conditional writes.
- Concurrency against the endpoint is capped (default 4).

## Definition of done
- [ ] `listChangedSince` paginates and returns stable ordering
- [ ] `fetch` returns a fully populated `CanonicalEntity` for PR, CR, CN, Change Task
- [ ] Recorded fixtures for each, used in contract tests
- [ ] Fake Windchill models checkout locks, iteration-on-save, RELEASED immutability
- [ ] Handles CSRF nonce if the target version requires it
- [ ] Unmapped soft type → clear error, not a crash

## Traps
- `$filter` on modification time is not supported on every entity set — verify
  per set and fall back to a saved search if needed.
- OIDs contain colons; they must be URL-encoded in OData key segments.
- IBAs are addressed differently from modelled attributes.
- Attribute values may arrive as display strings, not internal values; capture
  both where the API offers it.
