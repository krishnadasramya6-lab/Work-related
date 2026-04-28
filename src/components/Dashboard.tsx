import { useMemo } from 'react';
import {
  CheckSquare, AlarmClock, CalendarDays, AlertTriangle,
  TrendingUp, Clock, CircleCheck, Circle,
} from 'lucide-react';
import { Task, Meeting, FollowUp, Program, View } from '../types';
import {
  formatDate, formatDateTime, isOverdue, isDueToday, isDueSoon,
  PRIORITY_COLORS, PRIORITY_DOT, STATUS_COLORS, STATUS_LABELS,
  CATEGORY_LABELS, CATEGORY_COLORS,
} from '../utils/helpers';
import { Badge } from './Badge';

interface Props {
  tasks: Task[];
  meetings: Meeting[];
  followUps: FollowUp[];
  programs: Program[];
  onNavigate: (v: View) => void;
}

function StatCard({
  label, value, sub, icon: Icon, color,
}: {
  label: string; value: number; sub?: string;
  icon: React.ElementType; color: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon size={22} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

export function Dashboard({ tasks, meetings, followUps, programs, onNavigate }: Props) {
  const today = new Date().toISOString().split('T')[0];

  const stats = useMemo(() => {
    const active = tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled');
    const overdueTasks = active.filter(t => isOverdue(t.dueDate));
    const todayTasks = active.filter(t => isDueToday(t.dueDate));
    const openFollowUps = followUps.filter(f => f.status !== 'done' && f.status !== 'cancelled');
    const overdueFollowUps = openFollowUps.filter(f => isOverdue(f.dueDate));
    const upcomingMeetings = meetings.filter(m => m.date >= today).slice(0, 3);
    return { overdueTasks, todayTasks, openFollowUps, overdueFollowUps, upcomingMeetings, active };
  }, [tasks, followUps, meetings, today]);

  const priorityTasks = useMemo(() =>
    tasks
      .filter(t => t.status !== 'done' && t.status !== 'cancelled')
      .sort((a, b) => {
        const p = { critical: 0, high: 1, medium: 2, low: 3 };
        return p[a.priority] - p[b.priority];
      })
      .slice(0, 5),
    [tasks]
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Good morning</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Today's tasks"
          value={stats.todayTasks.length}
          icon={CheckSquare}
          color="bg-blue-50 text-blue-600"
        />
        <StatCard
          label="Overdue items"
          value={stats.overdueTasks.length + stats.overdueFollowUps.length}
          icon={AlertTriangle}
          color={stats.overdueTasks.length + stats.overdueFollowUps.length > 0
            ? 'bg-red-50 text-red-600'
            : 'bg-slate-50 text-slate-400'}
        />
        <StatCard
          label="Open follow-ups"
          value={stats.openFollowUps.length}
          icon={AlarmClock}
          color="bg-purple-50 text-purple-600"
        />
        <StatCard
          label="Upcoming meetings"
          value={stats.upcomingMeetings.length}
          icon={CalendarDays}
          color="bg-emerald-50 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority tasks */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 flex items-center gap-2">
              <TrendingUp size={16} className="text-brand-600" />
              Priority Tasks
            </h2>
            <button
              onClick={() => onNavigate('tasks')}
              className="text-xs text-brand-600 hover:underline"
            >
              View all →
            </button>
          </div>
          <ul className="divide-y divide-slate-50">
            {priorityTasks.length === 0 && (
              <li className="px-5 py-6 text-center text-slate-400 text-sm">
                All caught up!
              </li>
            )}
            {priorityTasks.map(task => (
              <li key={task.id} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50 transition-colors">
                <span className={`mt-1.5 w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[task.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${task.status === 'done' ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {task.title}
                  </p>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <Badge className={CATEGORY_COLORS[task.category]}>
                      {CATEGORY_LABELS[task.category]}
                    </Badge>
                    {task.dueDate && (
                      <span className={`text-xs ${isOverdue(task.dueDate) ? 'text-red-600 font-medium' : isDueToday(task.dueDate) ? 'text-orange-500 font-medium' : 'text-slate-400'}`}>
                        {isOverdue(task.dueDate) ? '⚠ Overdue' : isDueToday(task.dueDate) ? '⏰ Due today' : formatDate(task.dueDate)}
                      </span>
                    )}
                  </div>
                </div>
                <Badge className={STATUS_COLORS[task.status]}>
                  {STATUS_LABELS[task.status]}
                </Badge>
              </li>
            ))}
          </ul>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Upcoming meetings */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2 text-sm">
                <Clock size={15} className="text-emerald-600" />
                Upcoming Meetings
              </h2>
              <button
                onClick={() => onNavigate('meetings')}
                className="text-xs text-brand-600 hover:underline"
              >
                View all →
              </button>
            </div>
            <ul className="divide-y divide-slate-50">
              {stats.upcomingMeetings.length === 0 && (
                <li className="px-4 py-4 text-center text-slate-400 text-xs">No upcoming meetings</li>
              )}
              {stats.upcomingMeetings.map(mtg => (
                <li key={mtg.id} className="px-4 py-3">
                  <p className="text-sm font-medium text-slate-700 truncate">{mtg.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {formatDateTime(mtg.date, mtg.time)} · {mtg.duration}m
                  </p>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs health */}
          <div className="bg-white rounded-xl border border-slate-200">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
              <h2 className="font-semibold text-slate-700 text-sm flex items-center gap-2">
                <CircleCheck size={15} className="text-brand-600" />
                Programs
              </h2>
              <button
                onClick={() => onNavigate('programs')}
                className="text-xs text-brand-600 hover:underline"
              >
                View all →
              </button>
            </div>
            <ul className="divide-y divide-slate-50">
              {programs.slice(0, 4).map(prog => (
                <li key={prog.id} className="px-4 py-3 flex items-center gap-3">
                  <span
                    className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: prog.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 truncate">{prog.name}</p>
                    <p className="text-xs text-slate-400 truncate">{prog.phase}</p>
                  </div>
                  <Badge className={STATUS_COLORS[prog.status]}>
                    {STATUS_LABELS[prog.status]}
                  </Badge>
                </li>
              ))}
              {programs.length === 0 && (
                <li className="px-4 py-4 text-center text-slate-400 text-xs">No programs yet</li>
              )}
            </ul>
          </div>
        </div>
      </div>

      {/* Overdue follow-ups */}
      {stats.overdueFollowUps.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <h3 className="text-sm font-semibold text-red-700 mb-2 flex items-center gap-2">
            <AlertTriangle size={15} />
            Overdue Follow-ups ({stats.overdueFollowUps.length})
          </h3>
          <ul className="space-y-1.5">
            {stats.overdueFollowUps.map(fu => (
              <li key={fu.id} className="flex items-center justify-between text-sm">
                <span className="text-red-800">{fu.title}</span>
                <span className="text-red-500 text-xs">{formatDate(fu.dueDate)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
