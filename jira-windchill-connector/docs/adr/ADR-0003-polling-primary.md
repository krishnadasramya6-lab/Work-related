# ADR-0003 — Polling is the primary change signal; webhooks are an accelerator

**Status:** Accepted

## Context
Webhooks give low latency but are unreliable in exactly the deployment we
target: Jira Cloud cannot reach a Bridge inside a corporate network without a
reverse proxy or Connect app; Windchill event listeners require customer-side
customization; and webhook delivery is at-most-once in practice.

## Decision
Every flow polls on a modification-timestamp watermark with a safety-margin
overlap. Webhooks, where available, only enqueue a hint that triggers an
immediate re-fetch. Correctness must never depend on a webhook arriving.

## Consequences
+ Works on day one with zero customer-side installation.
+ A lost webhook costs latency, not data.
+ Simplifies the security review (no inbound exposure required).
− Baseline latency equals the poll interval; mitigated by webhooks where
  permitted and by a short default interval (60 s).
− Polling cost against Jira's rate budget; mitigated by narrow `fields=` lists.
