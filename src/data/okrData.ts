// Enterprise OKR & KRA Data — Irillic FY 2026-27
// Source: Master OKR Sheet 2026-27 (10 May updated)

export type RAGStatus = 'green' | 'amber' | 'red' | 'pending';
export type ObjColor = 'blue' | 'teal' | 'emerald' | 'violet' | 'orange';

export interface KeyResult {
  id: string;
  code: string;
  description: string;
  weightage: string;
  teams: string[];
  timeline: string;
}

export interface StrategicObjective {
  id: string;
  number: number;
  title: string;
  shortTitle: string;
  color: ObjColor;
  keyResults: KeyResult[];
}

export interface KRA {
  id: string;
  objectiveRef: string;
  objectiveNumber: number;
  code: string;
  title: string;
  owner: string;
  supportFunctions: string[];
  dueDate: string;
  weightage: string;
  progress: number | null;
  status: RAGStatus;
  risks: string[];
}

export interface Department {
  id: string;
  name: string;
  fullName: string;
  colorClass: string;
  badgeClass: string;
  kras: KRA[];
}

export interface Milestone {
  id: string;
  title: string;
  department: string;
  dateLabel: string;
  sortKey: string;
  quarter: 'Q1' | 'Q2' | 'Q3' | 'Q4';
  objectiveRef: string;
  color: ObjColor;
}

// ─── Strategic Objectives (Org Level) ───────────────────────────────────────

export const strategicObjectives: StrategicObjective[] = [
  {
    id: 'obj-1',
    number: 1,
    title: 'Establish a successful and strong base of L.nm (WL & NIR) with competition in India.',
    shortTitle: 'L.nm Market Entry',
    color: 'blue',
    keyResults: [
      {
        id: 'kr-1-1',
        code: 'KR 1.1',
        description: 'Successful sale of 111 units of L.nm in India (86 WL + 26 NIR) and 12 units in international markets — quarterly tracked against pipeline coverage of ≥2.5x',
        weightage: '30%',
        teams: ['Sales', 'CAS', 'MKG', 'Product Mgmt'],
        timeline: 'Q4 FY27',
      },
      {
        id: 'kr-1-2',
        code: 'KR 1.2',
        description: 'Product launches across 4 specialties (Gastro, General Surgery, Arthroscopy, Gynecology) of L.nm WL & NIR with standardized clinical protocols by Q2; Activate KOLs at 10 sites with ≥4 case-presenting KOLs',
        weightage: '30%',
        teams: ['Product Mgmt', 'RND', 'MKG', 'CAS', 'QA/RA'],
        timeline: 'Q2 FY27',
      },
      {
        id: 'kr-1-3',
        code: 'KR 1.3',
        description: 'Production & supply readiness for L.nm — quarterly output delivered per Sales forecast with zero unit-availability delay; FPY ≥ 98%; OQC yield 100%; OTD from critical vendors ≥ 90%',
        weightage: '10%',
        teams: ['Purchase', 'QA/RA', 'RND'],
        timeline: 'Quarterly',
      },
      {
        id: 'kr-1-4',
        code: 'KR 1.4',
        description: 'Customer satisfaction (CSAT) ≥ 8/10 on installed base — installation TAT ≤10 days from PO closure, breakdown response ≤24 hr, MTTR ≤72 hr, first-time install success ≥95%',
        weightage: '10%',
        teams: ['CS', 'CAS', 'Sales'],
        timeline: 'Quarterly',
      },
      {
        id: 'kr-1-5',
        code: 'KR 1.5',
        description: 'Field readiness — 100% trained & certified Sales/CAS/Service teams on L.nm WL (May 2026) and NIR (Aug 2026); 10 clinical testimonials secured for sales enablement',
        weightage: '10%',
        teams: ['HR', 'Sales', 'CAS', 'Product Mgmt'],
        timeline: 'May–Aug 2026',
      },
      {
        id: 'kr-1-6',
        code: 'KR 1.6',
        description: 'Regulatory & compliance enablement — BIS approval for L.nm by Aug 2026, post-approval submission for Arthroscopy by Jul 2026, 2-country product registration (Nepal, Bangladesh), L.nm OQC yield 100%, BIS design readiness May 2026',
        weightage: '10%',
        teams: ['QA/RA', 'RND', 'MFG'],
        timeline: 'Aug 2026 / Mar 2027',
      },
    ],
  },
  {
    id: 'obj-2',
    number: 2,
    title: 'Establish Irillic .nm (Base & HD Variant) as a market-reliable revenue engine with consistent & predictable sales in domestic & global market.',
    shortTitle: '.nm Revenue Engine',
    color: 'teal',
    keyResults: [
      {
        id: 'kr-2-1',
        code: 'KR 2.1',
        description: 'Successful sales of 133 units in domestic market and 22 units in international market for Irillic .nm (Base & HD) — forecast accuracy variance ≤X% region-wise; 60-70% of quarter target delivered in first two months',
        weightage: '35%',
        teams: ['Sales', 'MKG', 'Product Mgmt'],
        timeline: 'Q4 FY27',
      },
      {
        id: 'kr-2-2',
        code: 'KR 2.2',
        description: 'International market activation — onboard 10 KOLs across global markets (Brazil, Turkey, Philippines, Malaysia, Egypt, Russia); appoint distributors and activate sales per timeline; 25 KOL-to-sales conversions',
        weightage: '20%',
        teams: ['Product Mgmt', 'Sales', 'MKG', 'CAS'],
        timeline: 'Jun–Sep 2026',
      },
      {
        id: 'kr-2-3',
        code: 'KR 2.3',
        description: 'Regulatory clearances for international expansion — ISO 13485 & CE Surveillance audit closed with zero major NCs; product registration in 4 identified countries (Philippines, Malaysia, Egypt) by Jul 2026',
        weightage: '10%',
        teams: ['QA/RA', 'Sales', 'RND'],
        timeline: 'Jun 2026',
      },
      {
        id: 'kr-2-4',
        code: 'KR 2.4',
        description: 'Demand-supply integration with MFG — quarterly demand forecast process between Sales and MFG/Purchase; .nm CE & non-CE production output achieved per Sales forecast; rolling 3-month build plan published monthly',
        weightage: '15%',
        teams: ['Sales', 'MFG', 'Purchase', 'Product Mgmt'],
        timeline: 'Quarterly',
      },
      {
        id: 'kr-2-5',
        code: 'KR 2.5',
        description: 'Engineering-to-Manufacturing seamless flow — PDF reporting rolled out by May 2026; ≥2 alternates for Level-1 CCL parts and ≥1 alternate for Level-2 CCL by Q2; design transfer + training to MHMS with zero post-handover production stoppage',
        weightage: '10%',
        teams: ['RND', 'Purchase', 'MFG', 'QA/RA'],
        timeline: 'Q2 FY27',
      },
      {
        id: 'kr-2-6',
        code: 'KR 2.6',
        description: 'Install-base utilization & retention — increase install-base utilization by 50%; AMC attachment rate ≥60% on .nm; international service playbook with remote support & spares logistics in 2 markets by Q2',
        weightage: '10%',
        teams: ['CS', 'Product Mgmt', 'Sales'],
        timeline: 'Q2–Q4 FY27',
      },
    ],
  },
  {
    id: 'obj-3',
    number: 3,
    title: 'Drive P&L cost efficiency and maximize gross margin for Irillic .nm & Irillic L.nm by being overall EBITDA positive.',
    shortTitle: 'P&L & EBITDA Positive',
    color: 'emerald',
    keyResults: [
      {
        id: 'kr-3-1',
        code: 'KR 3.1',
        description: 'Supply chain productivity — BOM cost reduction of 5% on .nm and 5% on L.nm by Jul 2026; dual-source qualification for L1/L2 critical parts; OTD ≥ 90% from vendors on critical L.nm components',
        weightage: 'TBD',
        teams: ['Purchase', 'MFG', 'Finance'],
        timeline: 'Jul 2026',
      },
      {
        id: 'kr-3-2',
        code: 'KR 3.2',
        description: 'Manufacturing cost-out — HLA cost reduced by 20%; 10% manufacturing cost reduction with MHMS for .nm and L.nm by Q2; First Pass Yield ≥ 98% and Rejection/Rework ≤ 5%',
        weightage: 'TBD',
        teams: ['MFG', 'Purchase', 'RND', 'QA/RA'],
        timeline: 'Q2 FY27',
      },
      {
        id: 'kr-3-3',
        code: 'KR 3.3',
        description: 'Working capital & inventory — reduce existing inventory from ₹4 cr to ≤ ₹2 cr; raw-material DOH cut by demand-aligned procurement; E&O inventory reduced ≥ 30%; monthly inventory within ±5% of approved budget',
        weightage: 'TBD',
        teams: ['MFG', 'Purchase', 'Finance', 'Sales'],
        timeline: 'FY27 Close',
      },
      {
        id: 'kr-3-4',
        code: 'KR 3.4',
        description: 'ASP & gross margin uplift — increase ASP of .nm and L.nm portfolios with gross margin contribution improvement; monthly GM by product reported from Jun 2026',
        weightage: 'TBD',
        teams: ['Sales', 'MKG', 'Product Mgmt', 'Finance'],
        timeline: 'Jun 2026+',
      },
      {
        id: 'kr-3-5',
        code: 'KR 3.5',
        description: 'Cash-flow controls — weekly receivables ageing review with >90-day bucket reduced to ≤X% of AR by Q4; payables DPO maintained with zero late-payment penalties; inventory linearity ≥90%; consolidated cash-flow report weekly',
        weightage: 'TBD',
        teams: ['Finance', 'Sales', 'CS'],
        timeline: 'Weekly / Q4',
      },
      {
        id: 'kr-3-6',
        code: 'KR 3.6',
        description: 'Operating budget discipline — 100% adherence to QA/RA, R&D, Marketing, T&L budgets within ±5% per cost centre per quarter; monthly EBITDA tracked vs plan with corrective trigger if variance >5% for 2 consecutive months',
        weightage: 'TBD',
        teams: ['Finance', 'All Depts'],
        timeline: 'Quarterly',
      },
      {
        id: 'kr-3-7',
        code: 'KR 3.7',
        description: 'Hiring discipline for ROI — critical roles (R&D, Sales, Service, Clinical) closed within 120 days with offer-to-join ≥ 80%; manpower cost within budget; revenue per employee +15%',
        weightage: 'TBD',
        teams: ['HR', 'Finance', 'All Functional Heads'],
        timeline: 'Q1–Q2 FY27',
      },
    ],
  },
  {
    id: 'obj-4',
    number: 4,
    title: 'Strengthen the product portfolio by delivering against all defined development milestones for X.NM, V2 of .NM, and L.NM.',
    shortTitle: 'NPD Milestone Delivery',
    color: 'violet',
    keyResults: [
      {
        id: 'kr-4-1',
        code: 'KR 4.1',
        description: 'L.nm V2 milestone delivery — M0 Jun 26 → M1P1 Jul 26 → M1P2 Sep 26 → M1P3 Nov 26 → M2P1 Dec 26 → M2P2 Jan 27 → M2P3 Feb 27 → M3 Mar 27',
        weightage: 'TBD',
        teams: ['RND', 'Product Mgmt', 'QA/RA', 'Purchase', 'MFG', 'Sales/MKG'],
        timeline: 'Jul 2026 – Mar 2027',
      },
      {
        id: 'kr-4-2',
        code: 'KR 4.2',
        description: '.nm V2 milestone delivery — M0 Jul 26 → M1P1 Sep 26 → M1P2 Nov 26 → M1P3 Feb 27',
        weightage: 'TBD',
        teams: ['RND', 'Product Mgmt', 'QA/RA', 'Purchase', 'MFG'],
        timeline: 'Sep 2026 – Feb 2027',
      },
      {
        id: 'kr-4-3',
        code: 'KR 4.3',
        description: 'X.nm milestone delivery — M0 Aug 26 → M1P1 Oct 26 → M1P2 Mar 27',
        weightage: 'TBD',
        teams: ['RND', 'Product Mgmt', 'QA/RA', 'Purchase', 'MFG'],
        timeline: 'Q1 – Jan 2027',
      },
      {
        id: 'kr-4-4',
        code: 'KR 4.4',
        description: 'Regulatory readiness for NPD — X.nm regulatory strategy by Jul 2026; Test license Oct 2026; manufacturing license submission Mar 2027; X.nm scope added to ISO 13485 by Sep 2026',
        weightage: 'TBD',
        teams: ['QA/RA', 'RND', 'Product Mgmt'],
        timeline: 'Jul 2026 – Mar 2027',
      },
      {
        id: 'kr-4-5',
        code: 'KR 4.5',
        description: 'Sourcing & manufacturing readiness for NPD — long-lead component sourcing qualified per RND milestone calendar (zero hold on M1/M2 phase gates); MFG Process Engineering ready ≤1 month after Design Release',
        weightage: 'TBD',
        teams: ['Purchase', 'MFG', 'RND', 'QA/RA'],
        timeline: 'Per RND Milestones',
      },
      {
        id: 'kr-4-6',
        code: 'KR 4.6',
        description: 'DFM and product-management led NPD governance — 100% NPD releases with DFM & DFS input from MFG; PRD signed off; Sales/MKG M0–M3 milestone activities delivered per quarter calendar',
        weightage: 'TBD',
        teams: ['Product Mgmt', 'MFG', 'RND', 'MKG', 'CS'],
        timeline: 'Quarterly',
      },
      {
        id: 'kr-4-7',
        code: 'KR 4.7',
        description: 'NPD financial governance — 100% pre-sanction adherence on capex; ≤5% variance vs approved capex plan at quarter-end; project-level cost tracking quarterly; IRR-approved before market-entry spend',
        weightage: 'TBD',
        teams: ['Finance', 'RND', 'Product Mgmt'],
        timeline: 'Quarterly',
      },
    ],
  },
  {
    id: 'obj-5',
    number: 5,
    title: 'Develop new business streams of revenue & identify inorganic opportunities for long-term success (3-year horizon).',
    shortTitle: 'New Business & M&A',
    color: 'orange',
    keyResults: [
      {
        id: 'kr-5-1',
        code: 'KR 5.1',
        description: 'ICG product platform — Development of ICG Kit concept across all products by Nov 2026; Project Plan for irillic-branded ICG locked; vendor base expansion completed for ICG kit',
        weightage: 'TBD',
        teams: ['RND', 'Purchase', 'Product Mgmt', 'QA/RA'],
        timeline: 'Nov 2026',
      },
      {
        id: 'kr-5-2',
        code: 'KR 5.2',
        description: 'Imaging accessories portfolio — Camera Holder Arm for L.nm & .nm by Dec 2026; Custom Light Guides concept by Mar 2027; vendor base expansion for camera holder arms and custom light guides',
        weightage: 'TBD',
        teams: ['RND', 'Purchase', 'Product Mgmt', 'MFG'],
        timeline: 'Dec 2026 / Mar 2027',
      },
      {
        id: 'kr-5-3',
        code: 'KR 5.3',
        description: 'Advanced visualization — Development prototype of 2D and 3D Scopes by Dec 2026; vendor base expansion for 2D/3D scopes',
        weightage: 'TBD',
        teams: ['RND', 'Purchase', 'Product Mgmt'],
        timeline: 'Dec 2026',
      },
      {
        id: 'kr-5-4',
        code: 'KR 5.4',
        description: 'Brand & regulatory — Initiate HSW scope under irillic Brand by Dec 2026; due-diligence support (QA/RA) for any M&A projects as needed',
        weightage: 'TBD',
        teams: ['QA/RA', 'RND', 'Leadership'],
        timeline: 'Dec 2026 / On-demand',
      },
      {
        id: 'kr-5-5',
        code: 'KR 5.5',
        description: 'M&A / inorganic opportunity pipeline — identify and qualify 1–2 inorganic opportunities aligned to 3-year horizon; business case + IRR-approved before commitment',
        weightage: 'TBD',
        teams: ['Leadership', 'Finance', 'QA/RA', 'Strategy'],
        timeline: 'FY27 + 3-year',
      },
    ],
  },
];

// ─── Department KRAs ─────────────────────────────────────────────────────────

export const departments: Department[] = [
  {
    id: 'rnd',
    name: 'R&D',
    fullName: 'Research & Development',
    colorClass: 'text-violet-700',
    badgeClass: 'bg-violet-100 text-violet-700 border-violet-200',
    kras: [
      // Obj 1
      { id: 'rnd-1-1', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 1', title: 'WL Product release to production by May 2026 (General & Gastro)', owner: 'Machaiah', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing'], dueDate: 'May 2026', weightage: '-', progress: null, status: 'pending', risks: ['Import License for Henke – In Progress, may arrive Dec 2026', 'Erbe supply chain risk – need multiple source', 'MHMS procurement: Critical parts to be provided by Irillic', 'Demo unit demand increasing – needs allocation planning', 'Dedicated team required – timelines can slip due to competing priorities'] },
      { id: 'rnd-1-2', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 2', title: 'Product release to production with Arthroscopy by June 2026', owner: 'Machaiah', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing'], dueDate: 'Jun 2026', weightage: '-', progress: null, status: 'pending', risks: ['Software Tuning – KOL Design Validation with Optics outputs may push 4mm delivery', 'QA-RA Timelines for CDSCO go-ahead: 4-6 months typical', 'Major callbacks for 4K WL Camera Heads – intended upgrade Jun 2026', 'Light Guide (small dia) procurement has longer lead time'] },
      { id: 'rnd-1-3', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 3', title: 'NIR Configuration (5mm & 10mm) Product release to production by July 2026', owner: 'Machaiah', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase'], dueDate: 'Jul 2026', weightage: '-', progress: null, status: 'pending', risks: ['Dedicated team required – timelines can slip due to competing priorities', 'Financial budget allocation and timely payments required'] },
      { id: 'rnd-1-4', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 4', title: 'Product release to production with Gynecology by August 2026', owner: 'Machaiah', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing'], dueDate: 'Aug 2026', weightage: '-', progress: null, status: 'pending', risks: ['Software Tuning for 4mm may push timelines', 'KOL Design Validation with Optics outputs uncertain', 'Small dia light guide – custom order with longer procurement lead time'] },
      { id: 'rnd-1-5', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 5', title: 'BIS product design readiness to be ensured by May 2026', owner: 'Machaiah', supportFunctions: ['QA/RA', 'Purchase'], dueDate: 'May 2026', weightage: '-', progress: null, status: 'pending', risks: ['Dedicated team bandwidth constraint', 'Financial budget allocation and timely payments required'] },
      { id: 'rnd-1-6', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 6', title: 'Stable design or V2 L.nm for global submission to be ready by Jan 2027', owner: 'Machaiah', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing', 'Manufacturing'], dueDate: 'Jan 2027', weightage: '-', progress: null, status: 'pending', risks: ['Dedicated team required', 'Financial budget allocation required'] },
      // Obj 2
      { id: 'rnd-2-1', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 1', title: 'Roll out of PDF reporting by May 2026', owner: 'Vaishalini', supportFunctions: ['RND', 'CAS'], dueDate: 'May 2026', weightage: '-', progress: null, status: 'pending', risks: ['Obsolescence management plan needed', 'Level 1 and Level 2 CCL – BOM components mapped with lifecycle status required', 'Silicon Expert Software for early EOL warning (6-12 months)', 'Approved vendor list: ≥2 suppliers for critical parts', 'Dedicated Change Management / Sustainance Team Allocation required'] },
      { id: 'rnd-2-2', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 2', title: '100% completion of ensuring minimum 2 alternates for Level 1 CCL and 1 alternate for Level 2 CCL with validation by Q2', owner: 'RND', supportFunctions: ['Purchase'], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: ['Dedicated team bandwidth constraint'] },
      // Obj 3
      { id: 'rnd-3-1', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 1', title: 'Implement reusable trolley box for Demos for L.nm and reduce shipment cost by 5% by Sep 2026', owner: 'RND', supportFunctions: ['Purchase', 'MFG'], dueDate: 'Sep 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'rnd-3-2', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 2', title: 'BOM cost of L.nm V2 (except monitor & scope) to be reduced by 20% from current BOM by Oct 2026 (Target: WL ₹10L & NIR ₹14L)', owner: 'RND', supportFunctions: ['Purchase', 'MFG'], dueDate: 'Oct 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 4
      { id: 'rnd-4-1', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 1', title: 'L.nm V2 milestone delivery: M0 Jul 26 → M1P1 Jul 26 → M1P2 Sep 26 → M1P3 Nov 26 → M2P1 Dec 26 → M2P2 Jan 27 → M2P3 Feb 27 → M3 Mar 27', owner: 'RND', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing'], dueDate: 'Mar 2027', weightage: '-', progress: null, status: 'pending', risks: ['PR/PO/Payment Delays', 'Custom Camera Architecture not yet validated', 'Custom Camera software drivers risk', 'Lower dia scope validation and stable procurement source needed', 'CE/FDA strategy readiness required'] },
      { id: 'rnd-4-2', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 2', title: '.nm V2 milestone delivery: M0 Aug 26 → M1P1 Sep 26 → M1P2 Jan 27 → M1P3 Mar 27', owner: 'RND', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing'], dueDate: 'Mar 2027', weightage: '-', progress: null, status: 'pending', risks: ['PR/PO/Payment Delays', 'Custom Camera Architecture not yet validated', 'Custom Camera software drivers risk', 'Dedicated team required'] },
      { id: 'rnd-4-3', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 3', title: 'X.nm milestone delivery: M0 Sep 26 → M1P1 Oct 26 → M1P2 Mar 27', owner: 'RND', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing'], dueDate: 'Mar 2027', weightage: '-', progress: null, status: 'pending', risks: ['Project Budget Allocation required', 'PR/PO/Payment Delays', 'Dedicated X.nm team required'] },
      { id: 'rnd-4-4', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 4', title: 'Embed DFS requirements at design stage for L.nm V2, .nm V2 and X.nm — CS sign-off on DFS checklist at M1P1 and M2 Design Transfer gates', owner: 'RND', supportFunctions: ['PRD MGMT', 'QA/RA', 'CS'], dueDate: 'Per Milestones', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 5
      { id: 'rnd-5-1', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 1', title: 'Evaluate the feasibility of Camera Holder Arm for L.nm & .nm by Sep 2026', owner: 'RND', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing'], dueDate: 'Sep 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'rnd-5-2', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 2', title: 'Evaluate the feasibility of Custom Light Guides concept by Mar 2027', owner: 'RND', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing'], dueDate: 'Mar 2027', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'rnd-5-3', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 3', title: 'Evaluate concepts for Development of irillic-branded ICG', owner: 'RND', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing'], dueDate: 'Nov 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'rnd-5-4', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 4', title: 'Development prototype of 2D and 3D Scopes by Dec 2026', owner: 'RND', supportFunctions: ['PRD MGMT', 'QA/RA', 'CAS', 'Purchase', 'Marketing'], dueDate: 'Dec 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
    ],
  },
  {
    id: 'product-mgmt',
    name: 'Product Mgmt',
    fullName: 'Product Management',
    colorClass: 'text-blue-700',
    badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
    kras: [
      // Obj 1
      { id: 'pm-1-1', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 1', title: 'Define and launch 2 specialities (Gastro and General Surgery) with standardized protocols of WL by June 2026', owner: 'Product Management', supportFunctions: [], dueDate: 'Jun 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-1-2', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 2', title: 'Define and launch Arthroscopy standardized protocol of WL by June 2026', owner: 'Product Management', supportFunctions: [], dueDate: 'Jun 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-1-3', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 3', title: 'Define and launch NIR configuration for (Gastro and General Surgery) with standardized protocol by Sep 2026', owner: 'Product Management', supportFunctions: [], dueDate: 'Sep 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-1-4', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 4', title: 'Activate 10 KOL sites in India to complete KOL validation and convert at least 4 as case-presenting KOLs', owner: 'Product Management', supportFunctions: [], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-1-5', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 5', title: 'Define and launch Gynecology standardized protocol of WL by September 2026', owner: 'Product Management', supportFunctions: [], dueDate: 'Sep 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-1-6', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 6', title: 'Obtain 10 clinical testimonials for sales enablement — 50% by Q1', owner: 'Product Management', supportFunctions: [], dueDate: 'Q1–Q4 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 2
      { id: 'pm-2-1', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 1', title: 'Onboard 10 KOLs across global markets (Brazil, Turkey, Philippines, Malaysia, Egypt, Russia)', owner: 'Product Management', supportFunctions: [], dueDate: 'Jun–Sep 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-2-2', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 2', title: 'Initiate expansion of 2 new applications and project plan to be ready by Q2', owner: 'Product Management', supportFunctions: [], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-2-3', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 3', title: 'Product market fit assessment to be completed for portable .nm by Q3', owner: 'Product Management', supportFunctions: [], dueDate: 'Q3 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-2-4', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 4', title: 'Finalization of market positioning of .nm variants (Basic, HD & Portable) to be completed by Q2', owner: 'Product Management', supportFunctions: [], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-2-5', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 5', title: 'Increase system utilization of installation base by 50%', owner: 'Product Management', supportFunctions: [], dueDate: 'Q4 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-2-6', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 6', title: 'Obtain testimonial for each installation in international market', owner: 'Product Management', supportFunctions: [], dueDate: 'Ongoing', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 4
      { id: 'pm-4-1', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 1', title: 'Conduct ≥15 surgeon interviews to validate roadmap decisions for V2 of .NM, V2 of L.NM and X.NM by Q1', owner: 'Product Management', supportFunctions: [], dueDate: 'Q1 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-4-2', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 2', title: 'Finalize PRD for V2 of .NM & L.NM and X.NM with stakeholder alignment by Q1', owner: 'Product Management', supportFunctions: [], dueDate: 'Q1 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-4-3', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 3', title: 'Launch L.NM V2 phased release (minimum 2 feature drops) by Mar 2027', owner: 'Product Management', supportFunctions: [], dueDate: 'Mar 2027', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-4-4', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 4', title: 'Deliver X.NM prototype validation (clinical + technical) by Q3', owner: 'Product Management', supportFunctions: [], dueDate: 'Q3 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pm-4-5', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 5', title: 'In-field clinical validation of X.NM to be completed by Jan 2027', owner: 'Product Management', supportFunctions: [], dueDate: 'Jan 2027', weightage: '-', progress: null, status: 'pending', risks: [] },
    ],
  },
  {
    id: 'sales-mkg',
    name: 'Sales & MKG',
    fullName: 'Sales, Marketing & CAS',
    colorClass: 'text-sky-700',
    badgeClass: 'bg-sky-100 text-sky-700 border-sky-200',
    kras: [
      // Obj 1
      { id: 'sm-1-1', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 1', title: '100% trained and certified for L.nm WL (Clinical + demo execution) by May 2026', owner: 'Ashwin', supportFunctions: ['RND', 'Product Management', 'Marketing'], dueDate: 'May 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-1-2', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 2', title: 'Achieve average demo satisfaction score ≥ 8', owner: 'CAS Team', supportFunctions: ['RND', 'Product Management', 'Marketing'], dueDate: 'Ongoing', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-1-3', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 3', title: 'Post installation clinical support for at least 5 cases for initial 25 installations', owner: 'CAS Team', supportFunctions: ['RND', 'Product Management', 'Marketing'], dueDate: 'Ongoing', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-1-4', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 4', title: 'Generate 2.5x qualified pipeline ready in each quarter to cover the next quarter', owner: 'RSMs', supportFunctions: ['Marketing'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-1-5', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 5', title: 'Onboard XX qualified distributors across India and 2 distributors in international market', owner: 'Aditya & Amit', supportFunctions: ['Management'], dueDate: 'Q1–Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-1-6', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 6', title: 'Achieve the revenue target for L.nm (WL + NIR) sales', owner: 'Arindam', supportFunctions: ['Sales', 'Marketing', 'CAS', 'Product Management'], dueDate: 'Q4 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-1-7', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 7', title: 'Achieve 33% demo-to-sale conversion', owner: 'RSMs', supportFunctions: ['CAS', 'Product Management', 'Marketing'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-1-8', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 8', title: 'Total marketing qualified leads per quarter shall be XX% of total lead pipeline (events, conferences, digital, websites, testimonials)', owner: 'Dimple', supportFunctions: ['Sales'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-1-9', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 9', title: 'Achieve XX% of revenue target from distribution channel (India + International)', owner: 'Aditya & Amit', supportFunctions: [], dueDate: 'Q4 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-1-10', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 10', title: '100% trained and certified for L.nm NIR (Clinical + demo execution) by Aug 2026', owner: 'Ashwin', supportFunctions: ['RND', 'Product Management', 'Marketing'], dueDate: 'Aug 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-1-11', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 11', title: 'Achieve Customer CSAT survey score ≥ 8/10 — administered post-install + half yearly', owner: 'Dimple', supportFunctions: ['CS', 'CAS'], dueDate: 'Half-yearly', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 2
      { id: 'sm-2-1', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 1', title: '100% adherence to lead generation target defined for each region & international markets', owner: 'RSMs & Amit', supportFunctions: ['Marketing', 'CAS', 'Product Management'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-2-2', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 2', title: 'Conversion of 25 KOL leads to sales in International market', owner: 'Amit', supportFunctions: ['CAS', 'Product Management', 'RND'], dueDate: 'Q4 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-2-3', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 3', title: 'Achieve average demo satisfaction score of ≥ 8 (10-point scale)', owner: 'CAS', supportFunctions: ['RND'], dueDate: 'Ongoing', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-2-4', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 4', title: 'Total MQL per quarter shall be XX% of total lead pipeline (events, conferences, digital marketing)', owner: 'Dimple', supportFunctions: ['Sales'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-2-5', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 5', title: '20% of sales revenue shall come from existing referrals', owner: 'ASMs & RSMs', supportFunctions: ['CS'], dueDate: 'Q4 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-2-6', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 6', title: 'Achieve .nm revenue forecast accuracy (region-wise) with maximum variance ≤XX% overall', owner: 'Sales', supportFunctions: ['Product Management', 'CAS'], dueDate: 'Monthly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-2-7', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 7', title: 'Establish quarterly demand forecast process between sales and manufacturing operations', owner: 'Sales', supportFunctions: ['MFG', 'Purchase'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-2-8', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 8', title: 'Deliver 60-70% of quarter targets in the first two months of each quarter', owner: 'Arindam', supportFunctions: ['Product Management', 'CAS'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-2-9', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 9', title: 'Appoint distributors for regulatory cleared markets: Brazil (Jun), Malaysia (Jul), Europe (Jul), Philippines (Sep)', owner: 'Amit & Eduardo', supportFunctions: ['Sales', 'Marketing', 'CAS', 'Product Management'], dueDate: 'Jun–Sep 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 3
      { id: 'sm-3-1', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 1', title: 'Increase ASP of the .nm portfolio and improve gross margin contribution', owner: 'Arindam', supportFunctions: ['Finance', 'Product Management', 'Marketing'], dueDate: 'FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'sm-3-2', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 2', title: 'Increase ASP of the L.nm portfolio and improve gross margin contribution', owner: 'Arindam', supportFunctions: ['Finance', 'Product Management', 'Marketing'], dueDate: 'FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
    ],
  },
  {
    id: 'qara',
    name: 'QA/RA',
    fullName: 'Quality Assurance & Regulatory Affairs',
    colorClass: 'text-amber-700',
    badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
    kras: [
      // Obj 1
      { id: 'qa-1-1', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 1', title: 'ISO 13485:2016 Scope to be modified as per future products', owner: 'Nanda', supportFunctions: ['RND', 'Product Mgmt', 'Sales'], dueDate: 'Dec 2026', weightage: '5%', progress: null, status: 'pending', risks: ['License may not be received before Dec 2026 (timeline ~9 months)', 'Arthroscope validation report required for Power of Attorney with HSW'] },
      { id: 'qa-1-2', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 2', title: 'Obtain Import Licences within 9 months from date of final documents received', owner: 'Hariom', supportFunctions: [], dueDate: 'Per timeline', weightage: '15%', progress: null, status: 'pending', risks: ['July license will be met only if Arthroscope complete validation report is ready by May 2026'] },
      { id: 'qa-1-3', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 3', title: 'Post approval submission for L.nm additional indications (Arthroscopy) to be obtained by July 2026', owner: 'Hariom', supportFunctions: ['RND', 'MKG', 'Product Mgmt'], dueDate: 'Jul 2026', weightage: '10%', progress: null, status: 'pending', risks: ['Marketing team to perform competition research for 3 identified countries', 'Bangladesh needs CE marking – not currently possessed'] },
      { id: 'qa-1-4', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 4', title: 'Obtain product registration approval for identified 2 countries (Nepal & Bangladesh)', owner: 'Hariom', supportFunctions: ['Sales', 'Marketing'], dueDate: 'FY27', weightage: '5%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-1-5', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 5', title: 'Meeting 100% OQC yield for L.nm', owner: 'Nanda', supportFunctions: ['MFG', 'RND'], dueDate: 'Ongoing', weightage: '10%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-1-6', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 6', title: 'Obtain BIS approval for L.nm successfully by Aug 2026', owner: 'Nanda', supportFunctions: ['RND', 'Purchase', 'MFG'], dueDate: 'Aug 2026', weightage: '5%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-1-7', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 7', title: 'Establish L.nm global regulatory strategy by June 2026', owner: 'Ramya', supportFunctions: ['RND', 'MKG', 'Product Mgmt'], dueDate: 'Jun 2026', weightage: '10%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-1-8', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 8', title: 'Submit the reference country approval for L.nm (USFDA/CE) by Mar 2027', owner: 'Hariom', supportFunctions: ['RND', 'Sales', 'MKG', 'MFG', 'Product Mgmt'], dueDate: 'Mar 2027', weightage: '10%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-1-9', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 9', title: '100% Milestone stage gate (PLCM) compliance of all products', owner: 'Ramya', supportFunctions: ['All Departments'], dueDate: 'Ongoing', weightage: '15%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-1-10', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 10', title: 'Phase 1 PLM transition to be completed by Sep 2026', owner: 'Ramya', supportFunctions: ['All Departments'], dueDate: 'Sep 2026', weightage: '15%', progress: null, status: 'pending', risks: [] },
      // Obj 2
      { id: 'qa-2-1', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 1', title: 'Successful completion of ISO 13485 & CE Surveillance audit with zero major non-conformities', owner: 'Nanda', supportFunctions: ['All Departments'], dueDate: 'FY27', weightage: '30%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-2-2', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 2', title: 'Obtain product registration approval for Philippines, Malaysia, Egypt by July 2026', owner: 'Hariom & Ramya', supportFunctions: ['Sales', 'RND'], dueDate: 'Jul 2026', weightage: '30%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-2-3', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 3', title: 'Successful importing of .nm & enabling sales into Brazil', owner: 'Ramya', supportFunctions: ['Product Mgmt', 'Sales', 'MKG', 'RND'], dueDate: 'Q2 FY27', weightage: '25%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-2-4', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 4', title: 'Complete onboarding of KOL and distributor to initiate registration in Russia by July 2026', owner: 'Ramya', supportFunctions: ['Product Mgmt', 'Sales', 'MKG', 'RND'], dueDate: 'Jul 2026', weightage: '15%', progress: null, status: 'pending', risks: [] },
      // Obj 3
      { id: 'qa-3-1', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 1', title: '100% adherence to QA/RA Budget for FY26-27 (calibration, new equipment, certifications & product registrations)', owner: 'QA/RA', supportFunctions: ['Purchase', 'Sales'], dueDate: 'Quarterly', weightage: '60%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-3-2', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 2', title: 'Reduction of 10% from the quote by negotiation with authorized representatives', owner: 'RA', supportFunctions: ['Purchase'], dueDate: 'Q2 FY27', weightage: '40%', progress: null, status: 'pending', risks: [] },
      // Obj 4
      { id: 'qa-4-1', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 1', title: 'Determine the regulatory strategy for X.nm by July 2026', owner: 'Hariom', supportFunctions: ['RND', 'MKG'], dueDate: 'Jul 2026', weightage: '20%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-4-2', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 2', title: 'Obtain Test license for X.nm successfully by October 2026', owner: 'Hariom', supportFunctions: ['RND', 'MKG'], dueDate: 'Oct 2026', weightage: '20%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-4-3', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 3', title: 'Complete the submission of manufacturing license for L.nm V2 and X.nm by March 2027', owner: 'Hariom', supportFunctions: ['RND', 'Product Mgmt', 'MFG', 'Purchase', 'QA'], dueDate: 'Mar 2027', weightage: '30%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-4-4', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 4', title: 'Obtain X.NM scope to be included in ISO 13485 scope by Sep 2026', owner: 'Nanda', supportFunctions: ['QA'], dueDate: 'Sep 2026', weightage: '30%', progress: null, status: 'pending', risks: [] },
      // Obj 5
      { id: 'qa-5-1', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 1', title: 'Initiate HSW Scope with Irillic Brand Name by Dec 2026', owner: 'Hariom', supportFunctions: ['RND'], dueDate: 'Dec 2026', weightage: '40%', progress: null, status: 'pending', risks: [] },
      { id: 'qa-5-2', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 2', title: 'Due diligence support for any M&A projects from QA/RA perspective as and when needed', owner: 'QA/RA', supportFunctions: ['RND', 'M&A'], dueDate: 'On-demand', weightage: '60%', progress: null, status: 'pending', risks: [] },
    ],
  },
  {
    id: 'mfg',
    name: 'MFG',
    fullName: 'Manufacturing',
    colorClass: 'text-orange-700',
    badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
    kras: [
      // Obj 1
      { id: 'mfg-1-1', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 1', title: 'Achieve quarterly production output for L.nm per agreed Sales Forecast with zero unit-availability delay', owner: 'MFG', supportFunctions: ['Sales', 'Management'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: ['Difficulty in getting monthly/quarterly production plan', 'RND has to close ECR and handover design for pilot – already delaying in Q1', 'Design transfer to MHMS required', 'Material & Supply Chain Risks', 'Only ~50 units possible in Q1 accounting risks'] },
      { id: 'mfg-1-2', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 2', title: 'Roll out periodic upgrades on existing and new builds within ≤30 days of release approval, with no missed dispatch commitments', owner: 'MFG', supportFunctions: ['RND', 'QA/RA', 'Purchase'], dueDate: 'Ongoing', weightage: '-', progress: null, status: 'pending', risks: ['Require delivery instructions at least 1 week before order', 'OQC Capacity Constraints – limited inspectors vs dispatch volume', 'No backup OQC resources during peak demand'] },
      { id: 'mfg-1-3', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 3', title: 'Deliver defect-free products with FPY ≥ 98% and Rejection/Rework rate ≤ 5%', owner: 'MFG', supportFunctions: ['QA/RA'], dueDate: 'Ongoing', weightage: '-', progress: null, status: 'pending', risks: ['Late detection of defects due to limited test points – most issues found at OQC or after dispatch', 'MHMS defect resolution takes minimum 1 week'] },
      { id: 'mfg-1-4', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 4', title: 'Optimize cost and operational efficiency — reduce existing inventory from ₹4 cr to ≤ ₹2 cr; HLA cost by 20%', owner: 'MFG', supportFunctions: ['Purchase', 'MHMS'], dueDate: 'FY27', weightage: '-', progress: null, status: 'pending', risks: ['Inaccurate demand forecasting', 'Logistics disruptions', 'Quality rejection at IQC', 'Production delays at MHMS', 'Dispatch/logistics delays from MHMS'] },
      { id: 'mfg-1-5', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 5', title: 'Implement Engineering Changes into production on time with zero impact on Sales availability (≥1 changed unit/month)', owner: 'MFG', supportFunctions: ['RND', 'QA/RA', 'Purchase', 'MHMS'], dueDate: 'Monthly', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 2
      { id: 'mfg-2-1', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 1', title: 'Achieve quarterly production output for .nm CE and non-CE variants per Sales Forecast with zero unit-availability delay', owner: 'MFG', supportFunctions: ['Sales', 'Management'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: ['Inaccurate demand forecasting leading to over/under production', 'Frequent changes in production plan from sales', 'Delay in raw material or critical component procurement', 'First Pass Yield below target risk', 'Delay in finished goods clearance (OQC delays)'] },
      { id: 'mfg-2-2', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 2', title: 'Establish approaches for mixed domestic & international demand; transfer to MHMS; deploy custom Jigs & Fixtures for ≥10% cycle-time/cost reduction', owner: 'MFG', supportFunctions: ['QA', 'Sales', 'MHMS'], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: ['Inadequate owner/SPOC for MHMS to handle Engineering issues', 'Resources required for developing jigs'] },
      { id: 'mfg-2-3', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 3', title: 'Deliver defect-free products for .nm with FPY ≥ 98% and Rejection/Rework rate ≤ 5%', owner: 'MFG', supportFunctions: ['MHMS', 'Quality'], dueDate: 'Ongoing', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'mfg-2-4', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 4', title: 'Roll out engineering changes including design transfer + training to MHMS within agreed plan and with zero production stoppage', owner: 'MFG', supportFunctions: ['RND', 'QA/RA', 'Purchase', 'MHMS'], dueDate: 'Per ECO plan', weightage: '-', progress: null, status: 'pending', risks: ['Incomplete engineering validation before handover', 'Frequent last-minute design changes (ECOs)', 'Poor cross-functional communication (Eng ↔ Mfg ↔ Quality)', 'Inadequate pilot build/trial run validation', 'Lack of operator training on new processes', 'Delayed release of critical documents'] },
      // Obj 3
      { id: 'mfg-3-1', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 1', title: 'Reduce existing inventory cost from ₹4 cr to ≤ ₹2 cr by FY-end (shared with Purchase)', owner: 'Chandhan', supportFunctions: ['Purchase', 'Finance'], dueDate: 'FY27', weightage: '-', progress: null, status: 'pending', risks: ['Demand projection should be received appropriately'] },
      { id: 'mfg-3-2', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 2', title: 'Enable demand-aligned procurement — publish rolling 3-month build plan monthly with ≥95% accuracy', owner: 'Chandhan', supportFunctions: ['Purchase', 'Sales', 'Finance', 'RND'], dueDate: 'Monthly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'mfg-3-3', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 3', title: 'Reduction of manufacturing cost by 10% for .nm and L.nm by Q2', owner: 'Chandhan', supportFunctions: ['Purchase', 'RND'], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 4
      { id: 'mfg-4-1', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 1', title: 'Provide DFM input on 100% of NPD releases such that each new product is production-ready at design transfer with zero rework cycles', owner: 'Chandhan', supportFunctions: ['RND', 'QA', 'MHMS'], dueDate: 'Per NPD gates', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'mfg-4-2', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 2', title: 'Achieve Process Engineering and MFG-readiness within ≤1 month of Design Release for every new product', owner: 'Lavanya', supportFunctions: ['RND', 'QA', 'Purchase'], dueDate: 'Per NPD milestones', weightage: '-', progress: null, status: 'pending', risks: ['Improper verification and continuous improvement in design after release', 'Parts availability for verification and pilot build – purchase team dependent'] },
    ],
  },
  {
    id: 'cs',
    name: 'CS',
    fullName: 'Customer Service',
    colorClass: 'text-cyan-700',
    badgeClass: 'bg-cyan-100 text-cyan-700 border-cyan-200',
    kras: [
      // Obj 1
      { id: 'cs-1-1', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 1', title: 'Reduce response time of breakdown call to 24 hr (compliance ≥ 95%)', owner: 'CS', supportFunctions: ['Sales', 'MFG'], dueDate: 'Mar 2027', weightage: '14%', progress: null, status: 'pending', risks: [] },
      { id: 'cs-1-2', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 2', title: 'Successful first-time installation rate ≥ 95% for L.nm WL & NIR across India', owner: 'CS', supportFunctions: ['CAS', 'MFG'], dueDate: 'Mar 2027', weightage: '15%', progress: null, status: 'pending', risks: [] },
      { id: 'cs-1-3', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 3', title: 'Mean Time To Repair (MTTR) for L.nm field issues ≤ 72 hr', owner: 'CS', supportFunctions: ['RND', 'Purchase'], dueDate: 'Mar 2027', weightage: '14%', progress: null, status: 'pending', risks: [] },
      { id: 'cs-1-4', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 4', title: 'Support in obtaining Customer CSAT survey score ≥ 8/10 — post-install + half-yearly', owner: 'CS', supportFunctions: ['CAS', 'Sales', 'Product Mgmt'], dueDate: 'Half-yearly', weightage: '14%', progress: null, status: 'pending', risks: [] },
      { id: 'cs-1-5', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 5', title: '100% of installation completion within 10 days of notification from sales for every PO closure', owner: 'CS', supportFunctions: ['CAS', 'Product Mgmt'], dueDate: 'Mar 2027', weightage: '17%', progress: null, status: 'pending', risks: ['Risk: PO may not always be received, particularly for distributor sales'] },
      { id: 'cs-1-6', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 6', title: 'Spares availability ≥ 95% for L.nm critical SKUs at all times', owner: 'Laxmiputra & Hareesh', supportFunctions: ['Purchase', 'MFG'], dueDate: 'Sep 2026', weightage: '12%', progress: null, status: 'pending', risks: ['Risk: To store SKUs need to allocate dedicated rack/place'] },
      { id: 'cs-1-7', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 7', title: '100% Service team of L.nm to be trained and certified on product, servicing and maintenance by June 2026', owner: 'Laxmiputra', supportFunctions: ['RND', 'MFG', 'CAS'], dueDate: 'Jun 2026', weightage: '14%', progress: null, status: 'pending', risks: [] },
      // Obj 2
      { id: 'cs-2-1', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 1', title: 'Increase install-base utilization by 50% — jointly tracked with Product Mgmt', owner: 'CS', supportFunctions: ['Product Mgmt', 'Sales', 'CAS'], dueDate: 'Mar 2027', weightage: '25%', progress: null, status: 'pending', risks: [] },
      { id: 'cs-2-2', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 2', title: 'International service playbook — establish remote support & spares logistics for 2 international markets by Q2', owner: 'Laxmiputra & Hareesh', supportFunctions: ['Sales', 'Purchase'], dueDate: 'Sep 2026', weightage: '20%', progress: null, status: 'pending', risks: ['Risk: No clear roadmap for international servicing – need guidance from Amit Sharma'] },
      { id: 'cs-2-3', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 3', title: 'Achieve 99% efficiency on Preventive Maintenance schedule FY26-27', owner: 'CS', supportFunctions: [], dueDate: 'Mar 2027', weightage: '30%', progress: null, status: 'pending', risks: ['Risk: Increasing travel cost – PM will now be planned during installation, making 99% monthly target difficult'] },
      { id: 'cs-2-4', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 4', title: 'Transition Service operations/workflow management to Odoo by Q2', owner: 'Laxmiputra', supportFunctions: ['Finance', 'R&D', 'MFG', 'IT', 'Purchase'], dueDate: 'Sep 2026', weightage: '25%', progress: null, status: 'pending', risks: ['Roadblock: System inward process for repair – MHMS systems cannot be inward-processed easily in current system'] },
      // Obj 3
      { id: 'cs-3-1', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 1', title: 'Spare parts price to be revised for L.nm by Q1', owner: 'Laxmiputra & Hareesh', supportFunctions: ['Sales', 'Finance'], dueDate: 'Jun 2026', weightage: '20%', progress: null, status: 'pending', risks: [] },
      { id: 'cs-3-2', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 2', title: 'Spare parts price to be revised for .nm by Q1', owner: 'Laxmiputra & Hareesh', supportFunctions: ['Sales', 'Finance'], dueDate: 'Jun 2026', weightage: '20%', progress: null, status: 'pending', risks: [] },
      { id: 'cs-3-3', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 3', title: '90% conversion of customers from "out of warranty" to CMC/AMC by Q4', owner: 'Hareesh', supportFunctions: ['Finance'], dueDate: 'Mar 2027', weightage: '20%', progress: null, status: 'pending', risks: [] },
      { id: 'cs-3-4', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 4', title: '100% retention of existing AMC/CMC by Q4', owner: 'CS', supportFunctions: ['Finance'], dueDate: 'Mar 2027', weightage: '20%', progress: null, status: 'pending', risks: [] },
      { id: 'cs-3-5', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 5', title: 'Successful collection of outstanding service payments within 60 days', owner: 'CS', supportFunctions: ['Finance'], dueDate: 'Mar 2027', weightage: '20%', progress: null, status: 'pending', risks: [] },
      // Obj 4
      { id: 'cs-4-1', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 1', title: '100% participation of CS in Design Reviews (M0–M2 gates) for all NPD projects — formal DFS inputs documented and signed off before Design Transfer', owner: 'CS', supportFunctions: ['RND', 'Product Management', 'QA/RA'], dueDate: 'Mar 2027', weightage: '100%', progress: null, status: 'pending', risks: [] },
    ],
  },
  {
    id: 'purchase',
    name: 'Purchase',
    fullName: 'Purchase & Supply Chain',
    colorClass: 'text-rose-700',
    badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
    kras: [
      // Obj 1
      { id: 'pur-1-1', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 1', title: 'Continuity of Supply & Risk Management — De-risk supply chain from PCB/Consumer product shortage for single source suppliers by Q2', owner: 'Harish', supportFunctions: ['RND', 'Purchase'], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-1-2', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 2', title: 'Incoming part rejection rate ≤ 5% every quarter (measured at IQC across all critical vendors)', owner: 'Harish', supportFunctions: ['RND'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-1-3', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 3', title: 'Identify parts with no alternates — ≥2 alternates on L.nm L2 critical parts and procure in-hand stock per sales projection quarterly', owner: 'Harish', supportFunctions: [], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-1-4', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 4', title: 'OTD ≥ 90% from vendors to be ensured across all critical L.nm components', owner: 'Harish', supportFunctions: ['Purchase', 'RND'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-1-5', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 5', title: 'Procurement of high lead parts (>12 weeks) to be maintained as per sales/production plan every quarter', owner: 'Harish', supportFunctions: ['MFG', 'Sales'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 2
      { id: 'pur-2-1', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 1', title: 'MHMS performance management — OTD ≥90%; ≥10% reduction in MHMS quoted conversion cost vs FY25-26 baseline', owner: 'Harish', supportFunctions: ['MHMS', 'Finance', 'MFG'], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-2-2', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 2', title: 'Inhouse manufacturing to be enabled at MHMS for possible parts by Q3', owner: 'Harish', supportFunctions: ['MHMS', 'MFG', 'RND'], dueDate: 'Q3 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-2-3', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 3', title: 'Component & material readiness for .nm — keep at minimum stock level aligned with production plan quarterly', owner: 'Purchase', supportFunctions: ['MFG', 'MHMS', 'Sales'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-2-4', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 4', title: 'Identify parts with no alternates — ≥1 alternate on .nm L2 critical parts and procure in-hand stock quarterly', owner: 'Harish', supportFunctions: ['RND', 'Finance'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 3
      { id: 'pur-3-1', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 1', title: 'Cost Optimization: 5% of Current BOM price for L.nm & 5% for .nm by July 2026', owner: 'Harish', supportFunctions: ['RND', 'MFG'], dueDate: 'Jul 2026', weightage: '-', progress: null, status: 'pending', risks: ['Constraint: Confirmed build plan for each quarter required in advance'] },
      { id: 'pur-3-2', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 2', title: 'Competitive pricing from different suppliers for custom parts & HLA for both L.nm & .nm by July 2026', owner: 'Harish', supportFunctions: ['RND', 'MFG'], dueDate: 'Jul 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-3-3', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 3', title: 'Right-size inventory — cut E&O inventory by ≥30%; maintain zero stock-outs on L1/L2 parts by Q2 (tied to rolling 3-month plan)', owner: 'Harish', supportFunctions: ['MFG', 'Sales', 'Finance'], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-3-4', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 4', title: 'Reduce existing inventory cost from ₹4 cr to ≤ ₹2 cr by FY-end (shared with MFG)', owner: 'Harish', supportFunctions: ['MFG', 'Finance'], dueDate: 'FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 4
      { id: 'pur-4-1', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 1', title: 'L.nm V2 component sourcing readiness — long-lead items identified & qualified per RND milestone calendar (zero hold on M1/M2 phase gates)', owner: 'Harish', supportFunctions: ['RND', 'MFG'], dueDate: 'Per milestones', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-4-2', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 2', title: '.nm V2 component sourcing readiness — long-lead items identified & qualified per RND milestone calendar', owner: 'Harish', supportFunctions: ['RND', 'MFG'], dueDate: 'Per milestones', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-4-3', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 3', title: 'X.nm component sourcing readiness — long-lead items identified & qualified per RND milestone calendar', owner: 'Harish', supportFunctions: [], dueDate: 'Per milestones', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-4-4', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 4', title: 'Drive and establish localization and alternate sourcing for imported parts (eg. Light guide & coupler) by Q2', owner: 'Harish', supportFunctions: ['RND', 'QA/RA'], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-4-5', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 5', title: 'Identify and secure endoscope (10mm) alternates by Q3', owner: 'Harish', supportFunctions: ['RND', 'MFG', 'Product Mgmt', 'QA/RA'], dueDate: 'Q3 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      // Obj 5
      { id: 'pur-5-1', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 1', title: 'Vendor base expansion for new ICG kit', owner: 'Harish', supportFunctions: ['RND', 'MFG', 'Product Mgmt', 'QA/RA'], dueDate: 'Nov 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-5-2', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 2', title: 'Vendor base expansion for camera holder arms', owner: 'Harish', supportFunctions: ['RND', 'MFG', 'Product Mgmt', 'QA/RA'], dueDate: 'Dec 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-5-3', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 3', title: 'Vendor base expansion for custom light guides', owner: 'Harish', supportFunctions: ['RND', 'MFG', 'Product Mgmt', 'QA/RA'], dueDate: 'Mar 2027', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'pur-5-4', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 4', title: 'Vendor base expansion for 2D/3D scopes', owner: 'Harish', supportFunctions: ['RND', 'MFG', 'Product Mgmt', 'QA/RA'], dueDate: 'Dec 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
    ],
  },
  {
    id: 'hr',
    name: 'HR',
    fullName: 'Human Resources',
    colorClass: 'text-pink-700',
    badgeClass: 'bg-pink-100 text-pink-700 border-pink-200',
    kras: [
      { id: 'hr-1-1', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 1', title: 'Build Talent Pipeline (R&D + Clinical + Sales + Service) — close 90% of critical positions within 120 days with offer-to-join ratio ≥ 80%; sourcing-to-offer TAT 6 weeks (Q1–Q2)', owner: 'HR', supportFunctions: ['All Departments', 'Finance'], dueDate: 'Q1–Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'hr-1-2', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 2', title: 'Capability Building & Certification — 100% of relevant employees certified through structured product/clinical/positioning training within 6 months of onboarding', owner: 'HR', supportFunctions: ['All Departments'], dueDate: 'Jan 2027', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'hr-1-3', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 3', title: 'Retention of Critical Talent — attrition ≤ 10% in critical roles (top 20% talent), tracked quarterly', owner: 'HR', supportFunctions: ['All Functional Heads'], dueDate: 'Quarterly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'hr-2-1', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 4', title: 'Sales Capability Enhancement — 100% domestic sales team trained with 20% productivity improvement within 2 quarters', owner: 'HR', supportFunctions: ['Sales & Marketing', 'Clinical Team'], dueDate: 'Q2 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'hr-2-2', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 5', title: 'Performance Management Alignment — 100% sales KPIs aligned to revenue targets with monthly performance reviews via quarterly review process, implemented within Q1', owner: 'HR', supportFunctions: ['Sales', 'Finance'], dueDate: 'Q1 FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'hr-2-3', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 6', title: 'Global Talent & Leadership Readiness — hire key global roles and achieve readiness index ≥ 80% within FY', owner: 'HR', supportFunctions: ['Sales', 'Service', 'Finance'], dueDate: 'FY27', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'hr-3-1', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 7', title: 'Manpower Cost Optimization — maintain manpower cost within budget; improve revenue per employee by 15%, reviewed half-yearly', owner: 'HR', supportFunctions: ['Finance', 'All Departments'], dueDate: 'Half-yearly', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'hr-4-1', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 8', title: 'R&D Talent Strengthening — fill 100% critical R&D roles within 120 days at 4-week offer-release TAT', owner: 'HR', supportFunctions: ['R&D'], dueDate: 'Sep 2026', weightage: '-', progress: null, status: 'pending', risks: [] },
      { id: 'hr-5-1', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 9', title: 'Strategic Workforce Planning — maintain a 3-year manpower plan with 90% accuracy vs actuals, refreshed annually', owner: 'HR', supportFunctions: ['Finance', 'Strategy Team'], dueDate: 'Annual', weightage: '-', progress: null, status: 'pending', risks: [] },
    ],
  },
  {
    id: 'finance',
    name: 'Finance',
    fullName: 'Finance',
    colorClass: 'text-indigo-700',
    badgeClass: 'bg-indigo-100 text-indigo-700 border-indigo-200',
    kras: [
      // Obj 1
      { id: 'fin-1-1', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 1', title: 'Monthly P&L close within 7 working days of month-end with budget vs. actual variance analysis', owner: 'Finance', supportFunctions: ['Sales', 'CS'], dueDate: 'Monthly (Day 7)', weightage: '6.5%', progress: null, status: 'pending', risks: [] },
      { id: 'fin-1-2', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 2', title: 'Co-own forecast accuracy with Sales — monthly forecast vs. actual variance ≤ 10%', owner: 'Finance', supportFunctions: ['Sales', 'MFG'], dueDate: 'Monthly (Day 7)', weightage: '6.5%', progress: null, status: 'pending', risks: [] },
      { id: 'fin-1-3', objectiveRef: 'obj-1', objectiveNumber: 1, code: 'KRA 3', title: 'Day Sales Outstanding (DSO) target of 60 days for receivables, L.nm receivables (linear sales discipline)', owner: 'Finance', supportFunctions: ['Sales', 'CS'], dueDate: 'Ongoing', weightage: '9.7%', progress: null, status: 'pending', risks: [] },
      // Obj 2
      { id: 'fin-2-1', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 1', title: 'Achieve 90% quarterly working-capital ratio target of ≥1.5; present weekly cashflow visibility report', owner: 'Finance', supportFunctions: [], dueDate: 'Weekly/Quarterly', weightage: '3.2%', progress: null, status: 'pending', risks: [] },
      { id: 'fin-2-2', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 2', title: 'Protect international .nm revenue from currency and collection risk — FX hedging policy for export sales by Q2; 100% timely repatriation; export DSO ≤ 90 days', owner: 'Finance', supportFunctions: ['Sales', 'QA/RA'], dueDate: 'Q2 FY27', weightage: '9.7%', progress: null, status: 'pending', risks: [] },
      { id: 'fin-2-3', objectiveRef: 'obj-2', objectiveNumber: 2, code: 'KRA 3', title: '100% of market-entry investments (registration, KOL, demo units, distributor onboarding) IRR-approved by Finance before disbursement; quarterly review of actual returns vs. business case', owner: 'Finance', supportFunctions: ['Sales', 'Product Mgmt'], dueDate: 'Per investment', weightage: '3.2%', progress: null, status: 'pending', risks: [] },
      // Obj 3
      { id: 'fin-3-1', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 1', title: 'Track monthly EBITDA against plan; trigger corrective action if variance > 20% for 2 consecutive months', owner: 'Finance', supportFunctions: ['All Departments'], dueDate: 'Monthly', weightage: '6.5%', progress: null, status: 'pending', risks: [] },
      { id: 'fin-3-2', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 2', title: 'Inventory carrying cost — jointly with MFG drive ₹4 cr → ₹2 cr; report monthly', owner: 'Finance', supportFunctions: ['MFG', 'Purchase'], dueDate: 'Monthly', weightage: '9.7%', progress: null, status: 'pending', risks: [] },
      { id: 'fin-3-3', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 3', title: 'Cost-out tracker — consolidate Purchase (5% BOM) + MFG (20% HLA) + RND (design cost-out) savings into single P&L view', owner: 'Finance', supportFunctions: ['Purchase', 'MFG', 'RND'], dueDate: 'Monthly', weightage: '9.7%', progress: null, status: 'pending', risks: [] },
      { id: 'fin-3-4', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 4', title: 'Gross margin reporting by product (.nm Base, .nm HD, L.nm WL, L.nm NIR) — monthly from June 2026', owner: 'Finance', supportFunctions: ['Sales', 'MFG'], dueDate: 'Jun 2026+', weightage: '3.2%', progress: null, status: 'pending', risks: [] },
      { id: 'fin-3-5', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 5', title: 'Cash flow controls: receivables ageing weekly (>90 day bucket ≤15% of AR by Q4); payables DPO 45-60 days; inventory linearity ≥90%; consolidated cash flow report weekly', owner: 'Finance', supportFunctions: ['All Departments'], dueDate: 'Weekly/Q4', weightage: '9.7%', progress: null, status: 'pending', risks: [] },
      { id: 'fin-3-6', objectiveRef: 'obj-3', objectiveNumber: 3, code: 'KRA 6', title: 'Govern budgets — 100% adherence within ±5% per cost centre every quarter', owner: 'Finance', supportFunctions: ['All Departments'], dueDate: 'Quarterly', weightage: '9.7%', progress: null, status: 'pending', risks: [] },
      // Obj 4
      { id: 'fin-4-1', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 1', title: 'Project-level cost tracking for X.NM, V2 .NM, V2 L.NM — actual vs. plan reported quarterly', owner: 'Finance', supportFunctions: ['RND', 'Product Mgmt'], dueDate: 'Quarterly', weightage: '3.2%', progress: null, status: 'pending', risks: [] },
      { id: 'fin-4-2', objectiveRef: 'obj-4', objectiveNumber: 4, code: 'KRA 2', title: 'Capex governance for NPD: 100% pre-sanction adherence; ≤5% variance vs approved capex; 100% exceptions via business case + leadership approval; monthly capex utilization report', owner: 'Finance', supportFunctions: ['RND', 'MFG', 'Purchase'], dueDate: 'Monthly/Quarterly', weightage: '6.5%', progress: null, status: 'pending', risks: [] },
      // Obj 5
      { id: 'fin-5-1', objectiveRef: 'obj-5', objectiveNumber: 5, code: 'KRA 1', title: 'M&A / Inorganic Due Diligence — provide finance-led due diligence within 30 working days of opportunity sign-off, for 100% of opportunities cleared for evaluation', owner: 'Finance', supportFunctions: ['Management', 'QA/RA', 'Strategy', 'Legal'], dueDate: 'Per opportunity', weightage: '3.2%', progress: null, status: 'pending', risks: [] },
    ],
  },
];

// ─── Milestones Timeline ─────────────────────────────────────────────────────

export const milestones: Milestone[] = [
  // May 2026 (Q1)
  { id: 'ms-1', title: 'L.nm WL Product Release to Production (General & Gastro)', department: 'R&D', dateLabel: 'May 2026', sortKey: '2026-05', quarter: 'Q1', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-2', title: 'BIS Design Readiness for L.nm', department: 'R&D', dateLabel: 'May 2026', sortKey: '2026-05', quarter: 'Q1', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-3', title: 'PDF Reporting Rollout', department: 'R&D', dateLabel: 'May 2026', sortKey: '2026-05', quarter: 'Q1', objectiveRef: 'obj-2', color: 'teal' },
  { id: 'ms-4', title: '100% Sales/CAS Team Certified on L.nm WL', department: 'Sales & MKG', dateLabel: 'May 2026', sortKey: '2026-05', quarter: 'Q1', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-5', title: 'Gross Margin Reporting by Product Line Starts', department: 'Finance', dateLabel: 'Jun 2026', sortKey: '2026-06', quarter: 'Q1', objectiveRef: 'obj-3', color: 'emerald' },
  { id: 'ms-6', title: 'L.nm Arthroscopy Release to Production', department: 'R&D', dateLabel: 'Jun 2026', sortKey: '2026-06', quarter: 'Q1', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-7', title: 'L.nm Global Regulatory Strategy Established', department: 'QA/RA', dateLabel: 'Jun 2026', sortKey: '2026-06', quarter: 'Q1', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-8', title: 'L.nm Service Team Trained & Certified', department: 'CS', dateLabel: 'Jun 2026', sortKey: '2026-06', quarter: 'Q1', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-9', title: 'Brazil Distributor Appointment for .nm', department: 'Sales & MKG', dateLabel: 'Jun 2026', sortKey: '2026-06', quarter: 'Q1', objectiveRef: 'obj-2', color: 'teal' },
  // Q2
  { id: 'ms-10', title: 'NIR Configuration (5mm & 10mm) Release to Production', department: 'R&D', dateLabel: 'Jul 2026', sortKey: '2026-07', quarter: 'Q2', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-11', title: 'L.nm Arthroscopy Post-Approval Submission', department: 'QA/RA', dateLabel: 'Jul 2026', sortKey: '2026-07', quarter: 'Q2', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-12', title: 'Product Registration: Philippines, Malaysia, Egypt', department: 'QA/RA', dateLabel: 'Jul 2026', sortKey: '2026-07', quarter: 'Q2', objectiveRef: 'obj-2', color: 'teal' },
  { id: 'ms-13', title: 'BOM Cost Reduction 5% (.nm & L.nm) — Purchase', department: 'Purchase', dateLabel: 'Jul 2026', sortKey: '2026-07', quarter: 'Q2', objectiveRef: 'obj-3', color: 'emerald' },
  { id: 'ms-14', title: 'X.nm Regulatory Strategy Determined', department: 'QA/RA', dateLabel: 'Jul 2026', sortKey: '2026-07', quarter: 'Q2', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-15', title: 'Malaysia & Europe Distributor Appointment', department: 'Sales & MKG', dateLabel: 'Jul 2026', sortKey: '2026-07', quarter: 'Q2', objectiveRef: 'obj-2', color: 'teal' },
  { id: 'ms-16', title: 'L.nm Gynecology Release to Production', department: 'R&D', dateLabel: 'Aug 2026', sortKey: '2026-08', quarter: 'Q2', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-17', title: 'BIS Approval for L.nm', department: 'QA/RA', dateLabel: 'Aug 2026', sortKey: '2026-08', quarter: 'Q2', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-18', title: '100% Sales/CAS Team Certified on L.nm NIR', department: 'Sales & MKG', dateLabel: 'Aug 2026', sortKey: '2026-08', quarter: 'Q2', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-19', title: 'L.nm V2 M0 Concept & Feasibility', department: 'R&D', dateLabel: 'Sep 2026', sortKey: '2026-09', quarter: 'Q2', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-20', title: 'International Service Playbook (2 Markets)', department: 'CS', dateLabel: 'Sep 2026', sortKey: '2026-09', quarter: 'Q2', objectiveRef: 'obj-2', color: 'teal' },
  { id: 'ms-21', title: 'Phase 1 PLM Transition Complete', department: 'QA/RA', dateLabel: 'Sep 2026', sortKey: '2026-09', quarter: 'Q2', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-22', title: 'Philippines Distributor Appointment for .nm', department: 'Sales & MKG', dateLabel: 'Sep 2026', sortKey: '2026-09', quarter: 'Q2', objectiveRef: 'obj-2', color: 'teal' },
  { id: 'ms-23', title: 'R&D Talent Critical Roles Filled (100%)', department: 'HR', dateLabel: 'Sep 2026', sortKey: '2026-09', quarter: 'Q2', objectiveRef: 'obj-4', color: 'violet' },
  // Q3
  { id: 'ms-24', title: 'X.nm Test License Obtained', department: 'QA/RA', dateLabel: 'Oct 2026', sortKey: '2026-10', quarter: 'Q3', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-25', title: 'BOM Cost L.nm V2 Reduction 20%', department: 'R&D', dateLabel: 'Oct 2026', sortKey: '2026-10', quarter: 'Q3', objectiveRef: 'obj-3', color: 'emerald' },
  { id: 'ms-26', title: 'L.nm V2 M1 Phase 2 Development Start', department: 'R&D', dateLabel: 'Oct 2026', sortKey: '2026-10', quarter: 'Q3', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-27', title: 'ICG Kit Concept Development Complete', department: 'R&D', dateLabel: 'Nov 2026', sortKey: '2026-11', quarter: 'Q3', objectiveRef: 'obj-5', color: 'orange' },
  { id: 'ms-28', title: 'L.nm V2 M1 Phase 3 Design V&V Start', department: 'R&D', dateLabel: 'Nov 2026', sortKey: '2026-11', quarter: 'Q3', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-29', title: '2D & 3D Scopes Development Prototype', department: 'R&D', dateLabel: 'Dec 2026', sortKey: '2026-12', quarter: 'Q3', objectiveRef: 'obj-5', color: 'orange' },
  { id: 'ms-30', title: 'Camera Holder Arm Feasibility Complete', department: 'R&D', dateLabel: 'Dec 2026', sortKey: '2026-12', quarter: 'Q3', objectiveRef: 'obj-5', color: 'orange' },
  { id: 'ms-31', title: 'HSW Scope under Irillic Brand Initiated', department: 'QA/RA', dateLabel: 'Dec 2026', sortKey: '2026-12', quarter: 'Q3', objectiveRef: 'obj-5', color: 'orange' },
  { id: 'ms-32', title: 'L.nm V2 M2 Phase 1 Design Transfer Prep', department: 'R&D', dateLabel: 'Dec 2026', sortKey: '2026-12', quarter: 'Q3', objectiveRef: 'obj-4', color: 'violet' },
  // Q4
  { id: 'ms-33', title: 'L.nm V2 M2 Phase 2 Design Transfer', department: 'R&D', dateLabel: 'Jan 2027', sortKey: '2027-01', quarter: 'Q4', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-34', title: 'X.nm Clinical Validation In-Field', department: 'Product Mgmt', dateLabel: 'Jan 2027', sortKey: '2027-01', quarter: 'Q4', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-35', title: 'L.nm V2 M2 Phase 3 Domestic Regulatory Approval', department: 'R&D', dateLabel: 'Feb 2027', sortKey: '2027-02', quarter: 'Q4', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-36', title: '.nm V2 M1 Phase 3 Design V&V', department: 'R&D', dateLabel: 'Feb 2027', sortKey: '2027-02', quarter: 'Q4', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-37', title: 'L.nm V2 M3 Manufacturing Readiness', department: 'R&D', dateLabel: 'Mar 2027', sortKey: '2027-03', quarter: 'Q4', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-38', title: 'Manufacturing License Submission for L.nm V2 & X.nm', department: 'QA/RA', dateLabel: 'Mar 2027', sortKey: '2027-03', quarter: 'Q4', objectiveRef: 'obj-4', color: 'violet' },
  { id: 'ms-39', title: 'L.nm International Sales Target: 12 Units', department: 'Sales & MKG', dateLabel: 'Q4 FY27', sortKey: '2027-03', quarter: 'Q4', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-40', title: '.nm Sales Target: 133 Domestic + 22 International', department: 'Sales & MKG', dateLabel: 'Q4 FY27', sortKey: '2027-03', quarter: 'Q4', objectiveRef: 'obj-2', color: 'teal' },
  { id: 'ms-41', title: 'USFDA/CE Reference Country Approval Submission for L.nm', department: 'QA/RA', dateLabel: 'Mar 2027', sortKey: '2027-03', quarter: 'Q4', objectiveRef: 'obj-1', color: 'blue' },
  { id: 'ms-42', title: 'Inventory Reduction: ₹4 cr → ≤ ₹2 cr Target', department: 'MFG / Purchase', dateLabel: 'FY27 Close', sortKey: '2027-03', quarter: 'Q4', objectiveRef: 'obj-3', color: 'emerald' },
];

// ─── Summary Stats ────────────────────────────────────────────────────────────

export function getTotalKRACount(): number {
  return departments.reduce((sum, d) => sum + d.kras.length, 0);
}

export function getKRAsByObjective(objectiveId: string): { dept: Department; kras: KRA[] }[] {
  return departments
    .map(d => ({ dept: d, kras: d.kras.filter(k => k.objectiveRef === objectiveId) }))
    .filter(x => x.kras.length > 0);
}

export function getAllRisks(): { risk: string; department: string; kraTitle: string; objectiveNumber: number }[] {
  const risks: { risk: string; department: string; kraTitle: string; objectiveNumber: number }[] = [];
  for (const dept of departments) {
    for (const kra of dept.kras) {
      for (const risk of kra.risks) {
        risks.push({ risk, department: dept.name, kraTitle: kra.title, objectiveNumber: kra.objectiveNumber });
      }
    }
  }
  return risks;
}

export const objectiveColorMap: Record<ObjColor, { bg: string; text: string; border: string; badge: string; dot: string }> = {
  blue:    { bg: 'bg-blue-50',    text: 'text-blue-700',    border: 'border-blue-200',   badge: 'bg-blue-100 text-blue-700',   dot: 'bg-blue-500' },
  teal:    { bg: 'bg-teal-50',    text: 'text-teal-700',    border: 'border-teal-200',   badge: 'bg-teal-100 text-teal-700',   dot: 'bg-teal-500' },
  emerald: { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200',badge: 'bg-emerald-100 text-emerald-700', dot: 'bg-emerald-500' },
  violet:  { bg: 'bg-violet-50',  text: 'text-violet-700',  border: 'border-violet-200', badge: 'bg-violet-100 text-violet-700',  dot: 'bg-violet-500' },
  orange:  { bg: 'bg-orange-50',  text: 'text-orange-700',  border: 'border-orange-200', badge: 'bg-orange-100 text-orange-700',  dot: 'bg-orange-500' },
};
