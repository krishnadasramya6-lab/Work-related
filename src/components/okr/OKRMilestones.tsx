import { useState } from 'react';
import { milestones, objectiveColorMap, strategicObjectives, type Milestone } from '../../data/okrData';
import { CalendarDays, Filter } from 'lucide-react';

const QUARTERS: { id: Milestone['quarter']; label: string; range: string }[] = [
  { id: 'Q1', label: 'Q1', range: 'Apr – Jun 2026' },
  { id: 'Q2', label: 'Q2', range: 'Jul – Sep 2026' },
  { id: 'Q3', label: 'Q3', range: 'Oct – Dec 2026' },
  { id: 'Q4', label: 'Q4', range: 'Jan – Mar 2027' },
];

function MilestoneCard({ ms }: { ms: Milestone }) {
  const colors = objectiveColorMap[ms.color];
  const obj = strategicObjectives.find(o => o.id === ms.objectiveRef);
  return (
    <div className="flex gap-3 items-start">
      <div className={`w-3 h-3 rounded-full flex-shrink-0 mt-1 ring-2 ring-white ring-offset-1 ${colors.dot}`} />
      <div className="flex-1 min-w-0 pb-3 border-b border-slate-100 last:border-0">
        <p className="text-sm text-slate-800 leading-snug">{ms.title}</p>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className={`text-xs px-2 py-0.5 rounded-full ${colors.badge}`}>
            {ms.dateLabel}
          </span>
          <span className="text-xs text-slate-400">{ms.department}</span>
          {obj && (
            <span className={`text-xs px-1.5 py-0.5 rounded border ${colors.badge} ${colors.border} opacity-80`}>
              Obj {obj.number}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export function OKRMilestones() {
  const [activeQ, setActiveQ] = useState<Milestone['quarter'] | 'all'>('all');
  const [filterObj, setFilterObj] = useState<string>('all');

  const filtered = milestones.filter(m => {
    if (activeQ !== 'all' && m.quarter !== activeQ) return false;
    if (filterObj !== 'all' && m.objectiveRef !== filterObj) return false;
    return true;
  }).sort((a, b) => a.sortKey.localeCompare(b.sortKey));

  const byQuarter = QUARTERS.map(q => ({
    ...q,
    items: filtered.filter(m => m.quarter === q.id),
    total: milestones.filter(m => m.quarter === q.id).length,
  }));

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-violet-900 to-violet-700 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <CalendarDays size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Milestone Timeline</h2>
            <p className="text-violet-200 text-xs">Key execution dates across all objectives — FY 2026-27</p>
          </div>
        </div>
        <div className="grid grid-cols-4 gap-2 mt-4">
          {byQuarter.map(q => (
            <div key={q.id} className="bg-white/10 rounded-xl px-3 py-2">
              <p className="font-bold text-lg">{q.total}</p>
              <p className="text-violet-200 text-xs">{q.label} · {q.range}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex gap-1">
          {[{ id: 'all' as const, label: 'All Quarters' }, ...QUARTERS.map(q => ({ id: q.id, label: q.label }))].map(q => (
            <button
              key={q.id}
              onClick={() => setActiveQ(q.id)}
              className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                activeQ === q.id
                  ? 'bg-violet-700 text-white border-violet-700'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
              }`}
            >
              {q.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Filter size={12} className="text-slate-400" />
          <select
            value={filterObj}
            onChange={e => setFilterObj(e.target.value)}
            className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-violet-500"
          >
            <option value="all">All Objectives</option>
            {strategicObjectives.map(o => (
              <option key={o.id} value={o.id}>{o.number}. {o.shortTitle}</option>
            ))}
          </select>
        </div>
        <span className="text-xs text-slate-400">{filtered.length} milestones</span>
      </div>

      {/* Objective Color Legend */}
      <div className="flex flex-wrap gap-2">
        {strategicObjectives.map(obj => {
          const colors = objectiveColorMap[obj.color];
          return (
            <button
              key={obj.id}
              onClick={() => setFilterObj(filterObj === obj.id ? 'all' : obj.id)}
              className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border transition-all ${
                filterObj === obj.id || filterObj === 'all'
                  ? `${colors.badge} ${colors.border}`
                  : 'bg-slate-100 text-slate-400 border-slate-200 opacity-50'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
              Obj {obj.number}: {obj.shortTitle}
            </button>
          );
        })}
      </div>

      {/* Timeline Columns */}
      {activeQ === 'all' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {byQuarter.map(q => (
            q.items.length > 0 && (
              <div key={q.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-sm text-slate-700">{q.label}</p>
                      <p className="text-xs text-slate-400">{q.range}</p>
                    </div>
                    <span className="text-xs bg-slate-200 text-slate-600 rounded-full px-2 py-0.5">{q.items.length} milestones</span>
                  </div>
                </div>
                <div className="px-4 py-3 space-y-0">
                  {q.items.map(ms => <MilestoneCard key={ms.id} ms={ms} />)}
                </div>
              </div>
            )
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl">
          {byQuarter.filter(q => q.id === activeQ).map(q => (
            <div key={q.id}>
              <div className="bg-slate-50 border-b border-slate-200 px-5 py-4">
                <p className="font-semibold text-slate-700">{q.label} — {q.range}</p>
                <p className="text-xs text-slate-400 mt-0.5">{q.items.length} milestones {filterObj !== 'all' ? '(filtered)' : ''}</p>
              </div>
              {q.items.length === 0 ? (
                <p className="text-center text-slate-400 text-sm py-12">No milestones match the current filters</p>
              ) : (
                <div className="px-5 py-4 space-y-0">
                  {q.items.map(ms => <MilestoneCard key={ms.id} ms={ms} />)}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Critical Path Note */}
      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-violet-700 mb-2">CRITICAL PATH DEPENDENCIES</p>
        <div className="space-y-1.5 text-xs text-violet-800">
          <p>• <strong>L.nm WL Release (May 26)</strong> → gates BIS Design Readiness, Sales Team Certification, and Q1 Revenue</p>
          <p>• <strong>Arthroscopy Validation (May 26)</strong> → gates Import License (Jul 26) and Post-Approval Submission (Jul 26)</p>
          <p>• <strong>QA/RA Country Registrations (Jul 26)</strong> → gates Malaysia, Philippines international distributor appointment</p>
          <p>• <strong>L.nm V2 M1P1 (Jul 26)</strong> → gates all subsequent NPD milestones through Mar 2027</p>
          <p>• <strong>RND Team Bandwidth</strong> → single largest risk across all NPD and production release timelines</p>
        </div>
      </div>
    </div>
  );
}
