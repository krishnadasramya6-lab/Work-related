# Pack 08 — Build change impact analysis

## Mission
Given a Windchill change, produce the re-verification scope automatically and
explainably (M4).

## Load
1. `docs/15-change-impact.md` (whole — the spec)
2. `docs/13-traceability-model.md` §2 (T4), §8
3. `docs/09-data-model.md` (`where_used_cache`)
4. `docs/07-reliability-observability.md` §8 (sizing)

## Must hold
- Impact **proposes**; a human confirms. The Bridge never auto-submits a formal
  change record — Direction B produces a *draft* ECR.
- Every classification is explainable: show the path that produced it.
- `NO_IMPACT` requires a justification string. The API rejects an empty one.
- BOM traversal is upward, depth-limited (default 3), cycle-safe, view-aware.
- `where_used` is a maintained projection, not a live traversal per query.
- Impact for a single ECR completes in < 30 s at the sizing baseline; a bulk ECN
  runs as a background job with progress.

## Definition of done
- [ ] Direction A and Direction B both implemented
- [ ] Classification with explainable paths; justification enforced
- [ ] Scenarios S14–S18 pass, including the cyclic-BOM case
- [ ] `where_used` cache invalidates correctly on structure change
- [ ] Impact Analysis report rendered onto the ECR and its Change Epic

## Traps
- Unbounded traversal on a deep product structure is a performance and noise
  disaster. The depth limit is a feature, not a shortcut.
- Design vs Manufacturing BOM views give different answers — make the view
  explicit, never implicit.
- An unlinked requirement produces no impact signal. That is correct behaviour,
  but say it plainly to stakeholders: impact quality equals link quality.
