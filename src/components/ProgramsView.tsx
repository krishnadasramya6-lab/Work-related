import { useState } from 'react';
import { Plus, Edit2, Trash2, Layers } from 'lucide-react';
import { Program, Task, Status } from '../types';
import {
  uid, STATUS_COLORS, STATUS_LABELS, PROGRAM_PHASES,
} from '../utils/helpers';
import { Badge } from './Badge';
import { Modal } from './Modal';

const PROGRAM_COLORS = [
  '#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626',
  '#0891b2', '#be185d', '#65a30d', '#9333ea', '#0f766e',
];

interface Props {
  programs: Program[];
  tasks: Task[];
  onAdd: (p: Program) => void;
  onUpdate: (p: Program) => void;
  onDelete: (id: string) => void;
}

const EMPTY: Omit<Program, 'id' | 'createdAt'> = {
  name: '',
  description: '',
  phase: PROGRAM_PHASES[0],
  status: 'in_progress',
  therapeuticArea: '',
  color: PROGRAM_COLORS[0],
};

function ProgramForm({
  initial, onSave, onCancel,
}: { initial: Partial<Program>; onSave: (p: Program) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    const now = new Date().toISOString();
    onSave({ ...form, id: (initial as Program).id || uid(), createdAt: (initial as Program).createdAt || now } as Program);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Program Name *</label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          value={form.name}
          onChange={e => set('name', e.target.value)}
          placeholder="e.g. CardioSense 3.0"
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
          placeholder="Brief description of the program"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Therapeutic Area</label>
          <input
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.therapeuticArea}
            onChange={e => set('therapeuticArea', e.target.value)}
            placeholder="e.g. Cardiology"
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Phase</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.phase}
            onChange={e => set('phase', e.target.value)}
          >
            {PROGRAM_PHASES.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
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
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Color</label>
          <div className="flex flex-wrap gap-1.5 mt-1">
            {PROGRAM_COLORS.map(c => (
              <button
                key={c}
                type="button"
                onClick={() => set('color', c)}
                className={`w-6 h-6 rounded-full border-2 transition-transform ${form.color === c ? 'border-slate-600 scale-110' : 'border-transparent hover:scale-105'}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">Save Program</button>
      </div>
    </form>
  );
}

export function ProgramsView({ programs, tasks, onAdd, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<Partial<Program> | null>(null);

  const taskCount = (programId: string) =>
    tasks.filter(t => t.programId === programId && t.status !== 'done' && t.status !== 'cancelled').length;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Programs</h1>
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700"
        >
          <Plus size={16} /> New Program
        </button>
      </div>

      {programs.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl py-16 text-center text-slate-400">
          <Layers size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No programs yet. Create your first program.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {programs.map(prog => (
          <div key={prog.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition-shadow">
            <div className="h-1.5" style={{ backgroundColor: prog.color }} />
            <div className="p-5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: prog.color }} />
                  <h3 className="font-semibold text-slate-800 text-sm">{prog.name}</h3>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => setEditing(prog)} className="p-1.5 text-slate-400 hover:text-brand-600 rounded hover:bg-brand-50">
                    <Edit2 size={13} />
                  </button>
                  <button onClick={() => onDelete(prog.id)} className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
              {prog.description && (
                <p className="text-xs text-slate-500 mt-2 line-clamp-2">{prog.description}</p>
              )}
              <div className="flex flex-wrap gap-1.5 mt-3">
                <Badge className={STATUS_COLORS[prog.status]}>{STATUS_LABELS[prog.status]}</Badge>
                {prog.therapeuticArea && (
                  <Badge className="bg-slate-100 text-slate-500">{prog.therapeuticArea}</Badge>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span className="font-medium text-slate-600">{prog.phase}</span>
                <span>{taskCount(prog.id)} open task{taskCount(prog.id) !== 1 ? 's' : ''}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <Modal title={editing.id ? 'Edit Program' : 'New Program'} onClose={() => setEditing(null)}>
          <ProgramForm
            initial={editing}
            onSave={p => { editing.id ? onUpdate(p) : onAdd(p); setEditing(null); }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
