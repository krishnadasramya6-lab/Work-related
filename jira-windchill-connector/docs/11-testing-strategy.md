# 11 — Testing Strategy

The canonical model exists so that the hard logic can be tested without a live
Windchill. Exploit that.

## 1. Test pyramid

| Layer | What | Count | Runs where |
|---|---|---|---|
| Unit | Mapping transforms, state resolution, party resolution, hash/dedupe, conflict policy | ~hundreds | Every commit |
| Contract | Connector ↔ recorded API fixtures (VCR-style cassettes) | ~dozens per connector | Every commit |
| Integration | Full pipeline against **fakes** implementing the port interfaces with realistic semantics | ~dozens | Every commit |
| System | Against a real Jira sandbox + a Windchill test instance | ~30 scenarios | Nightly / pre-release |
| Validation (OQ) | Scripted, evidence-producing runs mapped to requirements | per release | Release gate |

## 2. Fakes must model the nasty bits

A fake that just stores JSON teaches you nothing. The fake Jira must enforce
workflow transitions, required fields on transition screens, ADF shape, rate
limits (429 with `Retry-After`), and minute-granularity `updated`. The fake
Windchill must enforce checkout locks, iteration-on-save, RELEASED immutability,
container requirements for create, and CSRF nonces.

Every bug found in production against a real system gets a corresponding
behaviour added to the fake, permanently.

## 3. Property-based tests (highest value here)

| Property | Statement |
|---|---|
| Convergence | For any sequence of source/target edits, running the engine to quiescence yields a state where mapped fields agree per ownership policy |
| Idempotency | Processing the same event N times produces the same final state and exactly one target record |
| No-loop | Given symmetric bidirectional mapping and no external edits, the engine reaches quiescence within K writes |
| Replay safety | Replaying the event log from any point produces the same links table |
| Monotonic watermark | The watermark never advances past an unprocessed event |
| No creation without link | Every target create is preceded by a committed `PENDING` link row |

## 4. Chaos / fault injection scenarios

- Kill a worker mid-write (after external call, before commit) → expect
  convergence, zero duplicates.
- Duplicate webhook delivery ×5 → one write.
- Out-of-order events (child before parent) → deferral then success.
- Target returns 200 but did not persist (simulated) → next reconcile repairs.
- Clock skew ±10 min between Bridge and Jira → no data loss (tokens, not clocks).
- Windchill returns 500 for 10 min → circuit opens, backlog drains after recovery.
- Config activated with a bad enum map → dry run blocks it; if forced, quarantine
  grows and nothing is corrupted.

## 5. System-test scenario catalogue (the acceptance list)

| # | Scenario | Expected |
|---|---|---|
| S1 | Create software PR in Windchill | Jira Bug created < 60 s, correct project/type/fields, correlation fields set on both sides |
| S2 | Edit PR description | Managed block updated; content outside it untouched |
| S3 | Move Jira issue To Do → In Progress → Done | PR state follows canonical mapping; resolution written back |
| S4 | Add attachment in Windchill | Appears once in Jira; re-sync does not duplicate |
| S5 | Same field edited on both sides within a minute (`manual` policy) | No write; `CONFLICT_MANUAL` quarantine with a side-by-side diff |
| S6 | Windchill object checked out, then updated in Jira | Deferred, retried, succeeds after check-in |
| S7 | PR set to RELEASED, Jira edit follows | Write refused pre-flight, `TARGET_IMMUTABLE`, no error storm |
| S8 | Unmapped Severity value | `UNMAPPED_VALUE` quarantine, replay after adding the map entry succeeds |
| S9 | Windchill user with no Jira account | Fallback assignee + explanatory comment + metric increment |
| S10 | Bridge stopped 4 h, then restarted | All missed changes propagate, no duplicates, watermark lag recovers |
| S11 | Bridge DB restored to T−24 h | Links rebuilt via correlation fields; zero duplicate creates |
| S12 | 500 objects released in one CN | Backlog drains within SLA, Windchill concurrency cap respected |
| S13 | Filter changed so 50 records leave scope | Records unlinked, nothing deleted, audit events present |
| S14 | Audit export for a record | Complete chronological history; chain verification passes |
| S15 | Deliberate audit row tamper (test DB) | `/audit/verify` reports a chain break at the right sequence |

## 6. Data for testing

- A seeded Windchill test container with representative soft types, and a Jira
  sandbox project cloned from the customer's real workflow (workflows are where
  the surprises live — clone them, don't invent them).
- Anonymized production-shaped fixtures for mapping unit tests.
- Never test against production. The dry-run path exists so that production-shape
  validation does not require production writes.

## 7. Definition of done for any sync feature

- [ ] Unit tests for the mapping logic, including the unmapped/missing cases
- [ ] Fake-based integration test for the happy path and one failure path
- [ ] Quarantine reason code defined and documented if a new failure exists
- [ ] Metric and audit event emitted
- [ ] Docs updated (mapping spec / contracts / this file)
- [ ] Dry-run output shows the change sensibly
- [ ] Idempotency verified by running the scenario twice
