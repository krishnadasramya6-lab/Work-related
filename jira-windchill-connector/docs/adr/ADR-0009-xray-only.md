# ADR-0009 — Xray is the only supported test management tool

**Status:** Accepted

## Context
Zephyr Scale, Xray and native Jira issue types have fundamentally different
entity models and APIs. Supporting more than one multiplies connector surface,
fixtures and validation effort for no near-term benefit.

Native Jira issue types lack Test Run, step results and evidence entirely and
are a poor fit for a V&V record.

## Decision
Xray only. Test / Precondition / Test Set / Test Plan / Test Execution /
Test Run are the canonical V&V entities.

## Consequences
+ A well-defined entity model with real execution semantics and evidence.
+ Native requirement coverage we can consume rather than reinvent.
+ One API to learn, fixture and validate.
− The connector must talk to **three** APIs (Jira, Xray, Windchill), because
  Test Runs and step results are not Jira issues. This is a real and frequently
  underestimated cost — see `docs/04-integration-contracts.md` Part A2.
− Xray Cloud and Xray Server/DC differ; only one is supported per deployment,
  confirmed in M0.
− Migrating off Xray later would be a connector rewrite, not a config change.
