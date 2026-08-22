# ADR-0007 — Four independent echo defences rather than one

**Status:** Accepted

## Context
Actor filtering (ignore changes made by our service account) is the standard
single mechanism. It fails when workflow robots rewrite the modifier, when a
customer configures a shared account, or when a human edit lands in the same
batch as our write.

An undetected loop in a regulated system is a severe incident: it generates
thousands of spurious audit entries on controlled records.

## Decision
Run all four simultaneously: actor filter, pending-write table, content-hash
no-op suppression, and a per-link rate-limit loop breaker that pauses the link
and alerts (`docs/06-sync-engine.md` §1).

## Consequences
+ Any single mechanism can fail without a loop occurring.
+ D3 alone guarantees termination; D4 bounds the damage of an unforeseen case.
− Extra state (`pending_writes`) and a small write-path latency cost.
− The loop breaker can pause a legitimately hot record; the threshold is
  configurable and pausing is visible and reversible, which is the right trade.
