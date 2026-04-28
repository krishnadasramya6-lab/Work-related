import { Priority, Status, TaskCategory, MeetingType } from '../types';

export function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function todayStr() {
  return new Date().toISOString().split('T')[0];
}

export function isOverdue(dueDate?: string) {
  if (!dueDate) return false;
  return dueDate < todayStr();
}

export function isDueToday(dueDate?: string) {
  if (!dueDate) return false;
  return dueDate === todayStr();
}

export function isDueSoon(dueDate?: string, days = 3) {
  if (!dueDate) return false;
  const d = new Date(dueDate + 'T00:00:00');
  const diff = (d.getTime() - Date.now()) / 86400000;
  return diff >= 0 && diff <= days;
}

export function formatDate(iso?: string) {
  if (!iso) return '—';
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatDateTime(date: string, time: string) {
  const d = new Date(`${date}T${time}`);
  return d.toLocaleString('en-US', {
    month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit',
  });
}

export const PRIORITY_LABELS: Record<Priority, string> = {
  low: 'Low', medium: 'Medium', high: 'High', critical: 'Critical',
};

export const PRIORITY_COLORS: Record<Priority, string> = {
  low: 'bg-slate-100 text-slate-600',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export const PRIORITY_DOT: Record<Priority, string> = {
  low: 'bg-slate-400',
  medium: 'bg-yellow-400',
  high: 'bg-orange-400',
  critical: 'bg-red-500',
};

export const STATUS_LABELS: Record<Status, string> = {
  todo: 'To Do',
  in_progress: 'In Progress',
  blocked: 'Blocked',
  done: 'Done',
  cancelled: 'Cancelled',
};

export const STATUS_COLORS: Record<Status, string> = {
  todo: 'bg-slate-100 text-slate-600',
  in_progress: 'bg-blue-100 text-blue-700',
  blocked: 'bg-red-100 text-red-700',
  done: 'bg-green-100 text-green-700',
  cancelled: 'bg-slate-100 text-slate-400',
};

export const CATEGORY_LABELS: Record<TaskCategory, string> = {
  task: 'Task',
  follow_up: 'Follow-up',
  meeting_action: 'Meeting Action',
  milestone: 'Milestone',
  admin: 'Admin',
};

export const CATEGORY_COLORS: Record<TaskCategory, string> = {
  task: 'bg-blue-50 text-blue-700',
  follow_up: 'bg-purple-50 text-purple-700',
  meeting_action: 'bg-amber-50 text-amber-700',
  milestone: 'bg-emerald-50 text-emerald-700',
  admin: 'bg-slate-50 text-slate-600',
};

export const MEETING_TYPE_LABELS: Record<MeetingType, string> = {
  strategic: 'Strategic',
  steering: 'Steering Committee',
  cross_functional: 'Cross-functional',
  regulatory: 'Regulatory',
  one_on_one: '1:1',
  other: 'Other',
};

export const PROGRAM_PHASES = [
  'Concept & Feasibility',
  'Design & Development',
  'Design Verification',
  'Design Validation',
  'Regulatory Submission',
  'Regulatory Review',
  'Launch Preparation',
  'Post-Market Surveillance',
  'End of Life',
];
