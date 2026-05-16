import { useState } from 'react';
import { departments, strategicObjectives, objectiveColorMap, type KRA, type Department } from '../../data/okrData';
import { AlertTriangle, User, Calendar, ChevronRight, Flag } from 'lucide-react';

const RAG_CONFIG = {
  green:   { label: 'On Track',    dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  amber:   { label: 'At Risk',     dot: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  red:     { label: 'Off Track',   dot: 'bg-red-500',     badge: 'bg-red-100 text-red-700 border-red-200' },
  pending: { label: 'Pending',     dot: 'bg-slate-300',   badge: 'bg-slate-100 text-slate-500 border-slate-200' },
};

function RAGBadge({ status }: { status: KRA['status'] }) {
  const cfg = RAG_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function KRACard({ kra, objColor }: { kra: KRA; objColor: string }) {
  const colors = objectiveColorMap[objColor as keyof typeof objectiveColorMap] ?? objectiveColorMap.blue;
  const [showRisks, setShowRisks] = useState(false);

  return (
    <div className="bg-white border border-slate-200 rounded-lg px-4 py-3 hover:border-slate-300 transition-colors">
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 text-xs font-bold px-2 py-0.5 rounded ${colors.badge} flex-shrink-0`}>
          {kra.code}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 leading-snug">{kra.title}</p>
          <div className="flex items-center gap-3 mt-2 flex-wrap">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <User size={10} /> {kra.owner}
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar size={10} /> {kra.dueDate}
            </span>
            {kra.weightage !== '-' && (
              <span className="text-xs text-slate-400">Wt: {kra.weightage}</span>
            )}
            {kra.supportFunctions.length > 0 && (
              <span className="text-xs text-slate-400">
                Support: {kra.supportFunctions.slice(0, 3).join(', ')}{kra.supportFunctions.length > 3 ? ` +${kra.supportFunctions.length - 3}` : ''}
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 flex items-center gap-2">
          <RAGBadge status={kra.status} />
          {kra.risks.length > 0 && (
            <button
              onClick={() => setShowRisks(v => !v)}
              className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
            >
              <AlertTriangle size={11} />
              <span>{kra.risks.length} risk{kra.risks.length > 1 ? 's' : ''}</span>
            </button>
          )}
        </div>
      </div>

      {showRisks && kra.risks.length > 0 && (
        <div className="mt-3 pl-3 border-l-2 border-amber-300 space-y-1">
          {kra.risks.map((r, i) => (
            <p key={i} className="text-xs text-amber-800 leading-snug">• {r}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function ObjectiveSection({ dept, objNumber, title, kras }: {
  dept: Department;
  objNumber: number;
  title: string;
  kras: KRA[];
}) {
  const [open, setOpen] = useState(true);
  const obj = strategicObjectives[objNumber - 1];
  const colors = obj ? objectiveColorMap[obj.color] : objectiveColorMap.blue;

  return (
    <div className="mb-4">
      <button
        onClick={() => setOpen(v => !v)}
        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg border text-left ${colors.bg} ${colors.border} hover:opacity-90 transition-opacity`}
      >
        <div className={`w-6 h-6 rounded-md flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${colors.dot}`}>
          {objNumber}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-semibold ${colors.text} truncate`}>Objective {objNumber}: {obj?.shortTitle}</p>
          <p className="text-xs text-slate-500 truncate">{title}</p>
        </div>
        <span className="text-xs text-slate-400 flex-shrink-0">{kras.length} KRAs</span>
        <ChevronRight size={14} className={`text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="mt-2 space-y-2 pl-2">
          {kras.map(kra => (
            <KRACard key={kra.id} kra={kra} objColor={obj?.color ?? 'blue'} />
          ))}
        </div>
      )}
    </div>
  );
}

function DepartmentPanel({ dept }: { dept: Department }) {
  // Group KRAs by objective
  const byObj = new Map<number, { title: string; kras: KRA[] }>();
  for (const kra of dept.kras) {
    if (!byObj.has(kra.objectiveNumber)) {
      const obj = strategicObjectives[kra.objectiveNumber - 1];
      byObj.set(kra.objectiveNumber, { title: obj?.title ?? '', kras: [] });
    }
    byObj.get(kra.objectiveNumber)!.kras.push(kra);
  }

  const totalRisks = dept.kras.reduce((s, k) => s + k.risks.length, 0);

  return (
    <div>
      {/* Dept Summary Bar */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-xl border mb-4 ${dept.badgeClass}`}>
        <div>
          <p className="font-bold text-sm">{dept.fullName}</p>
          <p className="text-xs opacity-70">{dept.kras.length} KRAs across {byObj.size} objectives</p>
        </div>
        <div className="flex items-center gap-3">
          {totalRisks > 0 && (
            <div className="flex items-center gap-1 text-xs">
              <AlertTriangle size={12} />
              <span>{totalRisks} risks logged</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-xs">
            <Flag size={12} />
            <span>{dept.kras.filter(k => k.status === 'pending').length} pending update</span>
          </div>
        </div>
      </div>

      {/* KRAs grouped by objective */}
      {[...byObj.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([objNum, { title, kras }]) => (
          <ObjectiveSection
            key={objNum}
            dept={dept}
            objNumber={objNum}
            title={title}
            kras={kras}
          />
        ))}
    </div>
  );
}

export function OKRDepartmentKRAs() {
  const [activeDept, setActiveDept] = useState(departments[0].id);
  const dept = departments.find(d => d.id === activeDept) ?? departments[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-2xl p-5 text-white">
        <h2 className="text-lg font-bold mb-1">Functional KRA Tracker</h2>
        <p className="text-indigo-200 text-xs">Department-level Key Result Areas mapped to Strategic Objectives</p>
        <div className="flex gap-4 mt-3">
          {[
            { label: 'Departments', value: departments.length },
            { label: 'Total KRAs', value: departments.reduce((s, d) => s + d.kras.length, 0) },
          ].map(x => (
            <div key={x.label} className="bg-white/10 rounded-lg px-3 py-2">
              <p className="font-bold text-lg">{x.value}</p>
              <p className="text-indigo-200 text-xs">{x.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Tab Strip */}
      <div className="flex gap-2 flex-wrap">
        {departments.map(d => (
          <button
            key={d.id}
            onClick={() => setActiveDept(d.id)}
            className={`text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
              activeDept === d.id
                ? `${d.badgeClass} ring-1 ring-offset-1`
                : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
            }`}
          >
            {d.name}
            <span className="ml-1.5 opacity-60">({d.kras.length})</span>
          </button>
        ))}
      </div>

      {/* Department Content */}
      <DepartmentPanel dept={dept} />
    </div>
  );
}
