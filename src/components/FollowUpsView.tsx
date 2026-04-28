import { useState, useMemo } from 'react';
import { Plus, Edit2, Trash2, AlarmClock, CheckCircle2, Circle } from 'lucide-react';
import { FollowUp, Program, Project, Priority, Status } from '../types';
import {
  uid, formatDate, isOverdue, isDueToday,
  PRIORITY_COLORS, PRIORITY_DOT, STATUS_COLORS, STATUS_LABELS,
} from '../utils/helpers';
import { Badge } from './Badge';
import { Modal } from './Modal';

interface Props {
  followUps: FollowUp[];
  programs: Program[];
  projects: Project[];
  onAdd: (f: FollowUp) => void;
  onUpdate: (f: FollowUp) => void;
  onDelete: (id: string) => void;
}

const EMPTY: Omit<FollowUp, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  dueDate: '',
  priority: 'medium',
  status: 'todo',
  programId: '',
  projectId: '',
  assignedTo: '',
};

function FollowUpForm({
  initial, programs, projects, onSave, onCancel,
}: {
  initial: Partial<FollowUp>; programs: Program[]; projects: Project[];
  onSave: (f: FollowUp) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));
  const filteredProjects = projects.filter(p => p.programId === form.programId);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const now = new Date().toISOString();
    onSave({
      ...form,
      id: (initial as FollowUp).id || uid(),
      createdAt: (initial as FollowUp).createdAt || now,
      updatedAt: now,
    } as FollowUp);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="e.g. FDA response to pre-sub request"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
        <textarea
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
          rows={2}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Context and details"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Priority</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.priority}
            onChange={e => set('priority', e.target.value as Priority)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.status}
            onChange={e => set('status', e.target.value as Status)}
          >
            {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Due Date</label>
        <input
          type="date"
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          value={form.dueDate || ''}
          onChange={e => set('dueDate', e.target.value)}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Program</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.programId || ''}
            onChange={e => { set('programId', e.target.value); set('projectId', ''); }}
          >
            <option value="">— None —</option>
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Project</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.projectId || ''}
            onChange={e => set('projectId', e.target.value)}
            disabled={!form.programId}
          >
            <option value="">— None —</option>
            {filteredProjects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Assigned To / Awaiting From</label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          value={form.assignedTo || ''}
          onChange={e => set('assignedTo', e.target.value)}
          placeholder="e.g. FDA, Legal, CRO Partner"
        />
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">Save Follow-up</button>
      </div>
    </form>
  );
}

export function FollowUpsView({ followUps, programs, projects, onAdd, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<Partial<FollowUp> | null>(null);
  const [showDone, setShowDone] = useState(false);
  const [filterProgram, setFilterProgram] = useState('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');

  const filtered = useMemo(() => {
    return followUps
      .filter(f => {
        if (!showDone && (f.status === 'done' || f.status === 'cancelled')) return false;
        if (filterProgram && f.programId !== filterProgram) return false;
        if (filterPriority && f.priority !== filterPriority) return false;
        return true;
      })
      .sort((a, b) => {
        const p = { critical: 0, high: 1, medium: 2, low: 3 };
        if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority];
        if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
        if (a.dueDate) return -1;
        if (b.dueDate) return 1;
        return 0;
      });
  }, [followUps, showDone, filterProgram, filterPriority]);

  const toggleDone = (fu: FollowUp) => {
    onUpdate({
      ...fu,
      status: fu.status === 'done' ? 'todo' : 'done',
      updatedAt: new Date().toISOString(),
    });
  };

  const progName = (id?: string) => programs.find(p => p.id === id)?.name;

  const overdue = filtered.filter(f => isOverdue(f.dueDate) && f.status !== 'done' && f.status !== 'cancelled');
  const dueToday = filtered.filter(f => isDueToday(f.dueDate) && f.status !== 'done' && f.status !== 'cancelled');

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Follow-ups</h1>
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700"
        >
          <Plus size={16} /> New Follow-up
        </button>
      </div>

      {/* Alert banners */}
      {overdue.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
          <strong>{overdue.length}</strong> overdue follow-up{overdue.length > 1 ? 's' : ''}: {overdue.map(f => f.title).join(', ')}
        </div>
      )}
      {dueToday.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-700">
          <strong>{dueToday.length}</strong> follow-up{dueToday.length > 1 ? 's' : ''} due today: {dueToday.map(f => f.title).join(', ')}
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2 bg-white border border-slate-200 rounded-xl p-3">
        <select
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          value={filterProgram}
          onChange={e => setFilterProgram(e.target.value)}
        >
          <option value="">All programs</option>
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          value={filterPriority}
          onChange={e => setFilterPriority(e.target.value as Priority | '')}
        >
          <option value="">All priorities</option>
          <option value="critical">Critical</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button
          onClick={() => setShowDone(v => !v)}
          className={`px-3 py-2 text-sm border rounded-lg transition-colors ${showDone ? 'bg-brand-50 border-brand-300 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
        >
          {showDone ? '✓ Showing resolved' : 'Show resolved'}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400">
            <AlarmClock size={28} className="mx-auto mb-2 opacity-40" />
            <p className="text-sm">No follow-ups match your filters.</p>
          </div>
        )}
        {filtered.map(fu => (
          <div
            key={fu.id}
            className={`flex items-start gap-3 px-4 py-3.5 hover:bg-slate-50 group transition-colors ${fu.status === 'done' ? 'opacity-60' : ''}`}
          >
            <button
              onClick={() => toggleDone(fu)}
              className="mt-0.5 text-slate-300 hover:text-green-500 transition-colors flex-shrink-0"
            >
              {fu.status === 'done'
                ? <CheckCircle2 size={18} className="text-green-500" />
                : <Circle size={18} />}
            </button>
            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[fu.priority]}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${fu.status === 'done' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {fu.title}
              </p>
              {fu.description && (
                <p className="text-xs text-slate-400 mt-0.5 truncate">{fu.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <Badge className={PRIORITY_COLORS[fu.priority]}>{fu.priority}</Badge>
                {fu.programId && progName(fu.programId) && (
                  <Badge className="bg-slate-100 text-slate-500">{progName(fu.programId)}</Badge>
                )}
                {fu.assignedTo && (
                  <span className="text-xs text-slate-400">→ {fu.assignedTo}</span>
                )}
                {fu.dueDate && (
                  <span className={`text-xs ${
                    isOverdue(fu.dueDate) && fu.status !== 'done' ? 'text-red-600 font-medium' :
                    isDueToday(fu.dueDate) && fu.status !== 'done' ? 'text-orange-500 font-medium' :
                    'text-slate-400'
                  }`}>
                    {isOverdue(fu.dueDate) && fu.status !== 'done'
                      ? `Overdue · ${formatDate(fu.dueDate)}`
                      : `Due ${formatDate(fu.dueDate)}`}
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge className={STATUS_COLORS[fu.status]}>{STATUS_LABELS[fu.status]}</Badge>
              <button onClick={() => setEditing(fu)} className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50">
                <Edit2 size={14} />
              </button>
              <button onClick={() => onDelete(fu.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <Modal title={editing.id ? 'Edit Follow-up' : 'New Follow-up'} onClose={() => setEditing(null)}>
          <FollowUpForm
            initial={editing}
            programs={programs}
            projects={projects}
            onSave={f => { editing.id ? onUpdate(f) : onAdd(f); setEditing(null); }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
