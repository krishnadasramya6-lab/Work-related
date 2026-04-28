import { useState, useMemo } from 'react';
import { Plus, Search, CheckCircle2, Circle, Clock, Filter, Trash2, Edit2 } from 'lucide-react';
import { Task, Program, Project, Priority, Status, TaskCategory } from '../types';
import {
  uid, formatDate, isOverdue, isDueToday,
  PRIORITY_COLORS, PRIORITY_DOT, STATUS_COLORS, STATUS_LABELS,
  CATEGORY_LABELS, CATEGORY_COLORS,
  PROGRAM_PHASES,
} from '../utils/helpers';
import { Badge } from './Badge';
import { Modal } from './Modal';

interface Props {
  tasks: Task[];
  programs: Program[];
  projects: Project[];
  onAdd: (t: Task) => void;
  onUpdate: (t: Task) => void;
  onDelete: (id: string) => void;
}

const EMPTY_TASK: Omit<Task, 'id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  description: '',
  category: 'task',
  priority: 'medium',
  status: 'todo',
  programId: '',
  projectId: '',
  dueDate: '',
  dueTime: '',
  owner: '',
  tags: [],
};

function TaskForm({
  initial,
  programs,
  projects,
  onSave,
  onCancel,
}: {
  initial: Partial<Task>;
  programs: Program[];
  projects: Project[];
  onSave: (t: Task) => void;
  onCancel: () => void;
}) {
  const [form, setForm] = useState({ ...EMPTY_TASK, ...initial });
  const [tagInput, setTagInput] = useState('');

  const filteredProjects = projects.filter(p => p.programId === form.programId);

  const set = (k: keyof typeof form, v: unknown) =>
    setForm(f => ({ ...f, [k]: v }));

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !form.tags.includes(t)) {
      set('tags', [...form.tags, t]);
    }
    setTagInput('');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    const now = new Date().toISOString();
    onSave({
      ...form,
      id: (initial as Task).id || uid(),
      createdAt: (initial as Task).createdAt || now,
      updatedAt: now,
    } as Task);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Title *</label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="Task title"
          required
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Description</label>
        <textarea
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 focus:border-brand-500 outline-none resize-none"
          rows={2}
          value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Additional context"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Category</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.category}
            onChange={e => set('category', e.target.value as TaskCategory)}
          >
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
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
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Status</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.status}
            onChange={e => set('status', e.target.value as Status)}
          >
            {Object.entries(STATUS_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
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
        <label className="block text-xs font-medium text-slate-600 mb-1">Owner / Responsible</label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          value={form.owner || ''}
          onChange={e => set('owner', e.target.value)}
          placeholder="e.g. John Smith, RA Team"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Tags</label>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={tagInput}
            onChange={e => setTagInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            placeholder="Add tag + Enter"
          />
          <button type="button" onClick={addTag} className="px-3 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">+</button>
        </div>
        {form.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {form.tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                {tag}
                <button type="button" onClick={() => set('tags', form.tags.filter(t => t !== tag))}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700"
        >
          Save Task
        </button>
      </div>
    </form>
  );
}

export function TasksView({ tasks, programs, projects, onAdd, onUpdate, onDelete }: Props) {
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<Status | ''>('');
  const [filterPriority, setFilterPriority] = useState<Priority | ''>('');
  const [filterCategory, setFilterCategory] = useState<TaskCategory | ''>('');
  const [filterProgram, setFilterProgram] = useState('');
  const [showDone, setShowDone] = useState(false);
  const [editing, setEditing] = useState<Partial<Task> | null>(null);

  const filtered = useMemo(() => {
    return tasks.filter(t => {
      if (!showDone && (t.status === 'done' || t.status === 'cancelled')) return false;
      if (search && !t.title.toLowerCase().includes(search.toLowerCase()) &&
        !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      if (filterStatus && t.status !== filterStatus) return false;
      if (filterPriority && t.priority !== filterPriority) return false;
      if (filterCategory && t.category !== filterCategory) return false;
      if (filterProgram && t.programId !== filterProgram) return false;
      return true;
    }).sort((a, b) => {
      const p = { critical: 0, high: 1, medium: 2, low: 3 };
      if (p[a.priority] !== p[b.priority]) return p[a.priority] - p[b.priority];
      if (a.dueDate && b.dueDate) return a.dueDate.localeCompare(b.dueDate);
      if (a.dueDate) return -1;
      if (b.dueDate) return 1;
      return 0;
    });
  }, [tasks, search, filterStatus, filterPriority, filterCategory, filterProgram, showDone]);

  const toggleDone = (task: Task) => {
    onUpdate({
      ...task,
      status: task.status === 'done' ? 'todo' : 'done',
      completedAt: task.status !== 'done' ? new Date().toISOString() : undefined,
      updatedAt: new Date().toISOString(),
    });
  };

  const progName = (id?: string) => programs.find(p => p.id === id)?.name;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Tasks</h1>
        <button
          onClick={() => setEditing({})}
          className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700 transition-colors"
        >
          <Plus size={16} /> New Task
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 bg-white border border-slate-200 rounded-xl p-3">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
          <input
            className="pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none w-48"
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
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
        <select
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value as Status | '')}
        >
          <option value="">All statuses</option>
          {Object.entries(STATUS_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value as TaskCategory | '')}
        >
          <option value="">All categories</option>
          {Object.entries(CATEGORY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <select
          className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none"
          value={filterProgram}
          onChange={e => setFilterProgram(e.target.value)}
        >
          <option value="">All programs</option>
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <button
          onClick={() => setShowDone(v => !v)}
          className={`px-3 py-2 text-sm border rounded-lg transition-colors ${showDone ? 'bg-brand-50 border-brand-300 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
        >
          {showDone ? '✓ Showing done' : 'Show done'}
        </button>
      </div>

      {/* Task list */}
      <div className="bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
        {filtered.length === 0 && (
          <div className="py-12 text-center text-slate-400 text-sm">
            No tasks match your filters.
          </div>
        )}
        {filtered.map(task => (
          <div
            key={task.id}
            className={`flex items-start gap-3 px-4 py-3 hover:bg-slate-50 group transition-colors ${
              task.status === 'done' ? 'opacity-60' : ''
            }`}
          >
            <button
              onClick={() => toggleDone(task)}
              className="mt-0.5 text-slate-300 hover:text-green-500 transition-colors flex-shrink-0"
            >
              {task.status === 'done'
                ? <CheckCircle2 size={18} className="text-green-500" />
                : <Circle size={18} />}
            </button>
            <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority]}`} />
            <div className="flex-1 min-w-0">
              <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                {task.title}
              </p>
              {task.description && (
                <p className="text-xs text-slate-400 mt-0.5 truncate">{task.description}</p>
              )}
              <div className="flex flex-wrap items-center gap-1.5 mt-1">
                <Badge className={CATEGORY_COLORS[task.category]}>
                  {CATEGORY_LABELS[task.category]}
                </Badge>
                <Badge className={PRIORITY_COLORS[task.priority]}>{task.priority}</Badge>
                {task.programId && progName(task.programId) && (
                  <Badge className="bg-slate-100 text-slate-500">{progName(task.programId)}</Badge>
                )}
                {task.dueDate && (
                  <span className={`text-xs flex items-center gap-1 ${
                    isOverdue(task.dueDate) && task.status !== 'done' ? 'text-red-600 font-medium' :
                    isDueToday(task.dueDate) && task.status !== 'done' ? 'text-orange-500 font-medium' :
                    'text-slate-400'
                  }`}>
                    <Clock size={11} />
                    {isOverdue(task.dueDate) && task.status !== 'done'
                      ? `Overdue · ${formatDate(task.dueDate)}`
                      : formatDate(task.dueDate)}
                  </span>
                )}
                {task.owner && (
                  <span className="text-xs text-slate-400">→ {task.owner}</span>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Badge className={STATUS_COLORS[task.status]}>{STATUS_LABELS[task.status]}</Badge>
              <button
                onClick={() => setEditing(task)}
                className="p-1.5 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50"
              >
                <Edit2 size={14} />
              </button>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <Modal
          title={editing.id ? 'Edit Task' : 'New Task'}
          onClose={() => setEditing(null)}
        >
          <TaskForm
            initial={editing}
            programs={programs}
            projects={projects}
            onSave={t => { editing.id ? onUpdate(t) : onAdd(t); setEditing(null); }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
