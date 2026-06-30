// Regenerate dashboard metrics from an uploaded Master OKR Sheet workbook.
// Same rule as the audit: KRA progress = avg of its milestone tasks;
// function = avg of its KRAs; objective = avg of all dept KRAs tagged to it.
import * as XLSX from 'xlsx';
import {
  Objective, FunctionHealth, Blocker, RAG,
  objectives as baseObjectives, functions as baseFunctions,
  statusRollup as baseRollup, headlineStats as baseHeadline,
  blockers as baseBlockers, programMeta,
} from './dashboardData';

export interface DashboardData {
  objectives: Objective[];
  functions: FunctionHealth[];
  statusRollup: typeof baseRollup;
  headlineStats: typeof baseHeadline;
  blockers: Blocker[];
  health: number;
  asOf: string;
  source: string;       // label shown under the date
  isBaseline: boolean;
}

export function baselineData(): DashboardData {
  return {
    objectives: baseObjectives,
    functions: baseFunctions,
    statusRollup: baseRollup,
    headlineStats: baseHeadline,
    blockers: baseBlockers,
    health: programMeta.healthScore,
    asOf: programMeta.asOf,
    source: `baseline (Master Sheet · ${programMeta.asOf})`,
    isBaseline: true,
  };
}

const FN_DEFS = [
  { id: 'rnd',  code: 'RND',  name: 'R&D',                       leads: 'Machaiah / Shivangi',     token: 'rnd' },
  { id: 'pm',   code: 'PM+C', name: 'Product Management + CAS',  leads: 'Ashwin R. / Reshma',      token: 'product' },
  { id: 'qara', code: 'QA',   name: 'QA / RA',                   leads: 'Hariom / Nanda / Ramya',  token: 'qara' },
  { id: 'sales',code: 'S&M',  name: 'Sales & Marketing',         leads: 'Arindam / Amit',          token: 'sales' },
  { id: 'mfg',  code: 'MFG',  name: 'Manufacturing',             leads: 'Chandhan',                token: 'mfg' },
  { id: 'cs',   code: 'CS',   name: 'Customer Service',          leads: 'Laxmiputra',              token: 'cs ' },
  { id: 'pur',  code: 'PUR',  name: 'Purchase',                  leads: 'Harish',                  token: 'purchase' },
  { id: 'hr',   code: 'HR',   name: 'Human Resources',           leads: 'Twinkle / Rahul / Nisha', token: 'hr ' },
  { id: 'fin',  code: 'FIN',  name: 'Finance',                   leads: 'Finance Team',            token: 'finance' },
];

function toNum(v: any): number | null {
  if (v === null || v === undefined || v === '') return null;
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace('%', ''));
  return isNaN(n) ? null : n;
}
function objNum(o: any): number | null {
  if (!o) return null;
  const m = String(o).match(/(\d)/);
  return m ? +m[1] : null;
}
function fStatus(p: number): RAG {
  return p === 0 ? 'pending' : p < 10 ? 'off-track' : p < 20 ? 'at-risk' : 'on-track';
}
function subStatus(m: number): FunctionHealth['submission'] {
  return m === 0 ? 'not-submitted' : m < 20 ? 'partial' : 'submitted';
}

function extractSheet(rows: any[][]) {
  let cur: { obj: any; tasks: number[]; rag: any } | null = null;
  let curObj: any = null;
  const kras: { obj: any; tasks: number[]; rag: any; prog: number }[] = [];
  let mdone = 0, mtot = 0;
  const blk: { task: string; owner: any; reason: any; obj: any }[] = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r] || [];
    const a = row[0], b = row[1], f = row[5], g = row[6], j = toNum(row[9]), k = row[10], reason = row[12], p = row[15];
    if (typeof a === 'string' && a.trim().toLowerCase().startsWith('obj')) curObj = a.trim();
    const isKRA = b && typeof b === 'string' && b.trim().toUpperCase().startsWith('KRA') && b.trim() !== 'KRA Description';
    if (isKRA) { cur = { obj: curObj, tasks: [], rag: p, prog: 0 } as any; kras.push(cur as any); }
    if (cur && f && typeof f === 'string' && f.trim() !== '' && f.trim() !== 'Milestone Task' && k != null && String(k).trim() !== '') {
      mtot++;
      const st = String(k).trim().toLowerCase();
      if (st === 'done' || st === 'completed') mdone++;
      if (j != null) cur.tasks.push(j);
      if (st === 'blocked') blk.push({ task: f.trim(), owner: g, reason, obj: curObj });
    }
  }
  kras.forEach(x => x.prog = x.tasks.length ? x.tasks.reduce((s, t) => s + t, 0) / x.tasks.length : 0);
  const fprog = kras.length ? kras.reduce((s, x) => s + x.prog, 0) / kras.length : 0;
  return { fprog, kras, mdone, mtot, blk };
}

export function regenerateFromWorkbook(wb: XLSX.WorkBook, fileName: string): DashboardData {
  const norm = (n: string) => n.toLowerCase();
  const newFns: FunctionHealth[] = [];
  const objAgg: Record<number, number[]> = {};
  const roll = { completed: 0, onTrack: 0, atRisk: 0, offTrack: 0, pending: 0, total: 0 };
  const allBlk: Blocker[] = [];
  let totalKRA = 0, matched = 0;

  FN_DEFS.forEach(def => {
    const sn = wb.SheetNames.find(n => norm(n).includes(def.token));
    if (!sn) return;
    matched++;
    const rows = XLSX.utils.sheet_to_json<any[]>(wb.Sheets[sn], { header: 1, raw: true, defval: null });
    const ex = extractSheet(rows);
    newFns.push({
      id: def.id, code: def.code, name: def.name, leads: def.leads,
      q1Pct: Math.round(ex.fprog * 10) / 10, status: fStatus(ex.fprog),
      milestonesDone: ex.mdone, milestonesTotal: ex.mtot,
      submission: subStatus(ex.mtot), pace: ex.fprog >= 10 ? 'on-pace' : 'behind',
    });
    ex.kras.forEach(kr => {
      totalKRA++;
      const rg = String(kr.rag || '').toLowerCase();
      if (rg.indexOf('green') >= 0) roll.completed++;
      else if (rg.indexOf('amber') >= 0) roll.atRisk++;
      else if (rg.indexOf('red') >= 0) roll.offTrack++;
      else roll.pending++;
      const on = objNum(kr.obj);
      if (on) (objAgg[on] = objAgg[on] || []).push(kr.prog);
    });
    ex.blk.forEach(b => {
      const on = objNum(b.obj);
      allBlk.push({
        function: def.name, obj: on ? 'OBJ' + on : '—', task: b.task,
        owner: b.owner ? String(b.owner) : def.leads,
        reason: b.reason ? String(b.reason) : 'Reason not provided',
      });
    });
  });

  if (!matched) throw new Error('no department sheets recognised — is this the Master OKR Sheet?');
  roll.total = totalKRA;

  const newObjs: Objective[] = baseObjectives.map(o => {
    const arr = objAgg[o.num] || [];
    const q = arr.length ? Math.round(arr.reduce((s, x) => s + x, 0) / arr.length) : 0;
    return { ...o, q1Pct: q, annualPct: q, status: fStatus(q) };
  });

  const health = newFns.length ? Math.round(newFns.reduce((s, f) => s + f.q1Pct, 0) / newFns.length) : 0;
  const gaps = newFns.filter(f => f.q1Pct === 0).length;
  const asOf = new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });

  return {
    objectives: newObjs,
    functions: newFns,
    statusRollup: roll,
    headlineStats: { totalKRs: totalKRA, objectives: 5, healthyKRs: roll.completed, needAttention: roll.atRisk + roll.offTrack, milestoneGaps: gaps },
    blockers: allBlk.length ? allBlk : baseBlockers,
    health, asOf,
    source: `${fileName} · regenerated ${asOf}`,
    isBaseline: false,
  };
}
