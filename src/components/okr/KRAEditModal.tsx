import { useState } from 'react';
import { X, CheckCircle, AlertTriangle, XCircle, Save, Trash2 } from 'lucide-react';
import { KRA } from '../../data/okrData';
import { KRAUpdate } from '../../store/useOKRStore';

interface Props {
  kra: KRA;
  existing: KRAUpdate | null;
  onSave: (update: KRAUpdate) => void;
  onClear: () => void;
  onClose: () => void;
}

const STATUS_OPTIONS = [
  { value: 'green' as const,   label: 'On Track',  icon: CheckCircle,  bg: 'bg-emerald-500', border: 'border-emerald-500', light: 'bg-emerald-50 border-emerald-300 text-emerald-700' },
  { value: 'amber' as const,   label: 'At Risk',   icon: AlertTriangle, bg: 'bg-amber-500',   border: 'border-amber-500',   light: 'bg-amber-50 border-amber-300 text-amber-700' },
  { value: 'red' as const,     label: 'Off Track', icon: XCircle,      bg: 'bg-red-500',     border: 'border-red-500',     light: 'bg-red-50 border-red-300 text-red-700' },
];

export function KRAEditModal({ kra, existing, onSave, onClear, onClose }: Props) {
  const [status, setStatus] = useState<'green' | 'amber' | 'red'>(
    (existing?.status as 'green' | 'amber' | 'red') ?? 'green'
  );
  const [progress, setProgress] = useState(existing?.progress ?? 0);
  const [blockerNote, setBlockerNote] = useState(existing?.blockerNote ?? '');
  const [decisionNeeded, setDecisionNeeded] = useState(existing?.decisionNeeded ?? '');

  const handleSave = () => {
    onSave({
      kraId: kra.id,
      status,
      progress,
      blockerNote,
      decisionNeeded,
      updatedAt: new Date().toISOString(),
    });
    onClose();
  };

  const progressColor =
    progress >= 70 ? 'bg-emerald-500' :
    progress >= 40 ? 'bg-amber-500' : 'bg-red-500';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
        {/* Header */}
        <div className="flex items-start justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex-1 min-w-0 pr-3">
            <p className="text-xs font-semibold text-slate-400 mb-1">UPDATE KRA STATUS</p>
            <p className="text-sm font-semibold text-slate-800 leading-snug">{kra.title}</p>
            <p className="text-xs text-slate-400 mt-1">Owner: {kra.owner} · Due: {kra.dueDate}</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex-shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-5">
          {/* RAG Status */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">STATUS</label>
            <div className="grid grid-cols-3 gap-2">
              {STATUS_OPTIONS.map(opt => {
                const Icon = opt.icon;
                const selected = status === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setStatus(opt.value)}
                    className={`flex flex-col items-center gap-2 py-3 rounded-xl border-2 transition-all ${
                      selected ? `${opt.light} ${opt.border} ring-2 ring-offset-1 ring-${opt.value === 'green' ? 'emerald' : opt.value === 'amber' ? 'amber' : 'red'}-400` : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <Icon size={20} className={selected ? '' : 'text-slate-400'} />
                    <span className={`text-xs font-semibold ${selected ? '' : 'text-slate-400'}`}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-600">PROGRESS</label>
              <span className="text-lg font-bold text-slate-800">{progress}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={progress}
              onChange={e => setProgress(Number(e.target.value))}
              className="w-full accent-slate-700"
            />
            <div className="mt-2 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${progressColor}`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Blocker Note */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">
              BLOCKER / RISK NOTE <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={blockerNote}
              onChange={e => setBlockerNote(e.target.value)}
              placeholder="What is blocking progress or at risk?"
              rows={2}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
            />
          </div>

          {/* Decision Needed */}
          <div>
            <label className="text-xs font-semibold text-slate-600 block mb-2">
              DECISION / HELP NEEDED FROM LEADERSHIP <span className="text-slate-400 font-normal">(optional)</span>
            </label>
            <textarea
              value={decisionNeeded}
              onChange={e => setDecisionNeeded(e.target.value)}
              placeholder="What decision or support do you need?"
              rows={2}
              className="w-full text-sm border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-slate-200 flex items-center justify-between">
          {existing ? (
            <button
              onClick={() => { onClear(); onClose(); }}
              className="flex items-center gap-1.5 text-xs text-red-500 hover:text-red-700"
            >
              <Trash2 size={13} /> Clear update
            </button>
          ) : <div />}
          <div className="flex gap-2">
            <button onClick={onClose} className="text-sm px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 text-sm px-4 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700"
            >
              <Save size={14} /> Save Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
