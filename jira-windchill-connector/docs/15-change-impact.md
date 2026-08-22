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

## 3. Direction B — Jira requirement change → Windchill

Trigger: a requirement Epic changes materially *after* it has been included in an
approved baseline **and** its linked design outputs are at a released revision.

That combination means the change cannot be absorbed silently — it requires
formal change control.

```
 (1) DETECT   material field change on a baselined requirement
              (text, acceptance criteria, verification method — NOT labels,
               assignee, comments; the material field list is config)
 (2) ASSESS   are linked outputs RELEASED? is the requirement in an approved
              baseline? → if both, change control is required
 (3) RAISE    create a draft Windchill ECR pre-populated with the requirement,
              the before/after diff, and the affected outputs
 (4) LINK     T3 link back to a Change Work Package Epic
 (5) FLAG     mark the requirement `awaiting_change_control` in Jira until the
              ECR reaches a decided state
```

The draft ECR is **a draft**. A human completes the analysis and submits it.
The Bridge does not raise formal change records autonomously — it prepares them.

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
