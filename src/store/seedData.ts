import { Program, Project, Task, Meeting, FollowUp } from '../types';

const now = new Date().toISOString();
const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
const twoWeeks = new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0];

const programs: Program[] = [
  {
    id: 'prog-1',
    name: 'CardioSense 3.0',
    description: 'Next-gen cardiac monitoring device — FDA 510(k) clearance track',
    phase: 'Design Verification',
    status: 'in_progress',
    therapeuticArea: 'Cardiology',
    color: '#2563eb',
    createdAt: now,
  },
  {
    id: 'prog-2',
    name: 'NeuroTrack AI',
    description: 'AI-assisted neurological diagnostic platform',
    phase: 'Concept & Feasibility',
    status: 'in_progress',
    therapeuticArea: 'Neurology',
    color: '#7c3aed',
    createdAt: now,
  },
  {
    id: 'prog-3',
    name: 'OncoCath Pro',
    description: 'Oncology catheter improvement program',
    phase: 'Post-Market Surveillance',
    status: 'in_progress',
    therapeuticArea: 'Oncology',
    color: '#059669',
    createdAt: now,
  },
];

const projects: Project[] = [
  {
    id: 'proj-1',
    programId: 'prog-1',
    name: 'Biocompatibility Testing',
    description: 'ISO 10993 biocompatibility test series',
    status: 'in_progress',
    dueDate: nextWeek,
    createdAt: now,
  },
  {
    id: 'proj-2',
    programId: 'prog-1',
    name: '510(k) Submission Package',
    description: 'Compile regulatory dossier for FDA submission',
    status: 'todo',
    dueDate: twoWeeks,
    createdAt: now,
  },
  {
    id: 'proj-3',
    programId: 'prog-2',
    name: 'Algorithm Validation Study',
    description: 'Clinical validation of AI diagnostic algorithm',
    status: 'todo',
    dueDate: twoWeeks,
    createdAt: now,
  },
];

const tasks: Task[] = [
  {
    id: 'task-1',
    title: 'Review biocompatibility test protocol',
    description: 'Final review of ISO 10993-5 cytotoxicity protocol before lab submission',
    category: 'task',
    priority: 'high',
    status: 'todo',
    programId: 'prog-1',
    projectId: 'proj-1',
    dueDate: today,
    tags: ['regulatory', 'biocompatibility'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-2',
    title: 'Prepare Steering Committee deck',
    description: 'Q2 program status update for CardioSense 3.0 steering committee',
    category: 'meeting_action',
    priority: 'critical',
    status: 'in_progress',
    programId: 'prog-1',
    dueDate: tomorrow,
    tags: ['steering-committee', 'presentation'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-3',
    title: 'Follow up with CRO on timeline',
    description: 'Get updated timeline from the CRO for the clinical study start date',
    category: 'follow_up',
    priority: 'high',
    status: 'todo',
    programId: 'prog-2',
    dueDate: today,
    owner: 'CRO Partner',
    tags: ['CRO', 'clinical'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-4',
    title: 'Update risk management file',
    description: 'Incorporate design change impact on risk assessment per ISO 14971',
    category: 'task',
    priority: 'medium',
    status: 'todo',
    programId: 'prog-1',
    projectId: 'proj-1',
    dueDate: nextWeek,
    tags: ['risk-management', 'ISO-14971'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-5',
    title: 'Complete annual performance reviews',
    description: 'Submit performance review forms for direct reports',
    category: 'admin',
    priority: 'medium',
    status: 'todo',
    dueDate: nextWeek,
    tags: ['HR', 'admin'],
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'task-6',
    title: 'OncoCath PMS report — Q1 data',
    description: 'Compile Q1 complaint and adverse event data for PMS report',
    category: 'milestone',
    priority: 'high',
    status: 'in_progress',
    programId: 'prog-3',
    dueDate: twoWeeks,
    tags: ['PMS', 'regulatory'],
    createdAt: now,
    updatedAt: now,
  },
];

const meetings: Meeting[] = [
  {
    id: 'mtg-1',
    title: 'CardioSense 3.0 Steering Committee',
    type: 'steering',
    date: tomorrow,
    time: '09:00',
    duration: 60,
    programId: 'prog-1',
    attendees: ['VP R&D', 'Regulatory Affairs Lead', 'Quality Director', 'Clinical Lead'],
    agenda: 'Q2 status update, design freeze milestone review, FDA pre-submission strategy',
    notes: '',
    actionItems: [],
    createdAt: now,
  },
  {
    id: 'mtg-2',
    title: 'Cross-functional Program Review',
    type: 'cross_functional',
    date: nextWeek,
    time: '14:00',
    duration: 90,
    attendees: ['RA Lead', 'Engineering', 'Clinical Affairs', 'Manufacturing'],
    agenda: 'Portfolio review across all active programs',
    notes: '',
    actionItems: [],
    createdAt: now,
  },
];

const followUps: FollowUp[] = [
  {
    id: 'fu-1',
    title: 'FDA response to pre-sub meeting request',
    description: 'Awaiting FDA acknowledgement of pre-submission meeting request Q2023-001',
    dueDate: nextWeek,
    priority: 'critical',
    status: 'in_progress',
    programId: 'prog-1',
    assignedTo: 'FDA',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'fu-2',
    title: 'Notified Body response on technical file gap analysis',
    description: 'Awaiting feedback from NB on submitted gap analysis for MDR compliance',
    dueDate: twoWeeks,
    priority: 'high',
    status: 'todo',
    programId: 'prog-1',
    assignedTo: 'Notified Body',
    createdAt: now,
    updatedAt: now,
  },
  {
    id: 'fu-3',
    title: 'Legal review of CRO contract',
    description: 'Legal team to review CRO master service agreement',
    dueDate: tomorrow,
    priority: 'medium',
    status: 'todo',
    programId: 'prog-2',
    assignedTo: 'Legal',
    createdAt: now,
    updatedAt: now,
  },
];

export interface StoreState {
  tasks: Task[];
  programs: Program[];
  projects: Project[];
  meetings: Meeting[];
  followUps: FollowUp[];
}

export const seedData: StoreState = {
  tasks,
  programs,
  projects,
  meetings,
  followUps,
};
