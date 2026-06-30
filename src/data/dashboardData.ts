// ════════════════════════════════════════════════════════════════
// IRILLIC — OKR PROGRAM DASHBOARD DATA · FY 2026-27
// Source: Master_OKR_Sheet_202627.xlsx (org + 9 department sheets)
// Curated Q1 (Apr–Jun 2026) status as of 29 Jun 2026.
// To re-baseline after a review: paste the meeting report to Claude Code
// and say "save to baseline".
// ════════════════════════════════════════════════════════════════

export type RAG = 'completed' | 'on-track' | 'at-risk' | 'off-track' | 'pending';
export type DepStatus = 'completed' | 'in-progress' | 'at-risk' | 'blocked' | 'not-started';
export type Severity = 'critical' | 'high' | 'medium' | 'low';

export const programMeta = {
  org: 'Irillic Pvt. Ltd.',
  programLead: 'Ramya Krishnadas',
  title: 'OKR Program Dashboard',
  fy: 'FY 2026-27',
  asOf: '29 Jun 2026',
  asOfShort: 'Jun 28',
  quarter: 'Q1',
  quarterRange: 'Apr–Jun 2026',
  fyProgressPct: 25, // 25% of FY elapsed at end of Q1
  // Avg program progress = simple average of the 9 function progresses.
  // Each function = avg of its KRAs; each KRA = avg of its milestone tasks.
  healthScore: 9,   // out of 100 — computed, not estimated
};

// ─── Status roll-up — REAL department-KRA RAG flags from the sheet ──
// 160 departmental KRAs across 9 functions. Green = 100% complete.
// (Sheet's RAG column has no separate "On Track" tier, so onTrack = 0.)
export const statusRollup = {
  completed: 5,   // Green (100% done)
  onTrack: 0,     // sheet RAG has no on-track tier
  atRisk: 9,      // Amber
  offTrack: 31,   // Red
  pending: 115,   // Pending (incl. blank RAG)
  total: 160,
};

export const headlineStats = {
  totalKRs: 160,        // department-level KRAs actually tracked
  objectives: 5,
  healthyKRs: 5,        // Green / completed KRAs
  needAttention: 40,    // Amber + Red KRAs
  milestoneGaps: 2,     // functions with no milestone progress (Purchase, Finance)
};

// ─── 5 Strategic Objectives ─────────────────────────────────────
export interface Objective {
  id: string;
  num: number;
  priority: number;
  shortTitle: string;
  title: string;
  krCount: number;
  teams: string[];
  annualPct: number;
  q1Pct: number;
  q1Target: number;
  status: RAG;
  riskContext: string;
  trendDeltaVsMay: number; // +N% vs May
  color: string;           // tailwind hue base
}

export const objectives: Objective[] = [
  {
    id: 'obj1', num: 1, priority: 1,
    shortTitle: 'L.nm WL & NIR — India Base',
    title: 'Establish a successful and strong base of L.nm — WL & NIR with competition in India',
    krCount: 6,
    teams: ['Sales', 'QA/RA', 'Product Mgmt+CAS', 'RND', 'MFG'],
    annualPct: 15, q1Pct: 15, q1Target: 25,
    status: 'at-risk',
    riskContext: 'BIS approval, CAS training & WL+NIR production release — all at risk',
    trendDeltaVsMay: 8,
    color: 'red',
  },
  {
    id: 'obj2', num: 2, priority: 2,
    shortTitle: '.nm — Revenue Engine',
    title: 'Establish Irillic .nm (Base & HD) as a market-reliable revenue engine — domestic & global',
    krCount: 6,
    teams: ['Sales', 'Product Mgmt+CAS', 'QA/RA', 'MFG'],
    annualPct: 11, q1Pct: 11, q1Target: 25,
    status: 'at-risk',
    riskContext: 'Intl regulatory clearances behind Q2; distributor onboarding delayed in identified .nm markets',
    trendDeltaVsMay: 7,
    color: 'red',
  },
  {
    id: 'obj3', num: 3, priority: 3,
    shortTitle: 'P&L Cost Efficiency',
    title: 'Drive P&L cost efficiency and maximize gross margin — EBITDA positive',
    krCount: 7,
    teams: ['Finance', 'Purchase', 'MFG', 'HR'],
    annualPct: 3, q1Pct: 3, q1Target: 25,
    status: 'off-track',
    riskContext: 'Finance & Purchase not submitted; no active milestone data',
    trendDeltaVsMay: 2,
    color: 'red',
  },
  {
    id: 'obj4', num: 4, priority: 4,
    shortTitle: 'NPD Portfolio Milestones',
    title: 'Strengthen product portfolio — X.nm, V2 .nm, V2 L.nm milestone delivery',
    krCount: 7,
    teams: ['RND', 'Product Mgmt+CAS', 'QA/RA', 'MFG'],
    annualPct: 0, q1Pct: 0, q1Target: 25,
    status: 'pending',
    riskContext: 'NPD milestones start Q2+; all 22 contributing KRAs still at 0%',
    trendDeltaVsMay: 2,
    color: 'slate',
  },
  {
    id: 'obj5', num: 5, priority: 5,
    shortTitle: 'New Business — 3Y Horizon',
    title: 'Develop new business streams & identify inorganic opportunities (3-year horizon)',
    krCount: 7,
    teams: ['RND', 'QA/RA', 'Finance', 'Leadership'],
    annualPct: 7, q1Pct: 7, q1Target: 25,
    status: 'off-track',
    riskContext: 'Long-horizon; foundation work begins Q2–Q3',
    trendDeltaVsMay: 4,
    color: 'slate',
  },
];

// ─── 9 Functions / department health ────────────────────────────
export interface FunctionHealth {
  id: string;
  code: string;       // short badge
  name: string;
  leads: string;
  q1Pct: number;
  status: RAG;
  milestonesDone: number;
  milestonesTotal: number;
  submission: 'submitted' | 'partial' | 'not-submitted';
  pace: 'ahead' | 'on-pace' | 'behind';
}

// q1Pct = simple average of the function's KRAs (each KRA = avg of its milestone tasks).
// Status: pending (0% / no data) · off-track (<10%) · at-risk (10–<20%) · on-track (≥20%).
export const functions: FunctionHealth[] = [
  { id: 'rnd',  code: 'RND', name: 'R&D',                   leads: 'Machaiah / Shivangi',     q1Pct: 13.6, status: 'at-risk',   milestonesDone: 6,  milestonesTotal: 53, submission: 'submitted',     pace: 'on-pace' },
  { id: 'pm',   code: 'PM+C', name: 'Product Management + CAS', leads: 'Ashwin R. / Reshma',  q1Pct: 16.3, status: 'at-risk',   milestonesDone: 6,  milestonesTotal: 57, submission: 'submitted',     pace: 'on-pace' },
  { id: 'qara', code: 'QA',  name: 'QA / RA',               leads: 'Hariom / Nanda / Ramya',  q1Pct: 20.7, status: 'on-track',  milestonesDone: 12, milestonesTotal: 95, submission: 'submitted',     pace: 'on-pace' },
  { id: 'sales',code: 'S&M', name: 'Sales & Marketing',     leads: 'Arindam / Amit',          q1Pct: 1.1,  status: 'off-track', milestonesDone: 0,  milestonesTotal: 4,  submission: 'partial',       pace: 'behind'  },
  { id: 'mfg',  code: 'MFG', name: 'Manufacturing',         leads: 'Chandhan',                q1Pct: 1.1,  status: 'off-track', milestonesDone: 0,  milestonesTotal: 8,  submission: 'partial',       pace: 'behind'  },
  { id: 'cs',   code: 'CS',  name: 'Customer Service',      leads: 'Laxmiputra',              q1Pct: 5.0,  status: 'off-track', milestonesDone: 2,  milestonesTotal: 53, submission: 'submitted',     pace: 'behind'  },
  { id: 'pur',  code: 'PUR', name: 'Purchase',              leads: 'Harish',                  q1Pct: 0,    status: 'pending',   milestonesDone: 0,  milestonesTotal: 0,  submission: 'not-submitted', pace: 'behind'  },
  { id: 'hr',   code: 'HR',  name: 'Human Resources',       leads: 'Twinkle / Rahul / Nisha', q1Pct: 21.1, status: 'on-track',  milestonesDone: 0,  milestonesTotal: 4,  submission: 'partial',       pace: 'on-pace' },
  { id: 'fin',  code: 'FIN', name: 'Finance',               leads: 'Finance Team',            q1Pct: 0,    status: 'pending',   milestonesDone: 0,  milestonesTotal: 6,  submission: 'partial',       pace: 'behind'  },
];

// ─── Upcoming deadlines (next 45 days) ──────────────────────────
export interface Deadline {
  task: string;
  owner: string;
  due: string;
  priority: string;
  daysLeft: string;
}

export const deadlines: Deadline[] = [
  { task: 'OQC yield Q1 close — 100% target',     owner: 'Nanda (QA/RA)',            due: 'Jun 30, 2026', priority: 'P1', daysLeft: '1d left' },
  { task: 'UAT Completion — stage gate process',  owner: 'Ramya (QA/RA)',            due: 'Jun 30, 2026', priority: 'P1', daysLeft: '1d left' },
  { task: 'Geography-wise regulatory strategy',   owner: 'Ramya (QA/RA)',            due: 'Jun 30, 2026', priority: 'P1', daysLeft: '1d left' },
  { task: 'HSW Arthroscope system validation',    owner: 'Hariom & Machaiah (QA/RA)', due: 'Jun 30, 2026', priority: 'P3', daysLeft: '1d left' },
  { task: 'Stage gate process training rollout',  owner: 'Ramya (QA/RA)',            due: 'Jun 30, 2026', priority: 'P1', daysLeft: '1d left' },
];

// ─── Cross-functional dependencies ──────────────────────────────
export interface Dependency {
  id: string;
  from: string;
  to: string;
  kr: string;
  description: string;
  quarter: string;
  due: string;
  status: DepStatus;
}

export const dependencies: Dependency[] = [
  { id: 'D01', from: 'RND / Product Mgmt + CAS', to: 'MFG',      kr: 'KR 1.3', quarter: 'Q2', due: 'TBD — RND to confirm', status: 'at-risk',
    description: 'L.nm WL + NIR design release to production (ECR sign-off) required before MFG can begin Aug launch unit build — currently pending' },
  { id: 'D02', from: 'RND', to: 'QA/RA',     kr: 'KR 1.6', quarter: 'Q1', due: 'Jun 30, 2026', status: 'at-risk',
    description: 'BIS design readiness (ECR 22) must be released before QA/RA can submit BIS application for L.nm' },
  { id: 'D03', from: 'RND', to: 'MFG',       kr: 'KR 2.5', quarter: 'Q1', due: 'May 2026', status: 'completed',
    description: 'PDF reporting ECR already released — enables MHMS production transfer and cost-out program' },
  { id: 'D04', from: 'Product Mgmt + CAS', to: 'QA/RA', kr: 'KR 1.6', quarter: 'Q1', due: 'Jun 12, 2026', status: 'completed',
    description: 'Hysteroscope model confirmation required before QA/RA initiates HSW regulatory filing' },
  { id: 'D05', from: 'QA/RA', to: 'Sales',   kr: 'KR 2.3', quarter: 'Q2', due: 'Jul 31, 2026', status: 'in-progress',
    description: 'Philippines regulatory approval required before distributor deal can be formally closed' },
  { id: 'D06', from: 'Sales', to: 'Finance', kr: 'KR 3.4', quarter: 'Q1', due: 'Jun 30, 2026', status: 'blocked',
    description: 'ASP uplift targets must be finalized by Sales before Finance can begin monthly GM-by-product tracking' },
  { id: 'D07', from: 'RND', to: 'Purchase',  kr: 'KR 4.5', quarter: 'Q2', due: 'Aug 1, 2026', status: 'not-started',
    description: 'L.nm V2 concept freeze (M0 Jul 2026) required before Purchase can identify and qualify long-lead components' },
  { id: 'D08', from: 'MFG', to: 'Purchase',  kr: 'KR 2.4', quarter: 'Q1', due: 'Jun 30, 2026', status: 'blocked',
    description: 'Rolling 3-month build plan must be published before demand-aligned procurement can begin' },
  { id: 'D09', from: 'QA/RA', to: 'RND',     kr: 'KR 4.6', quarter: 'Q1', due: 'Jun 30, 2026', status: 'at-risk',
    description: 'Stage gate process training must be completed before M0/M1 gate reviews can formally begin for NPD' },
  { id: 'D10', from: 'HR', to: 'Sales/CAS',  kr: 'KR 1.5', quarter: 'Q2', due: 'Aug 2026', status: 'not-started',
    description: 'Critical field role hiring must close before CAS certification program can reach 100% for NIR launch' },
  { id: 'D11', from: 'Purchase', to: 'CS',   kr: 'KR 3.x', quarter: 'Q1', due: 'Jun 30, 2026', status: 'at-risk',
    description: 'Spare parts pricing from suppliers required before CS can revise L.nm service and AMC rate card' },
];

// ─── Leadership decisions & asks ────────────────────────────────
export interface Decision {
  id: string;
  priority: 'high' | 'medium' | 'low';
  type: string;
  text: string;
  raisedBy: string;
  neededBy: string;
}

export const decisions: Decision[] = [
  { id: 'dec1', priority: 'high', type: 'Mandate', raisedBy: 'Ramya (QA/RA)', neededBy: '30-Jun-2026',
    text: 'For this to work reliably, we need every function to report consistently and stay accountable for their numbers. Need leadership support to bring this in practice.' },
  { id: 'dec2', priority: 'high', type: 'Unblock', raisedBy: 'Saish (RND)', neededBy: '03-Jul-2026',
    text: 'ECR-RND-22 (L.nm WL) has skipped its milestone tasks (production engg, pilot production, KOL validation – final etc) due to the delay in part procurement. If this is not fixed ASAP, it may significantly affect the L.nm NIR release date.' },
];

// ─── Blockers (sourced from master sheet) ───────────────────────
export interface Blocker {
  function: string;
  obj: string;
  task: string;
  reason: string;
  owner: string;
}

export const blockers: Blocker[] = [
  { function: 'R&D', obj: 'OBJ1', task: 'Camera head IP testing milestone', owner: 'Shivangi (RND)',
    reason: 'Awaiting parts from DigiKey to complete internal camera head test for IP — creating delay in WL ECR closure' },
  { function: 'R&D', obj: 'OBJ1', task: 'NIR ECR design milestone', owner: 'Shivangi (RND)',
    reason: 'Reason not provided' },
  { function: 'QA / RA', obj: 'OBJ1', task: 'HSW Arthroscope system Validation report', owner: 'Hariom & Machaiah (QA/RA)',
    reason: '2 samples of 4mm 30° Arth handed over to engineering team on 2nd Feb 2026 and Qty-2 on 14 Apr 2026 — validation not yet completed' },
  { function: 'QA / RA', obj: 'OBJ1', task: 'Post-approval change application strategy', owner: 'Hariom (QA/RA)',
    reason: 'This KRA cannot be initiated without the ISO 13485 scope extension approval to include arthroscope.' },
  { function: 'QA / RA', obj: 'OBJ1', task: 'BIS application — gap closure task', owner: 'Nanda (QA/RA)',
    reason: 'Delay due to no response from the BIS official — beyond Irillic control.' },
  { function: 'QA / RA', obj: 'OBJ2', task: 'Philippines FDA regulatory approval', owner: 'Ramya & Hariom (QA/RA)',
    reason: 'Huge delay of more than 6 months from Philippines FDA post our submission — beyond Irillic control' },
  { function: 'QA / RA', obj: 'OBJ2', task: 'Egypt regulatory submission', owner: 'Hariom (QA/RA)',
    reason: 'FSC received on 12th June 2026 — AR is currently reviewing all documents to be submitted. Confirmation from Amit needed to proceed to payment.' },
  { function: 'QA / RA', obj: 'OBJ3', task: 'Finance team budget approval', owner: 'Hariom (QA/RA)',
    reason: 'Shared to Akram and Finance team for approval on 3rd Jun 2026 — approval still pending' },
  { function: 'QA / RA', obj: 'OBJ4', task: 'UAT Completion', owner: 'Ramya (QA/RA)',
    reason: 'Key participants are occupied with NIR D&D — need to work out an alternate arrangement to complete the validation.' },
  { function: 'Customer Service', obj: 'OBJ1', task: 'Train service team on CSAT survey execution support', owner: 'Laxmiputra (CS)',
    reason: 'No reason logged — flag to owner' },
  { function: 'Customer Service', obj: 'OBJ3', task: 'Get latest spare parts price from suppliers', owner: 'Harish (Purchase)',
    reason: 'Supplier pricing not yet received from Purchase — blocks CS L.nm service & AMC rate card revision' },
  { function: 'Human Resources', obj: 'OBJ1', task: 'Recruitment pipeline and timely hiring plan', owner: 'HR & HOD',
    reason: 'Due to absence of department-wise manpower requirement plan, difficult to maintain recruitment pipeline and ensure timely hiring' },
];

// ─── Risk registry (forward-looking) ────────────────────────────
export interface Risk {
  severity: Severity;
  category: string;
  description: string;
  owner: string;
  resolveBy: string;
  status: 'active' | 'blocked' | 'mitigated';
}

export const risks: Risk[] = [
  { severity: 'critical', category: 'Production', owner: 'Machaiah / Shivangi (RND) + Product Mgmt', resolveBy: 'Jun 30, 2026', status: 'active',
    description: 'L.nm WL + NIR design release to production (ECR sign-off) not yet complete — MFG cannot begin Aug launch unit build without this. Blocks entire production ramp.' },
  { severity: 'critical', category: 'Regulatory', owner: 'Nanda (QA/RA)', resolveBy: 'Jul 15, 2026', status: 'active',
    description: 'BIS approval for L.nm NIR camera still pending — critical path for Aug 2026 launch. No signed timeline with QA/RA yet.' },
  { severity: 'critical', category: 'Blocked', owner: 'Hariom / Nanda / Ramya (QA/RA)', resolveBy: 'Jun 30, 2026', status: 'blocked',
    description: 'Post-approval change application strategy flagged BLOCKED — no resolution path or owner assigned since escalation' },
  { severity: 'high', category: 'Training', owner: 'Reshma (Sales/CAS)', resolveBy: 'Jul 1, 2026', status: 'active',
    description: 'CAS field training on L.nm WL at 10% — mandatory certification before any field demo or commercial sale' },
  { severity: 'high', category: 'Production', owner: 'Chandhan (MFG)', resolveBy: 'Jul 31, 2026', status: 'active',
    description: 'MFG WL unit readiness at ~2% — Aug-end target at risk without immediate acceleration plan and resource review' },
  { severity: 'high', category: 'International', owner: 'Amit (Sales)', resolveBy: 'Jul 15, 2026', status: 'active',
    description: 'Malaysia distributor agreement at 10%; Q2 activation deadline (Jul 2026) at risk — business case not yet approved' },
  { severity: 'high', category: 'International', owner: 'Eduardo (Sales)', resolveBy: 'Jul 15, 2026', status: 'active',
    description: 'Brazil distributor agreement — Q2 activation at risk; business case and legal review pending' },
  { severity: 'medium', category: 'Data Gaps', owner: 'Ashwin / Arindam / Harish / Pavan', resolveBy: 'Jul 7, 2026', status: 'active',
    description: 'Product Management + CAS, Sales & Marketing, Purchase and Finance milestone sheets not submitted — blind spots in clinical data, revenue tracking, cost tracking, and P&L governance' },
  { severity: 'medium', category: 'Planning', owner: 'Harish (Purchase) + Chandhan (MFG)', resolveBy: 'Jul 1, 2026', status: 'active',
    description: 'MHMS negotiation timeline not established — 10% MFG cost reduction (Q2 target) cannot be baselined without a signed plan' },
];

// ─── Helpers ────────────────────────────────────────────────────
export const RAG_CFG: Record<RAG, { label: string; text: string; bg: string; border: string; bar: string; dot: string }> = {
  'completed': { label: 'Completed', text: 'text-emerald-700', bg: 'bg-emerald-50', border: 'border-emerald-300', bar: 'bg-emerald-500', dot: 'bg-emerald-500' },
  'on-track':  { label: 'On Track',  text: 'text-blue-700',    bg: 'bg-blue-50',    border: 'border-blue-300',    bar: 'bg-blue-500',    dot: 'bg-blue-500' },
  'at-risk':   { label: 'At Risk',   text: 'text-amber-700',   bg: 'bg-amber-50',   border: 'border-amber-300',   bar: 'bg-amber-500',   dot: 'bg-amber-500' },
  'off-track': { label: 'Off Track', text: 'text-red-700',     bg: 'bg-red-50',     border: 'border-red-300',     bar: 'bg-red-500',     dot: 'bg-red-500' },
  'pending':   { label: 'Pending',   text: 'text-slate-500',   bg: 'bg-slate-50',   border: 'border-slate-300',   bar: 'bg-slate-300',   dot: 'bg-slate-400' },
};

export const DEP_CFG: Record<DepStatus, { label: string; text: string; bg: string }> = {
  'completed':   { label: 'COMPLETED',   text: 'text-emerald-700', bg: 'bg-emerald-50' },
  'in-progress': { label: 'IN PROGRESS', text: 'text-blue-700',    bg: 'bg-blue-50' },
  'at-risk':     { label: 'AT RISK',     text: 'text-amber-700',   bg: 'bg-amber-50' },
  'blocked':     { label: 'BLOCKED',     text: 'text-red-700',     bg: 'bg-red-50' },
  'not-started': { label: 'NOT STARTED', text: 'text-slate-500',   bg: 'bg-slate-100' },
};

export const SEV_CFG: Record<Severity, { label: string; text: string; bg: string }> = {
  'critical': { label: 'CRITICAL', text: 'text-red-700',   bg: 'bg-red-50' },
  'high':     { label: 'HIGH',     text: 'text-amber-700', bg: 'bg-amber-50' },
  'medium':   { label: 'MEDIUM',   text: 'text-blue-700',  bg: 'bg-blue-50' },
  'low':      { label: 'LOW',      text: 'text-slate-600', bg: 'bg-slate-100' },
};
