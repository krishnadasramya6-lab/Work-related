import { useState } from 'react';
import { OKRCommandCenter } from './okr/OKRCommandCenter';
import { OKRDepartmentKRAs } from './okr/OKRDepartmentKRAs';
import { OKRRiskRegistry } from './okr/OKRRiskRegistry';
import { OKRMilestones } from './okr/OKRMilestones';
import { OKRAlignmentMatrix } from './okr/OKRAlignmentMatrix';
import { getTotalKRACount } from '../data/okrData';
import { Target, Building2, Shield, CalendarDays, GitBranch } from 'lucide-react';

type OKRTab = 'command' | 'departments' | 'risks' | 'milestones' | 'matrix';

const TABS: { id: OKRTab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'command',     label: 'Strategic Overview',  icon: Target,      description: 'CEO Command Center — 5 Objectives & Key Results' },
  { id: 'departments', label: 'Department KRAs',      icon: Building2,   description: 'Functional accountability — KRAs by department' },
  { id: 'matrix',      label: 'Alignment Matrix',     icon: GitBranch,   description: 'Cross-functional ownership map' },
  { id: 'risks',       label: 'Risk Registry',        icon: Shield,      description: 'All risks and blockers aggregated' },
  { id: 'milestones',  label: 'Milestones',            icon: CalendarDays,description: 'Key execution dates Q1–Q4 FY27' },
];

export function OKRDashboard() {
  const [activeTab, setActiveTab] = useState<OKRTab>('command');
  const totalKRAs = getTotalKRACount();

  return (
    <div className="min-h-full bg-slate-50">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white px-6 py-4 border-b border-slate-700">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest text-slate-400 uppercase">Irillic</span>
              <span className="text-slate-600">|</span>
              <span className="text-xs text-slate-300">Enterprise Execution OS</span>
            </div>
            <h1 className="text-xl font-bold mt-0.5">OKR & KRA Operating System</h1>
            <p className="text-slate-400 text-xs mt-0.5">FY 2026-27 · 5 Objectives · {totalKRAs} KRAs · 9 Departments</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            {[
              { label: 'L.nm', color: 'bg-blue-500' },
              { label: '.nm', color: 'bg-teal-500' },
              { label: 'P&L', color: 'bg-emerald-500' },
              { label: 'NPD', color: 'bg-violet-500' },
              { label: 'New Biz', color: 'bg-orange-500' },
            ].map(p => (
              <span key={p.label} className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full ${p.color}/20 text-white border border-white/10`}>
                <span className={`w-1.5 h-1.5 rounded-full ${p.color}`} />
                {p.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  active
                    ? 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Description */}
      <div className="bg-slate-50 border-b border-slate-200 px-6 py-2">
        <p className="text-xs text-slate-400">
          {TABS.find(t => t.id === activeTab)?.description}
        </p>
      </div>

      {/* Tab Content */}
      <div className="px-6 py-6 max-w-6xl mx-auto">
        {activeTab === 'command'     && <OKRCommandCenter />}
        {activeTab === 'departments' && <OKRDepartmentKRAs />}
        {activeTab === 'matrix'      && <OKRAlignmentMatrix />}
        {activeTab === 'risks'       && <OKRRiskRegistry />}
        {activeTab === 'milestones'  && <OKRMilestones />}
      </div>
    </div>
  );
}
