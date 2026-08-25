# 09 — Bridge Data Model (PostgreSQL)

Reference schema. Names here are normative for code.

```sql
-- ---------- configuration ----------
CREATE TABLE endpoints (
  id              text PRIMARY KEY,                 -- 'windchill-prod'
  system_type     text NOT NULL CHECK (system_type IN ('jira','windchill')),
  base_url        text NOT NULL,
  auth_ref        text NOT NULL,                    -- secret manager reference
  capabilities    jsonb NOT NULL DEFAULT '{}',
  concurrency_cap int  NOT NULL DEFAULT 4,
  created_at      timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE configs (                              -- immutable, versioned
  version      bigserial PRIMARY KEY,
  yaml         text  NOT NULL,
  parsed       jsonb NOT NULL,
  checksum     text  NOT NULL,
  imported_by  text  NOT NULL,
  imported_at  timestamptz NOT NULL DEFAULT now(),
  activated_at timestamptz,
  notes        text
);

CREATE TABLE flows (
  id             text PRIMARY KEY,
  config_version bigint NOT NULL REFERENCES configs(version),
  source_endpoint text NOT NULL REFERENCES endpoints(id),
  target_endpoint text NOT NULL REFERENCES endpoints(id),
  state          text NOT NULL DEFAULT 'paused'
                 CHECK (state IN ('active','paused','degraded','failed')),
  updated_at     timestamptz NOT NULL DEFAULT now()
);

-- ---------- identity ----------
CREATE TABLE links (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id            text NOT NULL REFERENCES flows(id),
  a_endpoint         text NOT NULL,
  a_external_id      text NOT NULL,
  a_display_id       text,
  a_version_token    text,
  a_last_synced_hash text,
  b_endpoint         text,
  b_external_id      text,
  b_display_id       text,
  b_version_token    text,
  b_last_synced_hash text,
  -- PENDING: created before a target create, so a crash is detectable (INV-5)
  status             text NOT NULL DEFAULT 'PENDING'
                     CHECK (status IN ('PENDING','ACTIVE','PAUSED',
                                       'UNLINKED_OUT_OF_SCOPE','SOURCE_MISSING',
                                       'TARGET_MISSING','ERROR')),
  field_snapshot     jsonb NOT NULL DEFAULT '{}',   -- bidirectional fields only
  created_at         timestamptz NOT NULL DEFAULT now(),
  last_synced_at     timestamptz,
  UNIQUE (flow_id, a_endpoint, a_external_id),
  UNIQUE (flow_id, b_endpoint, b_external_id)
);
CREATE INDEX links_flow_status_idx ON links (flow_id, status);
CREATE INDEX links_display_idx     ON links (a_display_id, b_display_id);

-- ---------- runtime ----------
CREATE TABLE watermarks (
  flow_id       text NOT NULL REFERENCES flows(id),
  side          text NOT NULL CHECK (side IN ('a','b')),
  cursor_value  text NOT NULL,
  safety_margin_sec int NOT NULL DEFAULT 120,
  advanced_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (flow_id, side)
);

CREATE TABLE work_items (
  id            bigserial PRIMARY KEY,
  flow_id       text NOT NULL,
  side          text NOT NULL,
  external_id   text NOT NULL,
  link_id       uuid REFERENCES links(id),
  partition_key text NOT NULL,                      -- link_id or flow|external_id
  attempts      int  NOT NULL DEFAULT 0,
  not_before    timestamptz NOT NULL DEFAULT now(),
  state         text NOT NULL DEFAULT 'queued'
                CHECK (state IN ('queued','running','done','deferred','quarantined')),
  trace_id      text,
  enqueued_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX work_items_ready_idx ON work_items (state, not_before)
  WHERE state IN ('queued','deferred');

CREATE TABLE pending_writes (                       -- echo suppression D2
  id            bigserial PRIMARY KEY,
  link_id       uuid NOT NULL REFERENCES links(id),
  side          text NOT NULL,
  write_id      text NOT NULL UNIQUE,               -- idempotency key
  expected_hash text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  expires_at    timestamptz NOT NULL
);
CREATE INDEX pending_writes_lookup ON pending_writes (link_id, side, expected_hash);

CREATE TABLE quarantine (
  id                 bigserial PRIMARY KEY,
  flow_id            text NOT NULL,
  link_id            uuid,
  side               text,
  source_external_id text,
  source_display_id  text,
  reason             text NOT NULL,
  message            text NOT NULL,
  source_snapshot    jsonb,
  attempted_mutation jsonb,
  target_response    jsonb,
  config_version     bigint,
  trace_id           text,
  attempts           int NOT NULL DEFAULT 0,
  status             text NOT NULL DEFAULT 'open'
                     CHECK (status IN ('open','acknowledged','resolved','ignored')),
  assigned_to        text,
  occurred_at        timestamptz NOT NULL DEFAULT now(),
  resolved_at        timestamptz,
  resolution_note    text
);
CREATE INDEX quarantine_open_idx ON quarantine (flow_id, status, reason, occurred_at);

-- ---------- audit (append only) ----------
CREATE TABLE audit_events (
  id             bigserial PRIMARY KEY,
  partition_key  text NOT NULL,                     -- hash chain partition (flow_id)
  seq            bigint NOT NULL,
  occurred_at    timestamptz NOT NULL DEFAULT now(),
  actor          jsonb NOT NULL,                    -- {kind:'service'|'human', id, displayName, onBehalfOf?}
  action         text NOT NULL,                     -- WRITE_APPLIED, CONFLICT_RESOLVED_BY_POLICY, ...
  flow_id        text,
  link_id        uuid,
  side           text,
  before         jsonb,
  after          jsonb,
  reason         text,
  config_version bigint,
  trace_id       text,
  prev_hash      text NOT NULL,
  hash           text NOT NULL,
  UNIQUE (partition_key, seq)
);
-- Application role holds INSERT only; no UPDATE/DELETE grant exists.

CREATE TABLE audit_checkpoints (
  partition_key text NOT NULL,
  seq           bigint NOT NULL,
  hash          text NOT NULL,
  signed_at     timestamptz NOT NULL DEFAULT now(),
  signature     text,
  PRIMARY KEY (partition_key, seq)
);


-- ---------- traceability (13-traceability-model.md) ----------
CREATE TABLE trace_links (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  flow_id       text NOT NULL,
  type          text NOT NULL CHECK (type IN
                ('satisfied_by','verified_by','implemented_by','impacts','published_as')),
  jira_key      text,
  jira_issue_id text,
  windchill_oid text,
  windchill_number text,
  -- The revision this assertion was made against (INV-T1). Never nullable for T1.
  asserted_against_revision text,
  asserted_at   timestamptz NOT NULL DEFAULT now(),
  asserted_by   jsonb NOT NULL,
  current_revision text,
  staleness     text NOT NULL DEFAULT 'unknown'
                CHECK (staleness IN ('current','stale','unknown')),
  -- T4 only: derived rows are a cache, not intent (INV-T3)
  derived       boolean NOT NULL DEFAULT false,
  invalidated_at timestamptz,
  superseded_at timestamptz,
  UNIQUE (flow_id, type, jira_issue_id, windchill_oid)
);
CREATE INDEX trace_links_stale_idx ON trace_links (flow_id, staleness)
  WHERE superseded_at IS NULL;
CREATE INDEX trace_links_jira_idx  ON trace_links (jira_issue_id);
CREATE INDEX trace_links_wc_idx    ON trace_links (windchill_oid);

CREATE TABLE coverage_status (
  jira_issue_id text PRIMARY KEY,
  jira_key      text NOT NULL,
  status        text NOT NULL CHECK (status IN
                ('NOT_COVERED','NOT_RUN','IN_PROGRESS','FAILED','PASSED','STALE','BLOCKED')),
  test_count    int NOT NULL DEFAULT 0,
  last_execution_key text,
  last_executed_at   timestamptz,
  stale_link_count   int NOT NULL DEFAULT 0,
  computed_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------- baselines (14-baseline-and-publish.md) ----------
CREATE TABLE baselines (
  id             text PRIMARY KEY,            -- 'BL-ALPHA-2026-08-22-001'
  label          text NOT NULL,
  flow_id        text NOT NULL,
  product_container text NOT NULL,
  scope_jql      text NOT NULL,
  resolved_keys  jsonb NOT NULL,              -- frozen, not re-resolved
  snapshot       jsonb NOT NULL,              -- entities + trace links + xray results
  content_hash   text NOT NULL,
  template_version text NOT NULL,
  config_version bigint NOT NULL,
  status         text NOT NULL DEFAULT 'frozen'
                 CHECK (status IN ('frozen','published_pending','approved','rejected','superseded')),
  overrides      jsonb NOT NULL DEFAULT '[]', -- completeness-gate overrides, with justification
  created_at     timestamptz NOT NULL DEFAULT now(),
  created_by     jsonb NOT NULL
);
-- INV-B1: snapshot/content_hash/resolved_keys are never updated after insert.

CREATE TABLE baseline_publications (
  baseline_id      text NOT NULL REFERENCES baselines(id),
  doc_kind         text NOT NULL CHECK (doc_kind IN ('SRS','VV_PLAN','VV_REPORT','TRACE_MATRIX')),
  windchill_oid    text,
  document_number  text,
  revision         text,
  submitted_at     timestamptz,
  approved_at      timestamptz,
  approvers        jsonb,
  PRIMARY KEY (baseline_id, doc_kind)
);

CREATE TABLE baseline_membership (               -- INV-B5
  baseline_id   text NOT NULL REFERENCES baselines(id),
  jira_issue_id text NOT NULL,
  jira_key      text NOT NULL,
  PRIMARY KEY (baseline_id, jira_issue_id)
);
CREATE INDEX baseline_membership_issue_idx ON baseline_membership (jira_issue_id);

CREATE TABLE where_used_cache (                  -- 15 §6 performance
  endpoint_id   text NOT NULL,
  child_oid     text NOT NULL,
  parent_oid    text NOT NULL,
  depth         int  NOT NULL,
  bom_view      text NOT NULL DEFAULT 'Design',
  refreshed_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (endpoint_id, child_oid, parent_oid, bom_view)
);

-- ---------- supporting ----------
CREATE TABLE user_aliases (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  windchill_user    text,
  jira_account_id   text,
  email             text,
  display_name      text,
  active            boolean NOT NULL DEFAULT true,
  UNIQUE (windchill_user, jira_account_id)
);

CREATE TABLE attachment_index (                     -- INV-6
  link_id     uuid NOT NULL REFERENCES links(id),
  side        text NOT NULL,
  sha256      text NOT NULL,
  filename    text NOT NULL,
  external_id text,
  bytes       bigint,
  synced_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (link_id, side, sha256)
);

CREATE TABLE schema_cache (                         -- resolved fields, transitions
  endpoint_id  text NOT NULL,
  scope_key    text NOT NULL,                       -- 'project:SWQA|issuetype:Bug'
  descriptor   jsonb NOT NULL,
  fetched_at   timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (endpoint_id, scope_key)
);
```

## Retention

| Table | Policy |
|---|---|
| `audit_events` | Default 3 years (configurable up); never deleted below the regulatory minimum; archived to cold storage with the chain intact |
| `quarantine` (resolved) | 90 days, then archived |
| `work_items` (done) | 7 days |
| `pending_writes` | expired rows swept every minute |
| `schema_cache` | refreshed on config activation or every 24 h |
| `baselines` | **Never deleted.** Retained for the product's regulatory lifetime; archived with snapshot intact |
| `trace_links` (superseded) | Retained — link history is audit evidence |
| `where_used_cache` | Invalidated on structure change; fully rebuilt nightly |

## Key query patterns

```sql
-- Find the link for an inbound change (hot path)
SELECT * FROM links WHERE flow_id=$1 AND a_endpoint=$2 AND a_external_id=$3;

-- Echo check
SELECT 1 FROM pending_writes
 WHERE link_id=$1 AND side=$2 AND expected_hash=$3 AND expires_at > now();

-- Operator: what is broken right now
SELECT reason, count(*), min(occurred_at)
  FROM quarantine WHERE status='open' GROUP BY reason ORDER BY 2 DESC;

-- Auditor: full history of one record
SELECT occurred_at, actor, action, before, after, reason
  FROM audit_events WHERE link_id=$1 ORDER BY seq;
```
