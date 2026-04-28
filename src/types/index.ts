export type Priority = 'low' | 'medium' | 'high' | 'critical';
export type Status = 'todo' | 'in_progress' | 'blocked' | 'done' | 'cancelled';
export type TaskCategory = 'task' | 'follow_up' | 'meeting_action' | 'milestone' | 'admin';
export type MeetingType = 'strategic' | 'steering' | 'cross_functional' | 'regulatory' | 'one_on_one' | 'other';

export interface Program {
  id: string;
  name: string;
  description: string;
  phase: string;
  status: Status;
  therapeuticArea: string;
  color: string;
  createdAt: string;
}

export interface Project {
  id: string;
  programId: string;
  name: string;
  description: string;
  status: Status;
  dueDate?: string;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  category: TaskCategory;
  priority: Priority;
  status: Status;
  programId?: string;
  projectId?: string;
  meetingId?: string;
  dueDate?: string;
  dueTime?: string;
  completedAt?: string;
  owner?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Meeting {
  id: string;
  title: string;
  type: MeetingType;
  date: string;
  time: string;
  duration: number;
  programId?: string;
  attendees: string[];
  agenda: string;
  notes: string;
  actionItems: string[];
  createdAt: string;
}

export interface FollowUp {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  priority: Priority;
  status: Status;
  programId?: string;
  projectId?: string;
  meetingId?: string;
  assignedTo?: string;
  reminder?: string;
  createdAt: string;
  updatedAt: string;
}

export type View = 'dashboard' | 'tasks' | 'programs' | 'projects' | 'meetings' | 'followups';
