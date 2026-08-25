# Pack 06 — Build the trace & staleness engine

## Mission
Maintain T1–T5 links, compute staleness, and roll up coverage per requirement.
This is the spine of the product (M1 + M2).

## Load
1. `docs/13-traceability-model.md` (whole — the spec)
2. `docs/02-domain-model.md` §2 (Xray API boundary), §4
3. `docs/04-integration-contracts.md` Part A2 (Xray)
4. `docs/06-sync-engine.md` §5a, §5b
5. `docs/examples/trace-link-sample.json`, `flow-requirement-trace.yaml`

## Must hold
- `INV-T1` Every T1 link carries `assertedAgainstRevision`. Missing → quarantine.
- `INV-T2` Coverage `PASSED` is impossible while any T1 link on that requirement
  is `stale` or `unknown`. **This coupling is the product.** Do not let an
  optimisation break it; write the test first.
- `unknown` ≠ `current`. If Windchill is unreachable, report `unknown`.
- `INV-T3` T4 (`impacts`) rows are a derived cache with an invalidation rule,
  never stored user intent.
- `INV-T4` Hierarchy traversal is cycle-safe and depth-limited (default 6).
- Xray coverage is filtered by `Epic Category = Requirement` before roll-up.
  Never report raw Xray coverage numbers.
- Test **evidence** comes from the Xray API. A `test_execution` without run
  results is not evidence (INV-8).

## Definition of done
- [ ] Staleness recomputes on revision change, link change and nightly sweep
- [ ] Coverage roll-up implements all seven statuses in `13` §4
- [ ] Property test: staleness soundness (no `PASSED` with a stale link)
- [ ] Property test: traversal terminates on cyclic graphs
- [ ] Scenarios S1–S8, S19, S20 from `docs/11-testing-strategy.md` pass
- [ ] Projections written to both sides; human edits reverted with audit events

## Traps
- Test Runs are **not** Jira issues. Building on the Jira API alone gives you
  test definitions and no evidence — worse than useless here.
- Xray GraphQL caps `limit` at 100; large executions need several round trips.
- Xray tokens last ~24 h — refresh proactively, not on 401-retry alone.
- Windchill iteration bumps are not revision changes. Reacting to iterations
  produces staleness storms.
