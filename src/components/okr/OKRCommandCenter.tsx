import { useState } from 'react';
import {
  strategicObjectives, objectiveColorMap, getKRAsByObjective,
  type StrategicObjective,
} from '../../data/okrData';
import { Target, Users, Calendar, ChevronDown, ChevronUp, AlertTriangle } from 'lucide-react';

function ObjectiveCard({ obj, expanded, onToggle }: {
  obj: StrategicObjective;
  expanded: boolean;
  onToggle: () => void;
}) {
  const colors = objectiveColorMap[obj.color];
  const kraMap = getKRAsByObjective(obj.id);
  const totalKRAs = kraMap.reduce((s, x) => s + x.kras.length, 0);
  const allTeams = [...new Set(obj.keyResults.flatMap(kr => kr.teams))];

  return (
    <div className={`border rounded-xl overflow-hidden ${colors.border}`}>
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full text-left px-5 py-4 ${colors.bg} flex items-start gap-4 hover:opacity-90 transition-opacity`}
      >
        <div className={`mt-0.5 w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 font-bold text-sm text-white ${colors.dot}`}>
          {obj.number}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
              Objective {obj.number}
            </span>
            <span className="text-xs text-slate-500">{obj.keyResults.length} Key Results · {totalKRAs} Dept KRAs</span>
          </div>
          <p className={`mt-1 font-semibold text-sm ${colors.text}`}>{obj.shortTitle}</p>
          <p className="text-xs text-slate-500 mt-0.5 leading-relaxed line-clamp-2">{obj.title}</p>
          <div className="flex items-center gap-1 mt-2 flex-wrap">
            {allTeams.slice(0, 6).map(t => (
              <span key={t} className="text-xs bg-white/80 text-slate-600 border border-slate-200 rounded px-1.5 py-0.5">{t}</span>
            ))}
            {allTeams.length > 6 && (
              <span className="text-xs text-slate-400">+{allTeams.length - 6} more</span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 mt-1">
          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
        </div>
      </button>

      {/* Expanded Key Results */}
      {expanded && (
        <div className="divide-y divide-slate-100 bg-white">
          {obj.keyResults.map((kr, i) => (
            <div key={kr.id} className="px-5 py-3 flex gap-3">
              <div className={`mt-0.5 w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 text-xs font-bold text-white ${colors.dot}`}>
                {i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-xs font-semibold ${colors.text}`}>{kr.code}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full border ${colors.badge} ${colors.border}`}>
                    Weightage: {kr.weightage}
                  </span>
                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar size={10} /> {kr.timeline}
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">{kr.description}</p>
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  <Users size={10} className="text-slate-400 flex-shrink-0" />
                  {kr.teams.map(t => (
                    <span key={t} className="text-xs text-slate-500">{t}</span>
                  )).reduce((acc, el, idx) => idx === 0 ? [el] : [...acc, <span key={`sep-${idx}`} className="text-slate-300 text-xs">·</span>, el], [] as React.ReactNode[])}
                </div>
              </div>
            </div>
          ))}

          {/* Department KRA mapping */}
          <div className="px-5 py-3 bg-slate-50">
            <p className="text-xs font-semibold text-slate-500 mb-2">RESPONSIBLE DEPARTMENTS</p>
            <div className="flex flex-wrap gap-2">
              {kraMap.map(({ dept, kras }) => (
                <div key={dept.id} className={`text-xs px-2 py-1 rounded-lg border ${dept.badgeClass} flex items-center gap-1`}>
                  <span className="font-semibold">{dept.name}</span>
                  <span className="opacity-70">({kras.length} KRAs)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function OKRCommandCenter() {
  const [expandedObj, setExpandedObj] = useState<string | null>('obj-1');

  const totalKRs = strategicObjectives.reduce((s, o) => s + o.keyResults.length, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
            <Target size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Strategic Command Center</h2>
            <p className="text-slate-300 text-xs">Organization OKRs — FY 2026-27 · Irillic</p>
          </div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
          {[
            { label: 'Strategic Objectives', value: strategicObjectives.length.toString() },
            { label: 'Total Key Results', value: totalKRs.toString() },
            { label: 'Departments Aligned', value: '9' },
            { label: 'Fiscal Year', value: 'FY 2026-27' },
          ].map(item => (
            <div key={item.label} className="bg-white/10 rounded-xl px-3 py-2.5">
              <p className="text-white font-bold text-xl">{item.value}</p>
              <p className="text-slate-300 text-xs">{item.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Tree Intro */}
      <div className="grid grid-cols-5 gap-1.5">
        {strategicObjectives.map(obj => {
          const colors = objectiveColorMap[obj.color];
          return (
            <button
              key={obj.id}
              onClick={() => setExpandedObj(expandedObj === obj.id ? null : obj.id)}
              className={`rounded-xl p-3 border text-left transition-all ${
                expandedObj === obj.id
                  ? `${colors.bg} ${colors.border} ring-2 ring-offset-1 ring-${obj.color}-400`
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold mb-2 ${colors.dot}`}>
                {obj.number}
              </div>
              <p className={`text-xs font-semibold leading-tight ${expandedObj === obj.id ? colors.text : 'text-slate-700'}`}>
                {obj.shortTitle}
              </p>
              <p className="text-xs text-slate-400 mt-1">{obj.keyResults.length} KRs</p>
            </button>
          );
        })}
      </div>

      {/* Objective Detail Cards */}
      <div className="space-y-3">
        {strategicObjectives.map(obj => (
          <ObjectiveCard
            key={obj.id}
            obj={obj}
            expanded={expandedObj === obj.id}
            onToggle={() => setExpandedObj(expandedObj === obj.id ? null : obj.id)}
          />
        ))}
      </div>

      {/* Leadership Review Cadence */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4 flex items-center gap-2">
          <Calendar size={15} className="text-slate-400" />
          Leadership Review Cadence
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {[
            { cadence: 'Weekly', name: 'Executive Execution Review', focus: 'Execution risk + interventions + dependency escalations', color: 'bg-red-50 border-red-200 text-red-700' },
            { cadence: 'Monthly', name: 'Monthly Business Review', focus: 'Strategic trajectory, forecast updates, structural bottlenecks', color: 'bg-amber-50 border-amber-200 text-amber-700' },
            { cadence: 'Quarterly', name: 'Strategic OKR Review', focus: 'Outcome achievement, lessons learned, OKR recalibration', color: 'bg-blue-50 border-blue-200 text-blue-700' },
          ].map(r => (
            <div key={r.cadence} className={`rounded-xl border p-3 ${r.color}`}>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${r.color}`}>{r.cadence}</span>
              <p className="font-semibold text-sm mt-2">{r.name}</p>
              <p className="text-xs mt-1 opacity-80">{r.focus}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Note */}
      <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 rounded-xl p-4">
        <AlertTriangle size={15} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-800">
          <strong>Status Note:</strong> Progress % and RAG status fields are pending owner updates. All KRAs initialized as "Pending Update". Owners should submit weekly updates including confidence score, progress delta, blockers, and decisions needed.
        </p>
      </div>
    </div>
  );
}
