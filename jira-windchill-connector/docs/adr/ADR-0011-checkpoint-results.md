# ADR-0011 — Sync test results at Test Execution completion, never per Test Run

**Status:** Accepted

## Context
Test Runs are orders of magnitude higher volume than any other entity — a nightly
regression suite can produce thousands. Windchill change and document objects are
low-volume, controlled records.

Streaming every run into Windchill would flood the method servers, generate
enormous audit volume on controlled records, and destroy the signal value of the
controlled record itself.

## Decision
The sync checkpoint is the **Test Execution**, taken when complete (all runs
terminal, or explicitly closed — both signals configurable). Individual Test Runs
are read from the Xray API for roll-up but are never synced as entities.

## Consequences
+ Windchill sees a meaningful, reviewable unit of evidence.
+ Volume stays within the Windchill concurrency budget.
+ Audit trail on controlled records stays legible.
− Latency: results are visible cross-boundary only after an execution completes.
  Accepted — a half-finished regression run is not V&V evidence.
− An execution left permanently open never checkpoints. Mitigation: an age-based
  alert on incomplete executions in a baseline scope, surfaced by the `14` §5
  completeness gate.
