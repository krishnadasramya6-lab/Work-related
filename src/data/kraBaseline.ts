// KRA Baseline — committed after each leadership meeting
// Last updated: 20 May 2026
// To update: paste the meeting report to Claude Code and say "save to baseline"

import { KRAUpdate } from '../store/useOKRStore';

export const kraBaseline: Record<string, KRAUpdate> = {
  "rnd-1-1": {
    "kraId": "rnd-1-1",
    "status": "amber",
    "progress": 0,
    "blockerNote": "",
    "decisionNeeded": "Decision needed on priority",
    "updatedAt": "2026-05-20T14:23:40.920Z"
  },
  "rnd-1-2": {
    "kraId": "rnd-1-2",
    "status": "amber",
    "progress": 0,
    "blockerNote": "",
    "decisionNeeded": "",
    "updatedAt": "2026-05-20T14:23:48.236Z"
  },
  "rnd-1-3": {
    "kraId": "rnd-1-3",
    "status": "amber",
    "progress": 0,
    "blockerNote": "",
    "decisionNeeded": "",
    "updatedAt": "2026-05-20T14:23:53.586Z"
  },
};

export const baselineMetadata = {
  lastMeetingDate: '20 May 2026',
  lastUpdated: '2026-05-20T14:24:20.077Z',
  updatedBy: 'Leadership Meeting',
};
