import { useState, useEffect } from 'react';
import { Task, Program, Project, Meeting, FollowUp, View } from '../types';
import { seedData, StoreState } from './seedData';

const STORAGE_KEY = 'pm_task_hub_v1';

function loadState(): StoreState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {}
  return seedData;
}

function saveState(state: StoreState) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function useStore() {
  const [state, setState] = useState<StoreState>(loadState);
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = (patch: Partial<StoreState>) =>
    setState(s => ({ ...s, ...patch }));

  // Tasks
  const addTask = (task: Task) => update({ tasks: [...state.tasks, task] });
  const updateTask = (task: Task) =>
    update({ tasks: state.tasks.map(t => (t.id === task.id ? task : t)) });
  const deleteTask = (id: string) =>
    update({ tasks: state.tasks.filter(t => t.id !== id) });

  // Programs
  const addProgram = (p: Program) => update({ programs: [...state.programs, p] });
  const updateProgram = (p: Program) =>
    update({ programs: state.programs.map(x => (x.id === p.id ? p : x)) });
  const deleteProgram = (id: string) =>
    update({ programs: state.programs.filter(p => p.id !== id) });

  // Projects
  const addProject = (p: Project) => update({ projects: [...state.projects, p] });
  const updateProject = (p: Project) =>
    update({ projects: state.projects.map(x => (x.id === p.id ? p : x)) });
  const deleteProject = (id: string) =>
    update({ projects: state.projects.filter(p => p.id !== id) });

  // Meetings
  const addMeeting = (m: Meeting) => update({ meetings: [...state.meetings, m] });
  const updateMeeting = (m: Meeting) =>
    update({ meetings: state.meetings.map(x => (x.id === m.id ? m : x)) });
  const deleteMeeting = (id: string) =>
    update({ meetings: state.meetings.filter(m => m.id !== id) });

  // Follow-ups
  const addFollowUp = (f: FollowUp) => update({ followUps: [...state.followUps, f] });
  const updateFollowUp = (f: FollowUp) =>
    update({ followUps: state.followUps.map(x => (x.id === f.id ? f : x)) });
  const deleteFollowUp = (id: string) =>
    update({ followUps: state.followUps.filter(f => f.id !== id) });

  return {
    ...state,
    currentView,
    setCurrentView,
    sidebarOpen,
    setSidebarOpen,
    addTask, updateTask, deleteTask,
    addProgram, updateProgram, deleteProgram,
    addProject, updateProject, deleteProject,
    addMeeting, updateMeeting, deleteMeeting,
    addFollowUp, updateFollowUp, deleteFollowUp,
  };
}
