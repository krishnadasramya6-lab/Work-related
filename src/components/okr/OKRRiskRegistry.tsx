import { useState, useMemo } from 'react';
import { departments, strategicObjectives, objectiveColorMap, getAllRisks } from '../../data/okrData';
import { AlertTriangle, Filter, Shield } from 'lucide-react';

const HIGH_RISK_KEYWORDS = [
  'delay', 'delay', 'won\'t', 'not received', 'failed', 'fail', 'critical', 'stoppage',
  'risk', 'constraint', 'roadblock', 'unavailability', 'impossible', 'limited',
];

function classifyRisk(text: string): 'high' | 'medium' | 'low' {
  const lower = text.toLowerCase();
  const highMatches = HIGH_RISK_KEYWORDS.filter(k => lower.includes(k)).length;
  if (highMatches >= 3) return 'high';
  if (highMatches >= 1) return 'medium';
  return 'low';
}

const RISK_SEVERITY = {
  high:   { label: 'High',   badge: 'bg-red-100 text-red-700 border-red-200',       dot: 'bg-red-500' },
  medium: { label: 'Medium', badge: 'bg-amber-100 text-amber-700 border-amber-200', dot: 'bg-amber-500' },
  low:    { label: 'Low',    badge: 'bg-slate-100 text-slate-600 border-slate-200',  dot: 'bg-slate-400' },
};

export function OKRRiskRegistry() {
  const [filterObj, setFilterObj] = useState<string>('all');
  const [filterDept, setFilterDept] = useState<string>('all');
  const [filterSev, setFilterSev] = useState<string>('all');

  const allRisks = useMemo(() => getAllRisks().map((r, i) => ({
    ...r,
    id: `risk-${i}`,
    severity: classifyRisk(r.risk),
  })), []);

  const filtered = useMemo(() => allRisks.filter(r => {
    if (filterObj !== 'all' && r.objectiveNumber !== parseInt(filterObj)) return false;
    if (filterDept !== 'all' && r.department !== filterDept) return false;
    if (filterSev !== 'all' && r.severity !== filterSev) return false;
    return true;
  }), [allRisks, filterObj, filterDept, filterSev]);

  const deptOptions = [...new Set(allRisks.map(r => r.department))];
  const highCount = filtered.filter(r => r.severity === 'high').length;
  const medCount = filtered.filter(r => r.severity === 'medium').length;
  const lowCount = filtered.filter(r => r.severity === 'low').length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-red-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <Shield size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Risk Registry</h2>
            <p className="text-red-200 text-xs">All risks and blockers extracted from KRA owner notes</p>
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          {[
            { label: 'Total Risks', value: allRisks.length, color: 'bg-white/10' },
            { label: 'High', value: allRisks.filter(r => r.severity === 'high').length, color: 'bg-red-600/50' },
            { label: 'Medium', value: allRisks.filter(r => r.severity === 'medium').length, color: 'bg-orange-500/40' },
            { label: 'Low', value: allRisks.filter(r => r.severity === 'low').length, color: 'bg-white/10' },
          ].map(x => (
            <div key={x.label} className={`${x.color} rounded-xl px-3 py-2`}>
              <p className="font-bold text-lg">{x.value}</p>
              <p className="text-red-200 text-xs">{x.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <Filter size={13} className="text-slate-400" />
          <span className="text-xs font-semibold text-slate-600">Filters</span>
        </div>
        <div className="flex gap-3 flex-wrap">
          <div>
            <label className="text-xs text-slate-500 block mb-1">Objective</label>
            <select
              value={filterObj}
              onChange={e => setFilterObj(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Objectives</option>
              {strategicObjectives.map(o => (
                <option key={o.id} value={o.number}>{o.number}. {o.shortTitle}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Department</label>
            <select
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Departments</option>
              {deptOptions.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-slate-500 block mb-1">Severity</label>
            <select
              value={filterSev}
              onChange={e => setFilterSev(e.target.value)}
              className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            >
              <option value="all">All Severity</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="self-end">
            <button
              onClick={() => { setFilterObj('all'); setFilterDept('all'); setFilterSev('all'); }}
              className="text-xs text-slate-500 hover:text-slate-700 px-2 py-1.5 border border-slate-200 rounded-lg"
            >
              Clear
            </button>
          </div>
        </div>
        <p className="text-xs text-slate-400 mt-3">Showing {filtered.length} of {allRisks.length} risks</p>
      </div>

      {/* Summary by Severity */}
      {filtered.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { severity: 'high' as const, count: highCount, label: 'High Priority' },
            { severity: 'medium' as const, count: medCount, label: 'Medium Priority' },
            { severity: 'low' as const, count: lowCount, label: 'Low Priority' },
          ].map(({ severity, count, label }) => {
            const cfg = RISK_SEVERITY[severity];
            return (
              <div key={severity} className={`rounded-xl border p-3 ${cfg.badge}`}>
                <div className={`w-2 h-2 rounded-full ${cfg.dot} mb-2`} />
                <p className="font-bold text-2xl">{count}</p>
                <p className="text-xs">{label}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Risk Cards */}
      <div className="space-y-2">
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400">
            <Shield size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No risks match the current filters</p>
          </div>
        ) : (
          filtered.map(risk => {
            const cfg = RISK_SEVERITY[risk.severity as keyof typeof RISK_SEVERITY];
            const dept = departments.find(d => d.name === risk.department);
            const obj = strategicObjectives[risk.objectiveNumber - 1];
            const objColors = obj ? objectiveColorMap[obj.color] : objectiveColorMap.blue;
            return (
              <div key={risk.id} className="bg-white border border-slate-200 rounded-xl p-4 flex gap-3">
                <AlertTriangle size={14} className={`flex-shrink-0 mt-0.5 ${
                  risk.severity === 'high' ? 'text-red-500' :
                  risk.severity === 'medium' ? 'text-amber-500' : 'text-slate-400'
                }`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-800 leading-snug">{risk.risk}</p>
                  <div className="flex items-center gap-2 mt-2 flex-wrap">
                    <span className={`text-xs border px-2 py-0.5 rounded-full ${cfg.badge}`}>
                      {cfg.label}
                    </span>
                    {dept && (
                      <span className={`text-xs border px-2 py-0.5 rounded-full ${dept.badgeClass}`}>
                        {dept.name}
                      </span>
                    )}
                    {obj && (
                      <span className={`text-xs border px-2 py-0.5 rounded-full ${objColors.badge} ${objColors.border}`}>
                        Obj {risk.objectiveNumber}: {obj.shortTitle}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1.5 truncate">KRA: {risk.kraTitle}</p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Risk Category Legend */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-slate-600 mb-3">RISK SCORING MODEL (per EOS framework)</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
          {[
            { factor: 'Progress Variance', weight: '25%' },
            { factor: 'Velocity Decline', weight: '20%' },
            { factor: 'Dependency Risk', weight: '20%' },
            { factor: 'Confidence Drop', weight: '15%' },
            { factor: 'Update Freshness', weight: '10%' },
            { factor: 'Resource Stress', weight: '10%' },
          ].map(x => (
            <div key={x.factor} className="flex items-center justify-between bg-white rounded-lg border border-slate-100 px-3 py-1.5">
              <span>{x.factor}</span>
              <span className="font-semibold text-slate-700">{x.weight}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 mt-2">Severity classification above is based on keyword analysis of owner-submitted risk notes pending quantitative scoring.</p>
      </div>
    </div>
  );
}
