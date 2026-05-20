import { useState } from 'react';
import { OKRCommandCenter } from './okr/OKRCommandCenter';
import { OKRDepartmentKRAs } from './okr/OKRDepartmentKRAs';
import { OKRRiskRegistry } from './okr/OKRRiskRegistry';
import { OKRMilestones } from './okr/OKRMilestones';
import { OKRAlignmentMatrix } from './okr/OKRAlignmentMatrix';
import { OKRExecutiveView } from './okr/OKRExecutiveView';
import { getTotalKRACount } from '../data/okrData';
import { useOKRStore } from '../store/useOKRStore';
import { Zap, Target, Building2, Shield, CalendarDays, GitBranch } from 'lucide-react';

type OKRTab = 'executive' | 'command' | 'departments' | 'risks' | 'milestones' | 'matrix';

const TABS: { id: OKRTab; label: string; icon: React.ElementType; description: string }[] = [
  { id: 'executive',   label: 'Leadership Review', icon: Zap,         description: 'What is off-track, at risk, and what decisions are needed now' },
  { id: 'command',     label: 'Strategic Overview', icon: Target,      description: 'CEO Command Center — 5 Objectives & Key Results' },
  { id: 'departments', label: 'Department KRAs',    icon: Building2,   description: 'Click "Update" on any KRA to set status, progress and blockers' },
  { id: 'matrix',      label: 'Alignment Matrix',   icon: GitBranch,   description: 'Cross-functional ownership map' },
  { id: 'risks',       label: 'Risk Registry',      icon: Shield,      description: 'All risks and blockers aggregated' },
  { id: 'milestones',  label: 'Milestones',          icon: CalendarDays,description: 'Key execution dates Q1–Q4 FY27' },
];

export function OKRDashboard() {
  const [activeTab, setActiveTab] = useState<OKRTab>('executive');
  const totalKRAs = getTotalKRACount();
  const { updates } = useOKRStore();

  const totalUpdated = Object.keys(updates).length;
  const redCount     = Object.values(updates).filter(u => u.status === 'red').length;
  const amberCount   = Object.values(updates).filter(u => u.status === 'amber').length;

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

          {/* Live health bar */}
          <div className="flex items-center gap-2">
            {redCount > 0 && (
              <div className="flex items-center gap-1.5 bg-red-600/30 border border-red-500/40 rounded-xl px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500" />
                <span className="text-xs font-semibold text-red-300">{redCount} Off Track</span>
              </div>
            )}
            {amberCount > 0 && (
              <div className="flex items-center gap-1.5 bg-amber-600/20 border border-amber-500/40 rounded-xl px-3 py-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-xs font-semibold text-amber-300">{amberCount} At Risk</span>
              </div>
            )}
            <div className="bg-white/10 rounded-xl px-3 py-1.5">
              <span className="text-xs text-slate-300">{totalUpdated}/{totalKRAs} KRAs updated</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-white border-b border-slate-200 px-6">
        <div className="flex gap-0 overflow-x-auto">
          {TABS.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            const isAlert = tab.id === 'executive' && (redCount > 0 || amberCount > 0);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`relative flex items-center gap-2 px-4 py-3.5 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                  active
                    ? tab.id === 'executive'
                      ? 'border-red-600 text-red-700'
                      : 'border-slate-900 text-slate-900'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <Icon size={14} />
                {tab.label}
                {isAlert && (
                  <span className="ml-1 flex items-center gap-0.5">
                    {redCount > 0 && <span className="w-2 h-2 rounded-full bg-red-500" />}
                    {amberCount > 0 && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                  </span>
                )}
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
        {activeTab === 'executive'   && <OKRExecutiveView updates={updates} />}
        {activeTab === 'command'     && <OKRCommandCenter />}
        {activeTab === 'departments' && <OKRDepartmentKRAs />}
        {activeTab === 'matrix'      && <OKRAlignmentMatrix />}
        {activeTab === 'risks'       && <OKRRiskRegistry />}
        {activeTab === 'milestones'  && <OKRMilestones />}
      </div>
    </div>
  );
}
