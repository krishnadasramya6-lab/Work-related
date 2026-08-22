# Pack 05 — M0 discovery spike against real tenants

## Mission
Turn every `ASSUMED` row in `docs/04-integration-contracts.md` into `CONFIRMED`
or a documented workaround. Output is evidence, not code.

## Load
1. `docs/04-integration-contracts.md` (whole, especially Part C)
2. `docs/12-roadmap.md` §M0
3. `docs/01-glossary.md` (Windchill section)

## Deliverables
- [ ] `fixtures/windchill/*.json` — captured request/response for: list changed
      PRs/CRs/CNs, fetch one of each, create, patch attributes, lifecycle action,
      attachment download, principals lookup
- [ ] `fixtures/jira/*.json` — search+changelog, issue, createmeta, transitions,
      field catalogue, user search, attachment upload
- [ ] `fixtures/xray/*.json` — authenticate, getTests, getTestExecutions,
      **getTestRuns** (the evidence), coverage query, pagination behaviour
- [ ] Confirmation that Epic is a coverable issue type and that coverage results
      can be filtered by `Epic Category`
- [ ] Windchill document create/revise/attach payloads for the four publication
      soft types
- [ ] Windchill where-used (BOM parent) query shape, plus timings at real depth
- [ ] `findings.md` recording, per operation: works / needs Info*Engine / needs
      customization / blocked — with the exact error observed
- [ ] Updated status column in `04-integration-contracts.md`
- [ ] A one-page risk note if lifecycle, document create, or where-used requires
      customer-installed customization (this changes the delivery model and the
      roadmap)

## Rules
- Read-only first. Do all writes in a sandbox container/project.
- Record the exact Windchill version, patch, installed domains, and soft types.
- Capture failures verbatim — a 400 body is more useful than a summary.
- Do not write connector code in this pack. Evidence only.
