import { useState } from 'react';
import { Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { Project, Program, Task, Status } from '../types';
import { uid, formatDate, isOverdue, STATUS_COLORS, STATUS_LABELS } from '../utils/helpers';
import { Badge } from './Badge';
import { Modal } from './Modal';

interface Props {
  projects: Project[];
  programs: Program[];
  tasks: Task[];
  onAdd: (p: Project) => void;
  onUpdate: (p: Project) => void;
  onDelete: (id: string) => void;
}

const EMPTY: Omit<Project, 'id' | 'createdAt'> = {
  programId: '',
  name: '',
  description: '',
  status: 'todo',
  dueDate: '',
};

function ProjectForm({
  initial, programs, onSave, onCancel,
}: { initial: Partial<Project>; programs: Program[]; onSave: (p: Project) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const now = new Date().toISOString();
    onSave({ ...form, id: (initial as Project).id || uid(), createdAt: (initial as Project).createdAt || now } as Project);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Project Name *</label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="e.g. Biocompatibility Testing"
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
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Program</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.programId}
            onChange={e => set('programId', e.target.value)}
          >
            <option value="">— None —</option>
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
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
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">Save Project</button>
      </div>
    </form>
  );
}

export function ProjectsView({ projects, programs, tasks, onAdd, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<Partial<Project> | null>(null);
  const [filterProgram, setFilterProgram] = useState('');

  const filtered = projects.filter(p => !filterProgram || p.programId === filterProgram);

  const taskCount = (projectId: string) =>
    tasks.filter(t => t.projectId === projectId && t.status !== 'done' && t.status !== 'cancelled').length;

  const progName = (id: string) => programs.find(p => p.id === id)?.name || '—';
  const progColor = (id: string) => programs.find(p => p.id === id)?.color || '#94a3b8';

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Projects</h1>
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700"
        >
          <Plus size={16} /> New Project
        </button>
      </div>

      <div className="flex gap-2">
        <select
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          value={filterProgram}
          onChange={e => setFilterProgram(e.target.value)}
        >
          <option value="">All programs</option>
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      {filtered.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl py-16 text-center text-slate-400">
          <FolderOpen size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No projects yet.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(proj => (
          <div key={proj.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
            <div className="h-1" style={{ backgroundColor: progColor(proj.programId) }} />
            <div className="p-5">
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-slate-800 text-sm flex-1">{proj.name}</h3>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(proj)} className="p-1.5 text-slate-400 hover:text-brand-600 rounded hover:bg-brand-50">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => onDelete(proj.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {proj.description && (
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{proj.description}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge className={STATUS_COLORS[proj.status]}>{STATUS_LABELS[proj.status]}</Badge>
                {proj.programId && (
                  <Badge className="bg-slate-100 text-slate-500">{progName(proj.programId)}</Badge>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>{taskCount(proj.id)} open task{taskCount(proj.id) !== 1 ? 's' : ''}</span>
                {proj.dueDate && (
                  <span className={isOverdue(proj.dueDate) ? 'text-red-600 font-medium' : ''}>
                    Due {formatDate(proj.dueDate)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <Modal title={editing.id ? 'Edit Project' : 'New Project'} onClose={() => setEditing(null)}>
          <ProjectForm
            initial={editing}
            programs={programs}
            onSave={p => { editing.id ? onUpdate(p) : onAdd(p); setEditing(null); }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
