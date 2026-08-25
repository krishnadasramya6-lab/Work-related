# 15 — Change Impact Analysis

The highest-labour manual activity in MedTech design control, and a very common
audit finding. Automating it is the clearest ROI in the programme.

## 1. The question being answered

> A part or specification is changing. **What must be re-verified, and what
> documents must be re-approved?**

Today this is answered by an engineer with tribal knowledge and a spreadsheet.
It is slow, and — more seriously — it is not reproducible, which is what an
auditor actually objects to.

## 2. Direction A — Windchill change → Jira impact

Trigger: an ECR is raised, or an ECN affects a Part/Document, or a revision bump
occurs on any object that carries T1 links.

```
 (1) SEED        the changed objects: {Part X rev B→C, Spec SPEC-0031 rev A→B}
 (2) EXPAND      BOM traversal: every parent assembly using a seed object,
                 depth-limited (default 3, configurable), cycle-safe
                 + document references: specs referencing the seed
 (3) MATCH       for each object in the expanded set, find T1 links →
                 the set of affected requirement Epics
 (4) EXTEND      for each affected requirement, follow T2 → affected Xray Tests
                 and their last executions
 (5) CLASSIFY    per requirement: re-verification needed / documentation-only /
                 no impact  (§4)
 (6) EMIT        impact set → ECR's Jira Epic (T3), Windchill ECR attribute,
                 and a rendered Impact Analysis report
```

Output, written to the ECR's Change Work Package Epic and to Windchill:

```
Impact of ECR-00412 (Part PN-1234 rev B → C)
  Directly affected outputs:      2  (PN-1234, SPEC-0031)
  Parent assemblies (BOM ≤3):     4
  Affected requirements:         17
    → re-verification required:   9
    → documentation-only:         5
    → no impact (justified):      3
  Affected Xray tests:           23  (of which 6 have no current execution)
  Baselines requiring re-issue:   2  (SRS rev C, V&V Report rev B)
  Estimated re-verification scope: 23 tests / 4 test plans
```

## 3. Direction B — Jira requirement-level Change Request → Windchill (ADR-0012)

**Superseded design note:** the original version of this section had the Bridge
silently *draft* a Windchill ECR whenever a baselined requirement changed. That
assumed Jira had no change-record entity of its own. It now does — a native
Jira issue type **"Change Request"** (`requirement_cr`), distinct from the
requirement Epic and from the Change Work Package Epic (ADR-0010). This is the
**Logical View** named in the approach note; Windchill's ECR/ECN is the
**Physical View** and remains the sole *formally controlled* change record.

**Trigger:** an engineer raises a `requirement_cr` in Jira, linked to the
requirement Epic(s) it concerns — not something the Bridge infers from a field
edit. A requirement text change alone does not raise one; a human decides a
change request is warranted.

```
 (1) RECEIVE   engineer raises requirement_cr in Jira, linked to requirement(s)
 (2) ASSESS    are the linked design outputs RELEASED, and is the requirement
               in an approved baseline?  (same threshold as before)
 (3a) BELOW THRESHOLD   requirement_cr stays Jira-only; resolved inside Jira.
                        No Windchill record created.
 (3b) AT THRESHOLD      formal change control required →
      RAISE    create a Windchill ECR, pre-populated with the requirement CR,
               the before/after diff, and the affected outputs
      LINK     T6 `raises_change`: requirement_cr → ECR  (docs/13 §2)
      NOTIFY   Change Control Notification both ways as the ECR progresses
               (this is the module the approach note names)
 (4) TRACK     requirement_cr status mirrors the ECR's decision states until
               the ECR reaches a terminal state; then requirement_cr closes
```

The threshold logic is unchanged from the original design: only work that is
**released and baselined** triggers formal change control, so requirements still
in flux don't generate change-control overhead they don't need. What changed is
*who creates the Jira record* — the engineer, not the Bridge — and its status:
a real Jira record from the moment it's raised, not a Bridge-authored draft.

If the ECR later spawns engineering work, that becomes a **Change Work Package
Epic** (T3, ADR-0010) — a different Jira entity from the `requirement_cr` that
triggered it. The two are linked, never merged; the trace matrix must keep them
distinct or the picture becomes unreadable.

## 4. Impact classification

Per affected requirement, the Bridge proposes a classification; a human confirms.
The proposal must be explainable — show the path that produced it.

| Class | Rule | Consequence |
|---|---|---|
| `RE_VERIFICATION_REQUIRED` | The changed object is a direct `satisfied_by` target, or a form/fit/function-affecting parent within BOM depth | Tests marked `REQUIRES_REVERIFICATION`; coverage → `STALE` |
| `DOCUMENTATION_ONLY` | Change is to a non-functional attribute (e.g. supplier, cosmetic text) per the configured attribute class | Baseline re-issue only, no re-testing |
| `NO_IMPACT` | Link exists but the changed attribute is outside the requirement's concern | Requires recorded justification — never silent |

`NO_IMPACT` always demands a justification string, captured in the audit trail
and rendered into the Impact Analysis report. An unjustified `NO_IMPACT` is
exactly the finding an auditor writes up.

## 5. BOM traversal

Impact does not stop at the changed part. If PN-1234 changes and a requirement
links to the assembly that uses it, that requirement may be affected.

- Traversal is **upward** (where-used), not downward.
- Depth default 3, configurable per flow; unbounded traversal on a deep product
  structure is a performance and noise disaster.
- Cycle-safe (Windchill structures can contain surprising loops via alternates
  and substitutes).
- View-aware: Design vs Manufacturing BOM views give different answers. The view
  is a config parameter, defaulting to Design.
- Effectivity-aware where configured — a superseded usage should not generate
  impact.
- Results are **cached with an invalidation rule**, never persisted as truth
  (`INV-T3`). The cache invalidates on any revision change to any node in the path.

## 6. Performance

BOM traversal plus link matching is the most expensive operation in the product.

- Precompute and maintain a `where_used` projection per Windchill endpoint,
  refreshed on structure change, rather than traversing live on every query.
- Impact analysis for a single ECR must complete in < 30 s at the sizing baseline
  (`07-reliability-observability.md` §8).
- A bulk ECN touching hundreds of parts runs as a background job with progress,
  not a synchronous request.

## 7. What this does not do

- It does not decide. It proposes, with an explainable path, and a human confirms.
- It does not auto-submit change records.
- It does not modify the BOM.
- It does not infer impact from free text similarity. Only from explicit T1/T2
  links and BOM structure. **An unlinked requirement produces no impact signal**
  — which is precisely why link completeness is a gate check in `14` §5.

That last point deserves emphasis with stakeholders: the quality of impact
analysis is exactly the quality of the trace links. The integration cannot
recover information nobody recorded.
