# Pack 07 — Build baseline & publish

## Mission
Snapshot a scoped Jira state, render controlled documents, publish them as
Windchill WTDocument revisions, and submit them to Windchill's approval
lifecycle. This is what Posture A rests on (M3).

## Load
1. `docs/14-baseline-and-publish.md` (whole — the spec)
2. `docs/08-security-compliance.md` §4a (validation boundary)
3. `docs/09-data-model.md` (baseline tables)
4. `docs/examples/baseline-snapshot-sample.json`
5. `docs/adr/ADR-0008-posture-a.md`

## Must hold
- `INV-B1` A snapshot is immutable once frozen; only `publication` grows.
- `INV-B2` Rendering is a **pure function** of `(snapshot, templateVersion)`.
  No clock, no network, no current-Jira reads inside a renderer. Regeneration
  must be content-identical (scenario S11) — auditors ask for this.
- `INV-B3` The Bridge submits. It never approves and never signs.
- `INV-B4` No publication with `FAILED` coverage or a `stale` T1 link in scope
  without a recorded, justified override.
- `INV-B5` Every in-scope entity records its baseline membership.
- Resolved keys are frozen in the snapshot; the JQL is never re-resolved.

## Definition of done
- [ ] Snapshot → render → publish → observe approval → write back, end to end
- [ ] Completeness gate implements every check in `14` §5 with correct
      block/warn behaviour and audited overrides
- [ ] Regeneration test: content-identical output from a stored snapshot
- [ ] Crash between document create and approval submission resumes without a
      duplicate Windchill revision
- [ ] Drift report and drift alerting
- [ ] Scenarios S9–S13 pass

## Traps
- Renderer defects silently misstate a controlled record — these are the most
  GxP-critical tests in the product. Treat them accordingly.
- A snapshot must survive deletion of the source Jira issue: hold values, not
  references.
- Two operators baselining the same scope concurrently need an advisory lock.
