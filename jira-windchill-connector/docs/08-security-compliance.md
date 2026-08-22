# 08 — Security & Compliance

Target context: medical device / regulated manufacturing. The integration
touches design-control records, so it is in scope for computer system
validation and for 21 CFR Part 11 where electronic records are affected.

## 1. Authentication and secrets

- Service accounts on both sides, **least privilege**, documented permission
  matrix per flow (the installer generates the required permission list).
- Secrets stored in the customer's secret manager (Vault / AWS SM / Azure KV)
  or, at minimum, in Postgres encrypted with a KMS-held key. Never in config
  files, never in Git.
- Credential rotation without downtime: two active credential versions per
  endpoint, drain-then-retire.
- All outbound traffic TLS 1.2+; certificate validation always on; corporate CA
  bundles supported via configuration (never `insecure: true` — the option does
  not exist).

## 2. Authorization inside the Bridge

Roles: `viewer`, `operator` (replay, pause, resolve quarantine),
`config-admin` (edit/import mappings), `security-admin` (endpoints, secrets),
`auditor` (read-only, including audit trail export).

Separation of duties: a `config-admin` cannot delete audit records; nobody can.
`auditor` is read-only by construction (separate DB role).

## 3. Data handled and data minimization

| Data | Stored? | Retention |
|---|---|---|
| Canonical entity snapshots | Yes (needed for conflict detection + audit) | Configurable, default 3 years |
| Attachment content | Staged only during transfer | Deleted on success; 7 days on failure |
| User identifiers (name, email, accountId) | Yes | Lifetime of the link |
| Credentials | Yes, encrypted | Until rotated |
| Raw API responses | Only on failure (quarantine) | 90 days |

The Bridge is not a document repository. It never becomes the only place a piece
of regulated content exists.

## 4. Audit trail (Part 11 §11.10(e))

Append-only `audit_events`, tamper-evident:

- Each event stores: `id, occurredAt (UTC), actor (human or service, with the
  originating human where known), action, flowId, linkId, side, before, after,
  reason, configVersion, traceId, prevHash, hash`.
- `hash = sha256(prevHash || canonicalJson(event))` forms a hash chain per
  partition; a periodic checkpoint hash is written to WORM storage or signed.
- No update or delete path exists in the application; the DB role used by the
  app has `INSERT`-only on this table.
- Time source: NTP-synced; events record UTC and the offset used for display.

**ALCOA+ mapping**

| Principle | How we satisfy it |
|---|---|
| Attributable | Every event names the actor; where the Bridge acted on behalf of a person, both are recorded |
| Legible | Structured JSON + human-readable rendering + documented schema |
| Contemporaneous | Events written in the same transaction as the effect |
| Original | Source-system values captured verbatim in `before`/`after` |
| Accurate | Conditional writes and hash verification prevent silent corruption |
| Complete | Failures and drops are audited too, not just successes |
| Consistent | Chain ordering + monotonic sequence per partition |
| Enduring | Retention policy + backup + export |
| Available | Auditor role can export any record's full history on demand |

## 5. Electronic signatures

The Bridge **does not create or transfer electronic signatures.** Approvals stay
in the system that owns them (Windchill CCB approvals; Jira approvals if used).
We only mirror the *fact* of an approval as a read-only field plus a link back to
the signed record. Any future signature-carrying feature requires a full Part 11
§11.50/§11.70 analysis and is explicitly out of scope.

## 6. Validation (CSV/CSA) deliverables

The Bridge ships with a validation package, because a customer cannot use it in
a regulated process otherwise:

| Artifact | Content |
|---|---|
| Intended Use statement | What the system does, what it does not do |
| Risk assessment | Per-hazard: wrong data propagated, data not propagated, data lost, unauthorized change; with mitigations traced to features here |
| URS | Derived from `00-product-brief.md` use cases |
| FS/DS | These docs |
| IQ | Installation checklist, versions, config baseline |
| OQ | Scripted test cases per requirement (see `11-testing-strategy.md`) |
| PQ | Customer-executed, with their real mappings and data |
| Traceability matrix | Requirement → design → test → result |
| Change control SOP | How a mapping change is reviewed, dry-run, approved, released |
| Periodic review procedure | Reconciliation reports + quarantine review cadence |

**GAMP 5 categorization:** the platform is Category 4 (configured product); any
customer hook script (`05 §12`) is Category 5 and needs its own testing. This is
one more reason hooks are deliberately narrow.

## 7. Risk analysis extract

| Hazard | Cause | Mitigation | Residual |
|---|---|---|---|
| Wrong data propagated to a controlled record | Bad mapping | Dry-run gate, semantic validation, `onUnmapped: quarantine`, managed-block isolation | Low |
| Duplicate change records created | Lost link table, retry | Tier-2 correlation fields, idempotency keys, INV-5 | Low |
| Data not propagated (silent) | Dropped webhook, missed window | Polling as the primary signal, overlap margin, nightly reconciliation, lag alerts | Low |
| Regulated record deleted | Filter/config error | No delete path exists at all (`06 §8`) | Very low |
| Unauthorized change via the Bridge | Compromised service account | Least privilege, secret manager, all writes audited and attributable, safe mode | Low |
| Audit trail altered | Insider | Insert-only role, hash chain, WORM checkpoints | Low |
| Integration loop floods records | Symmetric mapping | Four-layer echo suppression + loop breaker | Low |

## 8. Security engineering requirements

- Webhook endpoints verify HMAC signatures and reject on clock skew > 5 min.
- All inputs from external systems are treated as untrusted: no eval of source
  data, strict JSON schema validation, SSRF-safe URL handling for remote links.
- Hook sandbox: no network, no filesystem, no `require`, CPU and memory limits.
- Dependency scanning + SBOM published per release (increasingly requested in
  MedTech supplier assessments, and expected under FDA cybersecurity guidance).
- Penetration test before GA; findings tracked to closure.
- Supplier qualification pack for customers' vendor assessment (this doc set is
  most of it).
