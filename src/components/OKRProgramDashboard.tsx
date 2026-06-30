import { useState } from 'react';
import {
  programMeta, statusRollup, headlineStats, objectives, functions,
  deadlines, dependencies, decisions, blockers, risks,
  RAG_CFG, DEP_CFG, SEV_CFG, type RAG,
} from '../data/dashboardData';

type Tab = 'executive' | 'functional' | 'dependencies' | 'trends';

const TABS: { id: Tab; label: string }[] = [
  { id: 'executive',    label: 'Executive Overview' },
  { id: 'functional',   label: 'Functional Overview' },
  { id: 'dependencies', label: 'Dependencies' },
  { id: 'trends',       label: 'Trends & Actions' },
];

export function OKRProgramDashboard() {
  const [tab, setTab] = useState<Tab>('executive');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800">
      <Header />
      <TabBar tab={tab} setTab={setTab} />
      <main className="max-w-[1500px] mx-auto px-4 sm:px-6 py-6 space-y-6">
        {tab === 'executive'    && <ExecutiveOverview />}
        {tab === 'functional'   && <FunctionalOverview />}
        {tab === 'dependencies' && <Dependencies />}
        {tab === 'trends'       && <TrendsActions />}
      </main>
      <footer className="max-w-[1500px] mx-auto px-6 py-8 text-center text-xs text-slate-400">
        Irillic · {programMeta.title} · {programMeta.fy} · Data as of {programMeta.asOf} ·
        Sourced from Master OKR Sheet
      </footer>
    </div>
  );
}

// ════════════════════════ HEADER ════════════════════════
function Header() {
  return (
    <header className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-4">
          <div className="text-2xl font-black tracking-tight">
            IRILLIC<span className="text-sky-400">°</span>
          </div>
          <div className="hidden sm:block border-l border-white/15 pl-4">
            <p className="text-sm font-bold tracking-wide uppercase">{programMeta.title} · {programMeta.fy}</p>
            <p className="text-xs text-slate-400">
              Program Lead: {programMeta.programLead} · {programMeta.org} · Sourced from Master OKR Sheet
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/5 border border-white/15 rounded-full px-4 py-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-xs font-mono text-slate-200">{programMeta.asOf} · 09:00 AM</span>
          </div>
        </div>
      </div>
    </header>
  );
}

// ════════════════════════ TAB BAR ════════════════════════
function TabBar({ tab, setTab }: { tab: Tab; setTab: (t: Tab) => void }) {
  return (
    <div className="bg-white border-b border-slate-200 sticky top-0 z-20">
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 flex items-center justify-between">
        <nav className="flex gap-1 sm:gap-6 overflow-x-auto">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`relative py-4 px-1 text-sm font-semibold whitespace-nowrap transition-colors ${
                tab === t.id ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              {t.label}
              {tab === t.id && <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />}
            </button>
          ))}
        </nav>
        <span className="hidden md:block text-xs font-mono text-slate-400">
          {programMeta.quarter} · {programMeta.quarterRange}
        </span>
      </div>
    </div>
  );
}

// shared bits
function StatusBadge({ status }: { status: RAG }) {
  const c = RAG_CFG[status];
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-md ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white rounded-2xl shadow-sm border border-slate-200/60 ${className}`}>{children}</div>;
}

// ════════════════════════ EXECUTIVE OVERVIEW ════════════════════════
function ExecutiveOverview() {
  return (
    <>
      {/* Top row: health gauge + 4 stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <HealthGauge />
        <StatCard value={headlineStats.totalKRs} label="Total KRs" sub={`across ${headlineStats.objectives} objectives`} accent="border-t-blue-500" />
        <StatCard value={headlineStats.healthyKRs} label="Healthy KRs" sub="completed or on track" accent="border-t-emerald-500" valueClass="text-emerald-600" tint="bg-emerald-50/40" />
        <StatCard value={headlineStats.needAttention} label="Need Attention" sub="at risk or off track" accent="border-t-red-500" valueClass="text-red-600" tint="bg-red-50/40" />
        <StatCard value={headlineStats.milestoneGaps} label="Milestone Gaps" sub="functions not submitted" accent="border-t-amber-500" valueClass="text-amber-600" tint="bg-amber-50/40" />
      </div>

      {/* Q1 progress by objective */}
      <Card className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Q1 Progress by Objective</p>
        <div className="space-y-3">
          {objectives.map(o => (
            <div key={o.id} className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 w-12">OBJ{o.num}</span>
              <div className="flex-1 h-2.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${RAG_CFG[o.status].bar}`} style={{ width: `${o.q1Pct}%` }} />
              </div>
              <span className={`text-sm font-bold w-12 text-right ${RAG_CFG[o.status].text}`}>{o.q1Pct}%</span>
              <span className="w-24 text-right"><StatusBadge status={o.status} /></span>
            </div>
          ))}
        </div>
      </Card>

      {/* Objectives table */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            Objectives · {programMeta.fy} | Annual Targets & Q1 Actuals
          </p>
          <p className="text-xs text-slate-400">Priority 1 = highest</p>
        </div>
        <div className="divide-y divide-slate-100">
          {objectives.map(o => (
            <div key={o.id} className="px-5 py-4 grid grid-cols-12 gap-4 items-center hover:bg-slate-50/50">
              <div className="col-span-12 lg:col-span-6 flex gap-3">
                <span className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center text-sm font-bold ${RAG_CFG[o.status].border} ${RAG_CFG[o.status].text}`}>
                  {o.priority}
                </span>
                <div>
                  <p className="text-sm font-semibold text-slate-800 leading-snug">{o.title}</p>
                  <p className="text-xs text-slate-400 mt-1">{o.krCount} KRs · {o.teams.join(' · ')}</p>
                </div>
              </div>
              <div className="col-span-4 lg:col-span-2">
                <p className="text-[10px] text-slate-400 uppercase">Annual</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full ${RAG_CFG[o.status].bar}`} style={{ width: `${o.annualPct}%` }} />
                  </div>
                  <span className="text-xs font-bold">{o.annualPct}%</span>
                </div>
              </div>
              <div className="col-span-4 lg:col-span-2">
                <p className="text-[10px] text-slate-400 uppercase">Q1 Actual</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold">{o.q1Pct}%</span>
                  <span className="text-[10px] text-slate-400">/ {o.q1Target}%</span>
                </div>
              </div>
              <div className="col-span-4 lg:col-span-2 flex flex-col items-start gap-1">
                <StatusBadge status={o.status} />
                <p className="text-[11px] text-amber-700 leading-tight">{o.riskContext}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Function health */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Function Health · {programMeta.quarter} 2026</p>
          <div className="flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Sheet submitted</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> Partial</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Not submitted</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {functions.map(f => {
            const c = RAG_CFG[f.status];
            const subDot = f.submission === 'submitted' ? 'bg-emerald-500' : f.submission === 'partial' ? 'bg-amber-500' : 'bg-red-500';
            return (
              <div key={f.id} className={`rounded-xl border border-slate-200 p-4 border-l-4 ${c.border.replace('border-', 'border-l-')}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <span className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-500">{f.code}</span>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{f.name}</p>
                      <p className="text-xs text-slate-400">{f.leads}</p>
                    </div>
                  </div>
                  <span className={`w-2.5 h-2.5 rounded-full ${subDot}`} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-slate-400">Q1 Progress</span>
                  <span className={`text-2xl font-black ${c.text}`}>{f.q1Pct}%</span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden mt-1.5">
                  <div className={`h-full ${c.bar}`} style={{ width: `${f.q1Pct}%` }} />
                </div>
                <div className="flex items-center justify-between mt-3">
                  <StatusBadge status={f.status} />
                  <span className="text-xs text-slate-400">{f.milestonesDone}/{f.milestonesTotal} milestones</span>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Upcoming deadlines */}
      <Card className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">Upcoming Deadlines · Next 45 Days</p>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {deadlines.map((d, i) => (
            <div key={i} className="flex-shrink-0 w-64 rounded-xl border-2 border-red-200 bg-red-50/30 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded-md">{d.daysLeft}</span>
                <span className="text-[10px] font-mono text-slate-400">{d.priority}</span>
              </div>
              <p className="text-sm font-semibold text-slate-800 leading-snug">{d.task}</p>
              <p className="text-xs text-slate-400 mt-2">{d.owner}</p>
              <p className="text-xs font-mono text-slate-400 mt-0.5">{d.due}</p>
            </div>
          ))}
        </div>
      </Card>
    </>
  );
}

function HealthGauge() {
  const score = programMeta.healthScore;
  const r = 42, circ = 2 * Math.PI * r, off = circ * (1 - score / 100);
  return (
    <Card className="p-5 flex flex-col items-center justify-center lg:row-span-1">
      <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2 text-center">Program Health Score</p>
      <div className="relative w-28 h-28">
        <svg className="w-28 h-28 -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r={r} fill="none" stroke="#e2e8f0" strokeWidth="7" />
          <circle cx="50" cy="50" r={r} fill="none" stroke="#dc2626" strokeWidth="7" strokeLinecap="round"
            strokeDasharray={circ} strokeDashoffset={off} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-black text-slate-800">{score}</span>
          <span className="text-[9px] text-slate-400">out of 100</span>
        </div>
      </div>
      <div className="w-full mt-3 space-y-1">
        {[
          { label: 'Completed', val: statusRollup.completed, dot: 'bg-emerald-500' },
          { label: 'On Track',  val: statusRollup.onTrack,   dot: 'bg-blue-500' },
          { label: 'At Risk',   val: statusRollup.atRisk,    dot: 'bg-amber-500' },
          { label: 'Off Track', val: statusRollup.offTrack,  dot: 'bg-red-500' },
          { label: 'Pending',   val: statusRollup.pending,   dot: 'bg-slate-300' },
        ].map(x => (
          <div key={x.label} className="flex items-center justify-between text-xs">
            <span className="flex items-center gap-1.5 text-slate-500"><span className={`w-1.5 h-1.5 rounded-full ${x.dot}`} />{x.label}</span>
            <span className="font-bold text-slate-700">{x.val}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}

function StatCard({ value, label, sub, accent, valueClass = 'text-slate-800', tint = '' }: {
  value: number | string; label: string; sub: string; accent: string; valueClass?: string; tint?: string;
}) {
  return (
    <Card className={`p-5 border-t-4 ${accent} ${tint} flex flex-col justify-center`}>
      <p className={`text-4xl font-black ${valueClass}`}>{value}</p>
      <p className="text-xs font-bold uppercase tracking-wide text-slate-500 mt-2">{label}</p>
      <p className="text-xs text-slate-400 mt-0.5">{sub}</p>
    </Card>
  );
}

// ════════════════════════ FUNCTIONAL OVERVIEW (timeline) ════════════════════════
function FunctionalOverview() {
  const quarters = ['Q1 APR–JUN', 'Q2 JUL–SEP', 'Q3 OCT–DEC', 'Q4 JAN–MAR'];
  const paceCfg = {
    ahead:    { label: 'Ahead',   color: 'text-emerald-600', bar: 'bg-emerald-400' },
    'on-pace':{ label: 'On Pace', color: 'text-blue-600',    bar: 'bg-blue-400' },
    behind:   { label: 'Behind',  color: 'text-red-600',     bar: 'bg-red-400' },
  } as const;

  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Function Functional Overview · {programMeta.fy}</p>
          <p className="text-xs text-slate-400 mt-0.5">✈ = current progress · ▮ = Today {programMeta.asOfShort} (end of Q1 · {programMeta.fyProgressPct}% of FY)</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5 text-slate-500"><span className="w-4 h-1 rounded bg-emerald-400" /> Ahead</span>
          <span className="flex items-center gap-1.5 text-slate-500"><span className="w-4 h-1 rounded bg-blue-400" /> On Pace</span>
          <span className="flex items-center gap-1.5 text-slate-500"><span className="w-4 h-1 rounded bg-red-400" /> Behind</span>
        </div>
      </div>

      {/* quarter header */}
      <div className="px-5 pt-4">
        <div className="ml-48 grid grid-cols-4 gap-0 text-[10px] font-bold text-slate-400 uppercase tracking-wide border-b border-slate-100 pb-2">
          {quarters.map(q => <span key={q}>{q}</span>)}
        </div>
      </div>

      <div className="divide-y divide-slate-100">
        {functions.map(f => {
          const pace = paceCfg[f.pace];
          // current FY position: Q1 progress maps function % onto FY timeline.
          // Visual marker placed proportional to q1Pct within a full-width track.
          const markerPct = Math.min(98, Math.max(2, f.q1Pct));
          return (
            <div key={f.id} className="px-5 py-4 flex items-center hover:bg-slate-50/50">
              <div className="w-48 flex-shrink-0 pr-4">
                <p className="text-sm font-bold text-slate-800">{f.name}</p>
                <p className="text-xs text-slate-400">{f.leads}</p>
              </div>
              <div className="flex-1 relative h-6">
                {/* full track */}
                <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1.5 bg-slate-100 rounded-full" />
                {/* progress fill */}
                <div className={`absolute top-1/2 -translate-y-1/2 left-0 h-1.5 rounded-full ${pace.bar}`} style={{ width: `${markerPct}%` }} />
                {/* today line at 25% of FY */}
                <div className="absolute top-0 bottom-0 w-px bg-slate-300" style={{ left: '25%' }} />
                {/* plane marker */}
                <span className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 text-sm" style={{ left: `${markerPct}%` }}>✈</span>
              </div>
              <div className="w-20 flex-shrink-0 text-right">
                <p className={`text-lg font-black ${pace.color}`}>{f.q1Pct}%</p>
                <p className={`text-[11px] font-semibold ${pace.color}`}>{pace.label}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ════════════════════════ DEPENDENCIES ════════════════════════
function Dependencies() {
  const [filter, setFilter] = useState<'all' | 'Q1' | 'Q2' | 'Q3'>('all');
  const list = dependencies.filter(d => filter === 'all' || d.quarter === filter);
  return (
    <Card className="overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Cross-Functional Dependencies</p>
          <p className="text-xs text-slate-400 mt-0.5">Where one team's deliverable gates another's — the riskiest failures hide in these handoffs.</p>
        </div>
        <div className="flex gap-1.5">
          {(['all', 'Q1', 'Q2', 'Q3'] as const).map(q => (
            <button key={q} onClick={() => setFilter(q)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors ${
                filter === q ? 'bg-blue-600 text-white border-blue-600' : 'border-slate-200 text-slate-500 hover:bg-slate-50'
              }`}>
              {q === 'all' ? 'All' : q}
            </button>
          ))}
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-400 border-b border-slate-100">
              <th className="text-left px-5 py-3">#</th>
              <th className="text-left px-3 py-3">Dependency</th>
              <th className="text-left px-3 py-3">KR</th>
              <th className="text-left px-3 py-3">Description</th>
              <th className="text-left px-3 py-3">Qtr</th>
              <th className="text-left px-3 py-3">Due</th>
              <th className="text-left px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {list.map(d => (
              <tr key={d.id} className="hover:bg-slate-50/50">
                <td className="px-5 py-4 font-mono text-xs text-slate-400 align-top">{d.id}</td>
                <td className="px-3 py-4 align-top">
                  <div className="flex items-center gap-1 flex-wrap text-xs font-mono">
                    <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">{d.from}</span>
                    <span className="text-slate-400">→</span>
                    <span className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{d.to}</span>
                  </div>
                </td>
                <td className="px-3 py-4 font-mono text-xs text-slate-500 align-top whitespace-nowrap">{d.kr}</td>
                <td className="px-3 py-4 text-slate-600 text-xs max-w-md align-top">{d.description}</td>
                <td className="px-3 py-4 font-bold text-xs text-slate-500 align-top">{d.quarter}</td>
                <td className="px-3 py-4 font-mono text-xs text-slate-500 align-top whitespace-nowrap">{d.due}</td>
                <td className="px-5 py-4 align-top">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${DEP_CFG[d.status].bg} ${DEP_CFG[d.status].text}`}>
                    {DEP_CFG[d.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-5 py-3 border-t border-slate-100 flex items-center gap-4 text-xs text-slate-400 flex-wrap">
        <span className="font-bold uppercase tracking-wide">Status Key:</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Completed</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-blue-500" /> In Progress</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-500" /> At Risk</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-500" /> Blocked</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400" /> Not Started</span>
      </div>
    </Card>
  );
}

// ════════════════════════ TRENDS & ACTIONS ════════════════════════
function TrendsActions() {
  return (
    <>
      {/* Leadership decisions */}
      <Card className="overflow-hidden border-t-4 border-t-blue-500">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Leadership Decisions & Asks</p>
          <p className="text-xs text-slate-400 mt-0.5">Added after weekly sheet review · Persists across sessions · Drives the review meeting agenda</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="text-left px-5 py-3">Priority</th>
                <th className="text-left px-3 py-3">Type</th>
                <th className="text-left px-3 py-3">Decision / Ask</th>
                <th className="text-left px-3 py-3">Raised By</th>
                <th className="text-left px-5 py-3">Needed By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {decisions.map(d => (
                <tr key={d.id} className="hover:bg-slate-50/50">
                  <td className="px-5 py-4 align-top">
                    <span className="text-[10px] font-bold uppercase text-amber-700 bg-amber-100 px-2 py-1 rounded-md">{d.priority}</span>
                  </td>
                  <td className="px-3 py-4 text-slate-500 text-xs align-top">{d.type}</td>
                  <td className="px-3 py-4 text-slate-700 text-xs max-w-lg align-top">{d.text}</td>
                  <td className="px-3 py-4 text-blue-600 text-xs align-top whitespace-nowrap">{d.raisedBy}</td>
                  <td className="px-5 py-4 font-mono text-xs text-slate-500 align-top whitespace-nowrap">{d.neededBy}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Month-over-month trend */}
      <Card className="p-5">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Month-over-Month Trend · Apr → May → Jun 2026</p>
        <p className="text-xs text-slate-400 mt-0.5 mb-4">May is estimated baseline. Jun actuals from submitted milestone data. Trajectory matters more than the absolute number.</p>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
          {objectives.map(o => {
            const isRed = o.status === 'off-track';
            return (
              <div key={o.id} className={`rounded-xl border p-4 ${isRed ? 'border-red-200' : 'border-slate-200'}`}>
                <p className="text-[10px] font-mono text-slate-400">OBJ{o.num} · P{o.priority}</p>
                <p className={`text-2xl font-black ${isRed ? 'text-red-600' : 'text-slate-400'}`}>{o.q1Pct}%</p>
                <p className="text-[11px] text-slate-500 leading-tight mt-0.5 h-7">{o.shortTitle}</p>
                <Sparkline pct={o.q1Pct} red={isRed} />
                <div className="flex justify-between text-[9px] text-slate-400 mt-1">
                  <span>Apr</span><span>May</span><span className={isRed ? 'text-red-500 font-bold' : ''}>Jun</span>
                </div>
                <p className="text-[11px] font-bold text-emerald-600 mt-1">↑ +{o.trendDeltaVsMay}% vs May</p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Blockers */}
      <Card className="overflow-hidden border-t-4 border-t-red-500">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-2">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Blockers — Sourced from Master Sheet</p>
            <p className="text-xs text-slate-400 mt-0.5">{blockers.length} tasks blocked across functions · Task, Owner, Reason sourced verbatim</p>
          </div>
          <span className="text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-3 py-1.5 rounded-full">{blockers.length} BLOCKED</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="text-left px-5 py-3">Function</th>
                <th className="text-left px-3 py-3">Obj</th>
                <th className="text-left px-3 py-3">Milestone Task</th>
                <th className="text-left px-3 py-3">Blocked Reason (verbatim)</th>
                <th className="text-left px-5 py-3">Owner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {blockers.map((b, i) => (
                <tr key={i} className="hover:bg-red-50/30">
                  <td className="px-5 py-4 font-bold text-red-600 text-xs align-top whitespace-nowrap">{b.function}</td>
                  <td className="px-3 py-4 font-bold text-xs text-slate-500 align-top">{b.obj}</td>
                  <td className="px-3 py-4 text-slate-700 text-xs align-top">{b.task}</td>
                  <td className="px-3 py-4 text-red-700 italic text-xs max-w-md align-top">{b.reason}</td>
                  <td className="px-5 py-4 text-slate-500 text-xs align-top whitespace-nowrap">{b.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Risk registry */}
      <Card className="overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">Risk Registry — Forward-Looking</p>
          <p className="text-xs text-slate-400 mt-0.5">Risks foreseen in the near future based on current trajectory · Explicit owner and resolution date</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-[10px] font-bold uppercase tracking-wide text-slate-400 border-b border-slate-100">
                <th className="text-left px-5 py-3">Severity</th>
                <th className="text-left px-3 py-3">Category</th>
                <th className="text-left px-3 py-3">Risk Description</th>
                <th className="text-left px-3 py-3">Owner</th>
                <th className="text-left px-3 py-3">Resolve By</th>
                <th className="text-left px-5 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {risks.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-5 py-4 align-top">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${SEV_CFG[r.severity].bg} ${SEV_CFG[r.severity].text}`}>{SEV_CFG[r.severity].label}</span>
                  </td>
                  <td className="px-3 py-4 text-slate-500 text-xs align-top">{r.category}</td>
                  <td className="px-3 py-4 text-slate-700 text-xs max-w-md align-top">{r.description}</td>
                  <td className="px-3 py-4 text-blue-600 text-xs align-top">{r.owner}</td>
                  <td className="px-3 py-4 font-mono text-xs text-red-600 align-top whitespace-nowrap">{r.resolveBy}</td>
                  <td className="px-5 py-4 align-top">
                    <span className={`text-[10px] font-bold px-2 py-1 rounded-md ${
                      r.status === 'blocked' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'
                    }`}>{r.status.toUpperCase()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}

function Sparkline({ pct, red }: { pct: number; red: boolean }) {
  // 3 points: Apr (low), May (mid), Jun (pct). Simple upward line.
  const apr = Math.max(2, pct - 10), may = Math.max(3, pct - 4), jun = pct;
  const max = Math.max(jun, 20);
  const y = (v: number) => 30 - (v / max) * 26;
  const pts = `4,${y(apr)} 38,${y(may)} 72,${y(jun)}`;
  const stroke = red ? '#dc2626' : '#94a3b8';
  return (
    <svg viewBox="0 0 76 32" className="w-full h-8 mt-1">
      <polyline points={pts} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="38" cy={y(may)} r="2" fill={stroke} />
    </svg>
  );
}
