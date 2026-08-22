# Pack 04 — Produce the audit trail and validation package

## Mission
Make the audit trail tamper-evident and exportable, and assemble the CSV/CSA
deliverables so a QA/RA lead can validate the system without engineering help.

## Load
1. `docs/08-security-compliance.md` (whole)
2. `docs/09-data-model.md` (audit tables + retention)
3. `docs/10-api-surface.md` §1 audit/evidence endpoints
4. `docs/11-testing-strategy.md` §5 (S14, S15)

## Must hold
- Append-only: the application DB role has INSERT only on `audit_events`.
- Hash chain per partition, with periodic signed/WORM checkpoints.
- Every audit event references the config version that produced it.
- Failures and drops are audited, not only successes ("Complete" in ALCOA+).
- No electronic signatures are created or transferred (§5) — if a requirement
  seems to need one, escalate rather than improvise.

## Definition of done
- [ ] `/audit/verify` detects a deliberate tamper at the correct sequence number
- [ ] Full per-record history export in CSV, JSON and PDF
- [ ] Traceability matrix: requirement → design doc → test case → result
- [ ] Risk assessment table completed with mitigations traced to real features
- [ ] IQ/OQ scripts executable by a non-engineer, producing signed evidence
- [ ] Retention and archival job tested, chain intact after archival

## Traps
- Redaction rules must not remove data the audit trail is required to keep;
  redact in logs, not in `audit_events`.
- Timezone display must be unambiguous in exports (store UTC, label the offset).
- Do not let "helpful" ORM features enable UPDATE on the audit table.
