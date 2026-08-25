# 16 — Crosswalk: Approach Note ↔ This Context Pack

Source: *PTC Windchill and Atlassian JIRA Integration — An Approach Note, Rev 1.0
(26-JAN-2026)*, confirmed authoritative for the architecture direction.
IRILLIC owns the programme; PDS Vision is the Windchill implementation vendor
at IRILLIC. This document reconciles the deck's naming and scope framing with
`docs/00`–`15`, without shrinking what this context pack covers.

## 1. Scope split — same split, different labels

| Approach note | This pack |
|---|---|
| Windchill (PLM) — Physical View | Windchill — controlled record (`00` §2) |
| Jira (ALM) — Logical View | Jira — working surface (`00` §2, ADR-0008) |
| Document Control, CAD Integration, DHF Management, BOM Management | Windchill scope, unchanged |
| Requirements Management, Verification Plan and Execution | Jira + Xray scope, unchanged |
| Design Input-Output Traceability | `docs/13-traceability-model.md` |
| Design Output File (mirrored from PLM) | T1 `satisfied_by` link + context projection (O6, `00` §3) |
| Document Generation | `docs/14-baseline-and-publish.md` — Jira authors the content; Windchill controls the published record (confirmed) |
| Change Management — Physical View / Logical View | Windchill ECR/ECN (sole formal record) / Jira `requirement_cr` (ADR-0012) |
| Impact Assessment — Physical View / Logical View | `docs/15-change-impact.md` Direction A / Direction B |
| Document Control Notification | The Bridge's change-detection + write-back on `document` entities (`06-sync-engine.md`) |
| Change Control Notification | T6 `raises_change` link lifecycle (`13` §2, `15` §3) |

No scope was dropped in the rework below — Risk Management (Jira-side, per the
diagram) and the GitHub/CI DevOps swim-lane are genuinely new and are tracked
as open items in §4, not silently absorbed.

## 2. The three named integration modules

The deck names three modules under PDS Vision / IRILLIC implementation scope.
This context pack is the detailed design **behind** those three modules, not a
separate or larger scope — read the crosswalk this way when presenting to the
architecture owner.

| Deck module | Realized by |
|---|---|
| **Document Export Integration Module** | `docs/14-baseline-and-publish.md` (snapshot → render → publish pipeline) + the `document`/`part` rows in `docs/05-mapping-spec.md` §3c (coverage projection) |
| **Document Control Notification Integration Module** | `docs/06-sync-engine.md` change detection + `docs/04-integration-contracts.md` Part B (Windchill document polling/events) |
| **Change Control Notification Integration Module** | `docs/15-change-impact.md` Direction A & B + T3/T6 links (`docs/13` §2) + `docs/05-mapping-spec.md` §3a, §3d |

Everything else in this pack — the trace/staleness engine (`13`), the sync
engine's echo suppression and volume control (`06`), quarantine and
observability (`07`), the compliance package (`08`), the data model (`09`) — is
the machinery those three modules are built *on*, not additional scope beyond
them. Frame it to stakeholders as depth, not scope creep.

## 3. Confirmed decisions (this session)

| Question | Answer | Where it's now encoded |
|---|---|---|
| Does Jira-generated content still route through Windchill approval? | Yes | ADR-0008 (unchanged); `14` §1 already said this |
| Is Jira's "Logical View" change management a real, independent record? | **Yes** — a native `requirement_cr`, not just a Bridge-drafted stub | ADR-0012, `13` §2 (T6), `15` §3 (rewritten), `02` §2, `05` §3d |
| Is Windchill still the sole *formally controlled* change record? | Yes | ADR-0012 says so explicitly |
| Does this pack's scope match the three named modules, or exceed the contracted scope? | This pack is the detailed design behind the three modules | §2 above |
| Who are PDS Vision / IRILLIC? | IRILLIC owns the programme; PDS Vision implements Windchill at IRILLIC | Context for `12-roadmap.md` sequencing — coordinate M0/M3 Windchill-side discovery and delivery with PDS Vision rather than assuming a greenfield build |

## 4. Open items — new scope, not yet designed

Two elements in the approach note are outside this pack's current scope and
need their own design pass before they're built, not silently folded in:

- **Risk Management** (named in Jira's scope on the diagram). ISO 14971 hazard →
  requirement → mitigation traceability is a different trace-link shape from
  T1–T6 and would need its own entity kind and mapping spec section.
- **GitHub + CI Server, DevOps Workflow swim-lane.** A third integration surface
  tying software build/release into the same traceability story. Not covered by
  any of `docs/00`–`15`. Needs scoping: does a build/release event become
  evidence in a baseline (`14`)? Does it gate anything in `15`?

Recommend a short scoping pass on both before they enter the roadmap, using the
same process this document followed: confirm with the architecture owner what
each box means operationally, then write the ADR.

## 5. Roadmap coordination note

`docs/12-roadmap.md` M0 (discovery) and M3 (baseline & publish) both depend on
Windchill-side API and document-template work. Since PDS Vision is the
Windchill implementation vendor, those milestones' exit criteria should be
confirmed against PDS Vision's own delivery plan rather than scheduled
independently — the risk is two teams each assuming the other owns the Windchill
document-create/revise contract.
