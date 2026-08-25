# Pack 03 — Build the sync worker loop

## Mission
Implement stages 1–9 of the pipeline with idempotency, echo suppression,
conflict handling, retries and audit emission.

## Load
1. `docs/03-system-architecture.md` §3, §5, §6
2. `docs/06-sync-engine.md` (whole)
3. `docs/09-data-model.md` (whole)
4. `docs/adr/ADR-0007-echo-defence-in-depth.md`

## Must hold
- INV-5: a `PENDING` link row is committed before any target create.
- Pending-write rows are committed **before** the external call returns.
- Watermarks advance only after every derived work item reaches a terminal
  outcome, and always with the safety margin subtracted.
- Advisory lock per link during the write phase.
- No delete path exists (ADR-0002). If you find yourself writing one, stop.

## Definition of done
- [ ] Chaos test: kill mid-write → converges, zero duplicates
- [ ] Duplicate event ×5 → one write
- [ ] Loop test: symmetric bidirectional mapping reaches quiescence
- [ ] Loop breaker trips, pauses the link, emits metric and alert
- [ ] Every terminal outcome emits an audit event, including drops and failures
- [ ] Replay from an arbitrary point reproduces the same link table

## Traps
- Do not trust webhook payloads as data — always re-fetch (stage 2).
- Do not compare Bridge wall-clock time against source timestamps for conflict
  decisions; use source tokens.
- A quarantined item must not block the watermark, or one bad record halts a flow.
