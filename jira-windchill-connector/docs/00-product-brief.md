# 00 — Product Brief

## 1. One-liner

Bidirectional, audit-grade synchronization between Atlassian Jira and PTC
Windchill PLM for regulated hardware + software product development.

## 2. Personas

| Persona | Lives in | Pain today | What the Bridge gives them |
|---|---|---|---|
| **Software engineer** (Priya) | Jira | Gets asked to "update the Windchill PR", has no licence and no training | Works only in Jira; her status changes propagate |
| **Design/QA engineer** (Ravi) | Windchill | Cannot see whether the software fix for a Problem Report is done | Live status of linked Jira work on the PR |
| **Change analyst / CCB chair** (Meera) | Windchill | Chases teams before every Change Control Board | Change Notice shows real-time completion of all linked tasks |
| **Program manager** (Ramya) | Both, unwillingly | Manual status roll-up across two tools | One traceability view, exportable |
| **Regulatory / audit lead** | Neither | No objective evidence linking defect → change → release | Immutable, exportable audit trail per record |
| **Integration admin** (IT) | The Bridge | — | Config-as-code, dry-run, replay, quarantine console |

## 3. Primary use cases (ranked)

**UC-1 — Problem Report → Jira Bug (highest value, build first).**
A Windchill Problem Report classified as software-related creates a Jira Bug in a
mapped project. Jira status, assignee, resolution and fix version flow back to
the PR. When the PR is closed in Windchill, the Jira issue is transitioned or
flagged.

**UC-2 — Change Notice task roll-up.**
A Windchill Change Notice with N Change Tasks creates N Jira issues under an
epic. The CN cannot be closed until all Jira issues reach a terminal state; the
Bridge exposes that readiness signal.

**UC-3 — Jira-originated change request.**
An engineer discovers in Jira that a released part/spec must change. A Jira issue
of type *Change Request* creates a Windchill Change Request in the right context,
with the Jira description, attachments and reporter carried over.

**UC-4 — Document/spec linkage.**
A Jira issue references a controlled Windchill document (spec, test protocol).
The Bridge maintains a live link showing the document's current revision,
lifecycle state, and whether the Jira work predates a revision bump.

**UC-5 — Requirement traceability.**
Windchill requirements (or a requirements management tool fronted by Windchill)
link to Jira stories and test executions, producing a trace matrix export.

**UC-6 — Comment and attachment mirroring.**
Discussion and evidence attached on either side is visible on the other, with
provenance ("posted by Priya in Jira").

## 4. Out of scope for v1

- CAD file transfer or viewable generation
- BOM write-back (read-only projection only)
- Multi-instance fan-out (one Jira ↔ many Windchill vaults)
- Jira Service Management customer portals
- Windchill workflow authoring / robot tasks

## 5. Success metrics

| Metric | Target |
|---|---|
| Median propagation latency, either direction | < 60 s |
| p99 propagation latency | < 5 min |
| Sync error rate (records quarantined / records processed) | < 0.1 % |
| Duplicate records created by the Bridge | 0 (hard requirement) |
| Manual cross-system data entry eliminated | > 90 % of linked records |
| Audit evidence produced without engineering effort | 100 % of synced records |
| Recovery: replay a full day of events after an outage | < 30 min |

## 6. Competitive framing

| Product | Strength | Where we differentiate |
|---|---|---|
| OpsHub Integration Manager | Very broad connector catalogue, mature Windchill support | We ship GxP audit trail + validation package as a first-class deliverable, not a service engagement |
| Planview/Tasktop Hub | Excellent flow metrics, model-based mapping | We go deeper on Windchill change objects (CR/CN/PR/Change Task semantics) |
| Kovair Omnibus | ESB architecture, many endpoints | Simpler ops: two systems, config-as-code, no ESB to run |
| Custom scripts (the real incumbent) | Free, fast to start | We provide idempotency, loop safety, replay, quarantine and audit — the parts scripts never get right |

## 7. Deployment assumptions

- Windchill is typically **on-premise or private-cloud**, behind a corporate
  firewall. Therefore the Bridge must support a **self-hosted deployment** and
  must not require Windchill to reach the public internet.
- Jira may be **Cloud** or **Data Center**. Cloud means webhooks come *inbound*
  to us; DC may allow either webhooks or polling.
- Assume the Bridge runs inside the customer network, egressing to Jira Cloud
  over HTTPS, and reaching Windchill over the LAN.
