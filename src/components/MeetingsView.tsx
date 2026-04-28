import { useState } from 'react';
import { Plus, Edit2, Trash2, CalendarDays, Clock, Users, FileText } from 'lucide-react';
import { Meeting, Program, MeetingType } from '../types';
import { uid, formatDate, MEETING_TYPE_LABELS } from '../utils/helpers';
import { Badge } from './Badge';
import { Modal } from './Modal';

interface Props {
  meetings: Meeting[];
  programs: Program[];
  onAdd: (m: Meeting) => void;
  onUpdate: (m: Meeting) => void;
  onDelete: (id: string) => void;
}

const MEETING_COLORS: Record<MeetingType, string> = {
  strategic: 'bg-brand-50 text-brand-700',
  steering: 'bg-purple-50 text-purple-700',
  cross_functional: 'bg-emerald-50 text-emerald-700',
  regulatory: 'bg-amber-50 text-amber-700',
  one_on_one: 'bg-slate-100 text-slate-600',
  other: 'bg-slate-100 text-slate-500',
};

const EMPTY: Omit<Meeting, 'id' | 'createdAt'> = {
  title: '',
  type: 'strategic',
  date: '',
  time: '09:00',
  duration: 60,
  programId: '',
  attendees: [],
  agenda: '',
  notes: '',
  actionItems: [],
};

function MeetingForm({
  initial, programs, onSave, onCancel,
}: { initial: Partial<Meeting>; programs: Program[]; onSave: (m: Meeting) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial });
  const [attendeeInput, setAttendeeInput] = useState('');
  const [actionInput, setActionInput] = useState('');
  const set = (k: keyof typeof form, v: unknown) => setForm(f => ({ ...f, [k]: v }));

  const addAttendee = () => {
    const a = attendeeInput.trim();
    if (a && !form.attendees.includes(a)) set('attendees', [...form.attendees, a]);
    setAttendeeInput('');
  };
  const addAction = () => {
    const a = actionInput.trim();
    if (a) set('actionItems', [...form.actionItems, a]);
    setActionInput('');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.date) return;
    const now = new Date().toISOString();
    onSave({ ...form, id: (initial as Meeting).id || uid(), createdAt: (initial as Meeting).createdAt || now } as Meeting);
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Meeting Title *</label>
        <input
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
          value={form.title}
          onChange={e => set('title', e.target.value)}
          placeholder="e.g. Steering Committee Q2"
          required
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Type</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.type}
            onChange={e => set('type', e.target.value as MeetingType)}
          >
            {Object.entries(MEETING_TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Program</label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.programId || ''}
            onChange={e => set('programId', e.target.value)}
          >
            <option value="">— None —</option>
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Date *</label>
          <input
            type="date"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.date}
            onChange={e => set('date', e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Time</label>
          <input
            type="time"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.time}
            onChange={e => set('time', e.target.value)}
          />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">Duration (min)</label>
          <input
            type="number"
            min={15}
            step={15}
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={form.duration}
            onChange={e => set('duration', Number(e.target.value))}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Attendees</label>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={attendeeInput}
            onChange={e => setAttendeeInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAttendee(); } }}
            placeholder="Add attendee + Enter"
          />
          <button type="button" onClick={addAttendee} className="px-3 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">+</button>
        </div>
        {form.attendees.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {form.attendees.map(a => (
              <span key={a} className="flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs">
                {a}
                <button type="button" onClick={() => set('attendees', form.attendees.filter(x => x !== a))}>×</button>
              </span>
            ))}
          </div>
        )}
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Agenda</label>
        <textarea
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
          rows={2}
          value={form.agenda}
          onChange={e => set('agenda', e.target.value)}
          placeholder="Meeting agenda / objectives"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Notes / Minutes</label>
        <textarea
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none resize-none"
          rows={3}
          value={form.notes}
          onChange={e => set('notes', e.target.value)}
          placeholder="Meeting notes..."
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-slate-600 mb-1">Action Items</label>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-brand-500 outline-none"
            value={actionInput}
            onChange={e => setActionInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addAction(); } }}
            placeholder="Add action item + Enter"
          />
          <button type="button" onClick={addAction} className="px-3 py-2 bg-slate-100 rounded-lg text-sm hover:bg-slate-200">+</button>
        </div>
        {form.actionItems.length > 0 && (
          <ul className="mt-2 space-y-1">
            {form.actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5">
                <span className="flex-1">• {item}</span>
                <button type="button" onClick={() => set('actionItems', form.actionItems.filter((_, j) => j !== i))} className="text-slate-400 hover:text-red-500">×</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex gap-2 pt-2 border-t border-slate-100">
        <button type="button" onClick={onCancel} className="flex-1 px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-600 hover:bg-slate-50">Cancel</button>
        <button type="submit" className="flex-1 px-4 py-2 bg-brand-600 text-white rounded-lg text-sm font-medium hover:bg-brand-700">Save Meeting</button>
      </div>
    </form>
  );
}

export function MeetingsView({ meetings, programs, onAdd, onUpdate, onDelete }: Props) {
  const [editing, setEditing] = useState<Partial<Meeting> | null>(null);
  const [showPast, setShowPast] = useState(false);
  const today = new Date().toISOString().split('T')[0];

  const sorted = [...meetings]
    .filter(m => showPast ? true : m.date >= today)
    .sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  const progName = (id?: string) => programs.find(p => p.id === id)?.name;

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-800">Meetings</h1>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowPast(v => !v)}
            className={`px-3 py-2 text-sm border rounded-lg transition-colors ${showPast ? 'bg-brand-50 border-brand-300 text-brand-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}
          >
            {showPast ? 'Showing all' : 'Show past'}
          </button>
          <button
            onClick={() => setEditing({})}
            className="flex items-center gap-2 bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-brand-700"
          >
            <Plus size={16} /> New Meeting
          </button>
        </div>
      </div>

      {sorted.length === 0 && (
        <div className="bg-white border border-slate-200 rounded-xl py-16 text-center text-slate-400">
          <CalendarDays size={32} className="mx-auto mb-3 opacity-40" />
          <p className="text-sm">No upcoming meetings.</p>
        </div>
      )}

      <div className="space-y-3">
        {sorted.map(mtg => (
          <div key={mtg.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-slate-800">{mtg.title}</h3>
                  <Badge className={MEETING_COLORS[mtg.type]}>{MEETING_TYPE_LABELS[mtg.type]}</Badge>
                  {mtg.programId && progName(mtg.programId) && (
                    <Badge className="bg-slate-100 text-slate-500">{progName(mtg.programId)}</Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <CalendarDays size={12} /> {formatDate(mtg.date)}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {mtg.time} · {mtg.duration}m
                  </span>
                  {mtg.attendees.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Users size={12} /> {mtg.attendees.join(', ')}
                    </span>
                  )}
                </div>
                {mtg.agenda && (
                  <p className="text-xs text-slate-500 mt-2 line-clamp-1">
                    <span className="font-medium text-slate-600">Agenda: </span>{mtg.agenda}
                  </p>
                )}
                {mtg.actionItems.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs font-medium text-slate-600 flex items-center gap-1 mb-1">
                      <FileText size={11} /> Action items ({mtg.actionItems.length})
                    </p>
                    <ul className="space-y-0.5">
                      {mtg.actionItems.map((item, i) => (
                        <li key={i} className="text-xs text-slate-500">• {item}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-1 flex-shrink-0">
                <button onClick={() => setEditing(mtg)} className="p-2 text-slate-400 hover:text-brand-600 rounded-lg hover:bg-brand-50">
                  <Edit2 size={14} />
                </button>
                <button onClick={() => onDelete(mtg.id)} className="p-2 text-slate-400 hover:text-red-600 rounded-lg hover:bg-red-50">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing !== null && (
        <Modal title={editing.id ? 'Edit Meeting' : 'New Meeting'} onClose={() => setEditing(null)} wide>
          <MeetingForm
            initial={editing}
            programs={programs}
            onSave={m => { editing.id ? onUpdate(m) : onAdd(m); setEditing(null); }}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}
    </div>
  );
}
