# Pack 02 — Build the mapping engine

## Mission
Pure function: `(sourceEntity, targetEntity|null, mappingConfig) → Mutation | Decision`.
No network. No database. No clock.

## Load
1. `docs/05-mapping-spec.md` (whole — this is the spec)
2. `docs/02-domain-model.md` §1, §5
3. `docs/examples/flow-pr-to-bug.yaml`
4. `docs/11-testing-strategy.md` §3 (properties)

## Must hold
- Every unmapped enum value, unresolvable user, or missing state honours its
  declared `on*` policy; the default is `quarantine`, never a silent default.
- The managed description block is replaced wholesale; text outside it is never
  modified. Write a test that proves user text survives.
- `initial_only` fields are emitted on create and never on update.
- GxP-relevant fields may not use `last_writer_wins` — enforce this in config
  validation, not by convention.
- The engine returns a **no-op decision** when nothing would change (D3 of echo
  suppression depends on it).

## Definition of done
- [ ] Table-driven unit tests over every field mapping in the reference YAML
- [ ] Property test: convergence, and idempotency of map∘map
- [ ] Config validator rejects: unknown fields, incomplete state maps, GxP fields
      with `last_writer_wins`, missing required-on-create fields
- [ ] Dry-run output renders a readable per-field diff

## Traps
- Truncation must be Unicode-safe and must not split a grapheme cluster.
- Dates: internally UTC; Jira `duedate` is a date, not a datetime — timezone
  conversion at the boundary is a real bug source.
- ADF conversion is lossy; unsupported nodes get markers, never silent drops.
