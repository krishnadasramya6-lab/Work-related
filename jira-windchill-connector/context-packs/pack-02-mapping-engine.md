# Pack 02 — Build the mapping & projection engine

## Mission
Pure function: `(sourceEntity, targetEntity|null, mappingConfig) → Mutation | Decision`.
No network. No database. No clock.

## Load
1. `docs/05-mapping-spec.md` (whole — this is the spec)
2. `docs/02-domain-model.md` §1, §2 (Epic discriminator), §5
3. `docs/examples/flow-ecr-to-epic.yaml`
4. `docs/11-testing-strategy.md` §3 (properties)

## Must hold
- The **Epic discriminator** is resolved before any predicate runs. An Epic with
  no `Epic Category` is quarantined (INV-7), never defaulted.
- Every unmapped enum, unresolvable user or missing state honours its declared
  `on*` policy; the default is `quarantine`, never a silent default.
- The managed description block is replaced wholesale; text outside it is never
  touched. Write a test proving user text survives.
- `initial_only` fields emit on create and never on update.
- `read_only_display` projections revert human edits with an audit event.
- GxP-relevant fields may not use `last_writer_wins` — enforce in config
  validation, not by convention.
- The engine returns a **no-op decision** when nothing would change (echo
  defence D3 depends on it).

## Definition of done
- [ ] Table-driven unit tests over every mapping in both reference YAMLs
- [ ] Property tests: convergence, idempotency of map∘map
- [ ] Config validator rejects unknown fields, incomplete state maps, GxP fields
      with `last_writer_wins`, missing required-on-create fields, and a missing
      discriminator config
- [ ] Dry-run output renders a readable per-field diff

## Traps
- Truncation must be Unicode-safe and must not split a grapheme cluster.
- Dates: internally UTC; Jira `duedate` is a date, not a datetime.
- ADF conversion is lossy; unsupported nodes get markers, never silent drops.
