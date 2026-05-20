import { useState } from 'react';
import { departments, strategicObjectives, objectiveColorMap, type KRA, type Department } from '../../data/okrData';
import { AlertTriangle, User, Calendar, ChevronRight, Pencil, CheckCircle, XCircle } from 'lucide-react';
import { KRAEditModal } from './KRAEditModal';
import { useOKRStore, KRAUpdate } from '../../store/useOKRStore';

const RAG_CONFIG = {
  green:   { label: 'On Track',  dot: 'bg-emerald-500', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
  amber:   { label: 'At Risk',   dot: 'bg-amber-500',   badge: 'bg-amber-100 text-amber-700 border-amber-200' },
  red:     { label: 'Off Track', dot: 'bg-red-500',     badge: 'bg-red-100 text-red-700 border-red-200' },
  pending: { label: 'Pending',   dot: 'bg-slate-300',   badge: 'bg-slate-100 text-slate-500 border-slate-200' },
};

function RAGBadge({ status }: { status: string }) {
  const cfg = RAG_CONFIG[status as keyof typeof RAG_CONFIG] ?? RAG_CONFIG.pending;
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full border ${cfg.badge}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

function KRACard({ kra, objColor, update, onEdit }: {
  kra: KRA;
  objColor: string;
  update: KRAUpdate | null;
  onEdit: () => void;
}) {
  const colors = objectiveColorMap[objColor as keyof typeof objectiveColorMap] ?? objectiveColorMap.blue;
  const [showRisks, setShowRisks] = useState(false);
  const status = update?.status ?? 'pending';
  const progress = update?.progress ?? null;
  const progressColor = progress !== null
    ? progress >= 70 ? 'bg-emerald-500' : progress >= 40 ? 'bg-amber-500' : 'bg-red-500'
    : 'bg-slate-200';

  return (
    <div className={`bg-white border rounded-lg px-4 py-3 transition-colors ${
      status === 'red' ? 'border-red-200 bg-red-50/30' :
      status === 'amber' ? 'border-amber-200 bg-amber-50/20' :
      status === 'green' ? 'border-emerald-200' :
      'border-slate-200 hover:border-slate-300'
    }`}>
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 text-xs font-bold px-2 py-0.5 rounded ${colors.badge} flex-shrink-0`}>
          {kra.code}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-slate-800 leading-snug">{kra.title}</p>

          {/* Progress bar */}
          {progress !== null && (
            <div className="mt-2">
              <div className="flex items-center justify-between mb-0.5">
                <span className="text-xs text-slate-400">Progress</span>
                <span className="text-xs font-semibold text-slate-600">{progress}%</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${progressColor}`} style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

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

          {/* Blocker note */}
          {update?.blockerNote && (
            <div className="mt-2 flex items-start gap-1.5">
              <AlertTriangle size={11} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-800">{update.blockerNote}</p>
            </div>
          )}

          {/* Decision needed */}
          {update?.decisionNeeded && (
            <div className="mt-1.5 flex items-start gap-1.5">
              <span className="text-xs bg-red-100 text-red-700 border border-red-200 px-1.5 py-0.5 rounded flex-shrink-0">Decision needed</span>
              <p className="text-xs text-red-700">{update.decisionNeeded}</p>
            </div>
          )}
        </div>

        <div className="flex-shrink-0 flex flex-col items-end gap-2">
          <RAGBadge status={status} />
          <div className="flex items-center gap-2">
            {kra.risks.length > 0 && (
              <button
                onClick={() => setShowRisks(v => !v)}
                className="flex items-center gap-1 text-xs text-amber-600 hover:text-amber-700"
              >
                <AlertTriangle size={11} />
                <span>{kra.risks.length}</span>
              </button>
            )}
            <button
              onClick={onEdit}
              className="flex items-center gap-1 text-xs text-slate-400 hover:text-slate-700 border border-slate-200 hover:border-slate-400 rounded-lg px-2 py-0.5 transition-colors"
            >
              <Pencil size={10} /> Update
            </button>
          </div>
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

function ObjectiveSection({ objNumber, title, kras, updates, onEdit }: {
  objNumber: number;
  title: string;
  kras: KRA[];
  updates: Record<string, any>;
  onEdit: (kra: KRA) => void;
}) {
  const [open, setOpen] = useState(true);
  const obj = strategicObjectives[objNumber - 1];
  const colors = obj ? objectiveColorMap[obj.color] : objectiveColorMap.blue;

  const onTrack  = kras.filter(k => (updates[k.id]?.status ?? 'pending') === 'green').length;
  const atRisk   = kras.filter(k => (updates[k.id]?.status ?? 'pending') === 'amber').length;
  const offTrack = kras.filter(k => (updates[k.id]?.status ?? 'pending') === 'red').length;

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
        {/* Mini RAG summary */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {onTrack > 0  && <span className="flex items-center gap-0.5 text-xs text-emerald-700"><CheckCircle size={11} />{onTrack}</span>}
          {atRisk > 0   && <span className="flex items-center gap-0.5 text-xs text-amber-700"><AlertTriangle size={11} />{atRisk}</span>}
          {offTrack > 0 && <span className="flex items-center gap-0.5 text-xs text-red-700"><XCircle size={11} />{offTrack}</span>}
          <span className="text-xs text-slate-400 ml-1">{kras.length} KRAs</span>
        </div>
        <ChevronRight size={14} className={`text-slate-400 flex-shrink-0 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>

      {open && (
        <div className="mt-2 space-y-2 pl-2">
          {kras.map(kra => (
            <KRACard
              key={kra.id}
              kra={kra}
              objColor={obj?.color ?? 'blue'}
              update={updates[kra.id] ?? null}
              onEdit={() => onEdit(kra)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function DepartmentPanel({ dept, updates, onEdit }: {
  dept: Department;
  updates: Record<string, any>;
  onEdit: (kra: KRA) => void;
}) {
  const byObj = new Map<number, { title: string; kras: KRA[] }>();
  for (const kra of dept.kras) {
    if (!byObj.has(kra.objectiveNumber)) {
      const obj = strategicObjectives[kra.objectiveNumber - 1];
      byObj.set(kra.objectiveNumber, { title: obj?.title ?? '', kras: [] });
    }
    byObj.get(kra.objectiveNumber)!.kras.push(kra);
  }

  const totalKRAs  = dept.kras.length;
  const updated    = dept.kras.filter(k => updates[k.id]).length;
  const onTrack    = dept.kras.filter(k => updates[k.id]?.status === 'green').length;
  const atRisk     = dept.kras.filter(k => updates[k.id]?.status === 'amber').length;
  const offTrack   = dept.kras.filter(k => updates[k.id]?.status === 'red').length;
  const completionPct = totalKRAs > 0 ? Math.round((updated / totalKRAs) * 100) : 0;

  return (
    <div>
      {/* Dept Summary */}
      <div className={`rounded-xl border mb-4 ${dept.badgeClass}`}>
        <div className="flex items-center justify-between px-4 py-3">
          <div>
            <p className="font-bold text-sm">{dept.fullName}</p>
            <p className="text-xs opacity-70">{totalKRAs} KRAs · {updated} updated</p>
          </div>
          <div className="flex items-center gap-3 text-xs">
            {onTrack > 0  && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />{onTrack} on track</span>}
            {atRisk > 0   && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />{atRisk} at risk</span>}
            {offTrack > 0 && <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />{offTrack} off track</span>}
          </div>
        </div>
        {/* Update completion bar */}
        <div className="px-4 pb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs opacity-60">Update completion</span>
            <span className="text-xs font-semibold">{completionPct}%</span>
          </div>
          <div className="h-1.5 bg-black/10 rounded-full overflow-hidden">
            <div className="h-full bg-white/70 rounded-full transition-all" style={{ width: `${completionPct}%` }} />
          </div>
        </div>
      </div>

      {[...byObj.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([objNum, { title, kras }]) => (
          <ObjectiveSection
            key={objNum}
            objNumber={objNum}
            title={title}
            kras={kras}
            updates={updates}
            onEdit={onEdit}
          />
        ))}
    </div>
  );
}

export function OKRDepartmentKRAs() {
  const [activeDept, setActiveDept] = useState(departments[0].id);
  const [editingKRA, setEditingKRA] = useState<KRA | null>(null);
  const { updates, updateKRA, getKRA, clearKRA } = useOKRStore();

  const dept = departments.find(d => d.id === activeDept) ?? departments[0];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900 to-indigo-700 rounded-2xl p-5 text-white">
        <h2 className="text-lg font-bold mb-1">Functional KRA Tracker</h2>
        <p className="text-indigo-200 text-xs mb-3">Click <strong>"Update"</strong> on any KRA to set its status, progress and blockers</p>
        <div className="flex gap-4">
          {[
            { label: 'Total KRAs', value: departments.reduce((s, d) => s + d.kras.length, 0) },
            { label: 'Updated',    value: Object.keys(updates).length },
          ].map(x => (
            <div key={x.label} className="bg-white/10 rounded-lg px-3 py-2">
              <p className="font-bold text-lg">{x.value}</p>
              <p className="text-indigo-200 text-xs">{x.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Department Tabs */}
      <div className="flex gap-2 flex-wrap">
        {departments.map(d => {
          const dUpdated  = d.kras.filter(k => updates[k.id]).length;
          const dOffTrack = d.kras.filter(k => updates[k.id]?.status === 'red').length;
          const dAtRisk   = d.kras.filter(k => updates[k.id]?.status === 'amber').length;
          return (
            <button
              key={d.id}
              onClick={() => setActiveDept(d.id)}
              className={`relative text-xs font-semibold px-3 py-2 rounded-lg border transition-all ${
                activeDept === d.id
                  ? `${d.badgeClass} ring-1 ring-offset-1`
                  : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'
              }`}
            >
              {d.name}
              <span className="ml-1.5 opacity-60">({d.kras.length})</span>
              {dOffTrack > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />}
              {dOffTrack === 0 && dAtRisk > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-amber-500 rounded-full" />}
              {dOffTrack === 0 && dAtRisk === 0 && dUpdated > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full" />}
            </button>
          );
        })}
      </div>

      {/* Department Content */}
      <DepartmentPanel dept={dept} updates={updates} onEdit={kra => setEditingKRA(kra)} />

      {/* Edit Modal */}
      {editingKRA && (
        <KRAEditModal
          kra={editingKRA}
          existing={getKRA(editingKRA.id)}
          onSave={updateKRA}
          onClear={() => clearKRA(editingKRA.id)}
          onClose={() => setEditingKRA(null)}
        />
      )}
    </div>
  );
}
