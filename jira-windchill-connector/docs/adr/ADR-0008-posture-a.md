# ADR-0008 — Posture A: Jira is the working surface, Windchill holds the controlled record

**Status:** Accepted

## Context
Requirements and V&V results are design control records under ISO 13485 §7.3 and
21 CFR 820.30, and electronic records under 21 CFR Part 11. They will live in
Jira and Xray, which have no revision control, no approval workflow, no
effectivity, and no e-signature. Admins can delete issues; history retention is
weak.

Two viable postures:

- **A.** Jira/Xray are *working* surfaces. At defined baselines the content is
  rendered into approved, revision-controlled Windchill documents. Jira needs
  only light validation.
- **B.** Validate Jira + Xray as Part 11 systems — e-signatures, locked-down
  permissions, retained audit logs, controlled admin change. Expensive,
  permanently constraining on Jira administration, and fighting the tool's design.

## Decision
Posture A. Baseline-and-publish (`docs/14-baseline-and-publish.md`) is a
mandatory core capability, not an optional feature.

## Consequences
+ Engineers keep Jira's speed and flexibility; no frozen requirements in Jira.
+ Jira validation scope shrinks dramatically; Jira admins keep their freedom.
+ Windchill's existing, already-validated approval and revision machinery does
  the regulatory work — we add no signature capability and stay clear of
  Part 11 §11.50/§11.70.
+ The controlled record is a document an auditor already knows how to read.
− The published baseline is a point-in-time record; between baselines Jira drifts.
  Mitigated by mandatory drift reporting (`14` §7), which is itself an honest
  answer to a question most organizations cannot answer at all.
− Baseline publication becomes a critical path capability. If it does not work,
  the compliance story does not work.
