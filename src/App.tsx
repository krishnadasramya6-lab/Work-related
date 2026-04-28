import { useMemo } from 'react';
import { useStore } from './store/useStore';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { TasksView } from './components/TasksView';
import { ProgramsView } from './components/ProgramsView';
import { ProjectsView } from './components/ProjectsView';
import { MeetingsView } from './components/MeetingsView';
import { FollowUpsView } from './components/FollowUpsView';
import { isOverdue, isDueToday } from './utils/helpers';

export default function App() {
  const store = useStore();

  const counts = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const activeTasks = store.tasks.filter(t => t.status !== 'done' && t.status !== 'cancelled');
    const activeFollowUps = store.followUps.filter(f => f.status !== 'done' && f.status !== 'cancelled');
    return {
      todayTasks: activeTasks.filter(t => isDueToday(t.dueDate)).length,
      overdueItems:
        activeTasks.filter(t => isOverdue(t.dueDate)).length +
        activeFollowUps.filter(f => isOverdue(f.dueDate)).length,
      openFollowUps: activeFollowUps.length,
      upcomingMeetings: store.meetings.filter(m => m.date >= today).length,
    };
  }, [store.tasks, store.followUps, store.meetings]);

  const view = store.currentView;

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar
        current={view}
        onNavigate={store.setCurrentView}
        open={store.sidebarOpen}
        onToggle={() => store.setSidebarOpen(v => !v)}
        counts={counts}
      />
      <main className="flex-1 overflow-y-auto">
        {view === 'dashboard' && (
          <Dashboard
            tasks={store.tasks}
            meetings={store.meetings}
            followUps={store.followUps}
            programs={store.programs}
            onNavigate={store.setCurrentView}
          />
        )}
        {view === 'tasks' && (
          <TasksView
            tasks={store.tasks}
            programs={store.programs}
            projects={store.projects}
            onAdd={store.addTask}
            onUpdate={store.updateTask}
            onDelete={store.deleteTask}
          />
        )}
        {view === 'programs' && (
          <ProgramsView
            programs={store.programs}
            tasks={store.tasks}
            onAdd={store.addProgram}
            onUpdate={store.updateProgram}
            onDelete={store.deleteProgram}
          />
        )}
        {view === 'projects' && (
          <ProjectsView
            projects={store.projects}
            programs={store.programs}
            tasks={store.tasks}
            onAdd={store.addProject}
            onUpdate={store.updateProject}
            onDelete={store.deleteProject}
          />
        )}
        {view === 'meetings' && (
          <MeetingsView
            meetings={store.meetings}
            programs={store.programs}
            onAdd={store.addMeeting}
            onUpdate={store.updateMeeting}
            onDelete={store.deleteMeeting}
          />
        )}
        {view === 'followups' && (
          <FollowUpsView
            followUps={store.followUps}
            programs={store.programs}
            projects={store.projects}
            onAdd={store.addFollowUp}
            onUpdate={store.updateFollowUp}
            onDelete={store.deleteFollowUp}
          />
        )}
      </main>
    </div>
  );
}
