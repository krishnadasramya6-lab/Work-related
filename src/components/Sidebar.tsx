import {
  LayoutDashboard, CheckSquare, Layers, FolderOpen,
  CalendarDays, AlarmClock, ChevronLeft, ChevronRight,
  Stethoscope,
} from 'lucide-react';
import { View } from '../types';

interface Props {
  current: View;
  onNavigate: (v: View) => void;
  open: boolean;
  onToggle: () => void;
  counts: {
    todayTasks: number;
    overdueItems: number;
    openFollowUps: number;
    upcomingMeetings: number;
  };
}

const NAV: { view: View; label: string; icon: React.ElementType; section?: string }[] = [
  { view: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { view: 'tasks', label: 'Tasks', icon: CheckSquare },
  { view: 'programs', label: 'Programs', icon: Layers },
  { view: 'projects', label: 'Projects', icon: FolderOpen },
  { view: 'meetings', label: 'Meetings', icon: CalendarDays },
  { view: 'followups', label: 'Follow-ups', icon: AlarmClock },
];

export function Sidebar({ current, onNavigate, open, onToggle, counts }: Props) {
  return (
    <aside
      className={`relative flex flex-col bg-brand-900 text-white transition-all duration-200 ${
        open ? 'w-56' : 'w-14'
      } flex-shrink-0`}
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-3 py-4 border-b border-brand-800 overflow-hidden">
        <div className="flex-shrink-0 w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center">
          <Stethoscope size={16} className="text-white" />
        </div>
        {open && (
          <div className="min-w-0">
            <p className="font-bold text-sm leading-tight truncate">PM Task Hub</p>
            <p className="text-brand-300 text-xs truncate">MedTech Programs</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3 space-y-0.5 overflow-hidden overflow-y-auto">
        {NAV.map(({ view, label, icon: Icon, section }, idx) => {
          const badge =
            view === 'tasks' && counts.todayTasks > 0 ? counts.todayTasks :
            view === 'followups' && counts.openFollowUps > 0 ? counts.openFollowUps :
            view === 'meetings' && counts.upcomingMeetings > 0 ? counts.upcomingMeetings :
            0;

          const prevSection = idx > 0 ? NAV[idx - 1].section : undefined;
          const showDivider = section && section !== prevSection;

          return (
            <div key={view}>
              {showDivider && open && (
                <div className="px-3 pt-3 pb-1">
                  <p className="text-brand-400 text-xs font-semibold tracking-widest uppercase">{section}</p>
                </div>
              )}
              {showDivider && !open && <div className="border-t border-brand-800 mx-2 my-2" />}
              <button
                onClick={() => onNavigate(view)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg mx-1 transition-colors ${
                  current === view
                    ? view === 'okr'
                      ? 'bg-amber-600 text-white'
                      : 'bg-brand-600 text-white'
                    : 'text-brand-200 hover:bg-brand-800 hover:text-white'
                } ${open ? 'w-[calc(100%-8px)]' : 'w-10 justify-center'}`}
              >
                <Icon size={18} className="flex-shrink-0" />
                {open && (
                  <>
                    <span className="flex-1 text-left truncate">{label}</span>
                    {badge > 0 && (
                      <span className="ml-auto bg-brand-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        {badge > 9 ? '9+' : badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            </div>
          );
        })}
      </nav>

      {/* Overdue indicator */}
      {counts.overdueItems > 0 && open && (
        <div className="mx-2 mb-3 px-3 py-2 bg-red-600/30 border border-red-500/30 rounded-lg">
          <p className="text-red-300 text-xs font-medium">
            {counts.overdueItems} overdue item{counts.overdueItems > 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Toggle */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-16 w-6 h-6 bg-brand-700 border border-brand-600 rounded-full flex items-center justify-center hover:bg-brand-600 transition-colors z-10"
      >
        {open ? <ChevronLeft size={12} /> : <ChevronRight size={12} />}
      </button>
    </aside>
  );
}
