import { Zap, CheckCircle, AlertTriangle, XCircle, Users, Calendar, MessageSquare } from 'lucide-react';
import { departments, strategicObjectives, objectiveColorMap } from '../../data/okrData';
import { KRAUpdate } from '../../store/useOKRStore';

interface Props {
  updates: Record<string, KRAUpdate>;
}

const STATUS_CFG = {
  green:   { icon: CheckCircle,  label: 'On Track',  badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', dot: 'bg-emerald-500' },
  amber:   { icon: AlertTriangle, label: 'At Risk',  badge: 'bg-amber-100 text-amber-700 border-amber-200',       dot: 'bg-amber-500' },
  red:     { icon: XCircle,      label: 'Off Track', badge: 'bg-red-100 text-red-700 border-red-200',             dot: 'bg-red-500' },
  pending: { icon: AlertTriangle, label: 'Pending',  badge: 'bg-slate-100 text-slate-500 border-slate-200',       dot: 'bg-slate-300' },
};

export function OKRExecutiveView({ updates }: Props) {
  // Gather all KRAs with their live status
  const allKRAs = departments.flatMap(dept =>
    dept.kras.map(kra => {
      const update = updates[kra.id] ?? null;
      const status = update?.status ?? 'pending';
      return { kra, dept, update, status };
    })
  );

  const redItems    = allKRAs.filter(x => x.status === 'red');
  const amberItems  = allKRAs.filter(x => x.status === 'amber');
  const greenItems  = allKRAs.filter(x => x.status === 'green');
  const pendingItems = allKRAs.filter(x => x.status === 'pending');

  const decisionsNeeded = allKRAs.filter(x => x.update?.decisionNeeded?.trim());
  const totalUpdated = Object.keys(updates).length;
  const totalKRAs = allKRAs.length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 to-red-900 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <Zap size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Leadership Review</h2>
            <p className="text-slate-300 text-xs">What needs your attention right now</p>
          </div>
        </div>
        {/* Scorecards */}
        <div className="grid grid-cols-4 gap-2 mt-2">
          {[
            { label: 'Off Track', value: redItems.length,    color: 'bg-red-600/60' },
            { label: 'At Risk',   value: amberItems.length,  color: 'bg-amber-500/50' },
            { label: 'On Track',  value: greenItems.length,  color: 'bg-emerald-600/50' },
            { label: 'Updated',   value: `${totalUpdated}/${totalKRAs}`, color: 'bg-white/10' },
          ].map(x => (
            <div key={x.label} className={`${x.color} rounded-xl px-3 py-2.5`}>
              <p className="font-bold text-xl">{x.value}</p>
              <p className="text-xs text-white/70">{x.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Decisions Needed */}
      {decisionsNeeded.length > 0 && (
        <div className="bg-white border-2 border-red-300 rounded-2xl overflow-hidden">
          <div className="bg-red-50 px-5 py-3 flex items-center gap-2 border-b border-red-200">
            <MessageSquare size={15} className="text-red-600" />
            <p className="text-sm font-bold text-red-700">Decisions Needed from Leadership ({decisionsNeeded.length})</p>
          </div>
          <div className="divide-y divide-slate-100">
            {decisionsNeeded.map(({ kra, dept, update }) => {
              const obj = strategicObjectives[kra.objectiveNumber - 1];
              const objColors = obj ? objectiveColorMap[obj.color] : objectiveColorMap.blue;
              return (
                <div key={kra.id} className="px-5 py-3">
                  <div className="flex items-start gap-3">
                    <MessageSquare size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-semibold text-slate-700">{update!.decisionNeeded}</p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${dept.badgeClass}`}>{dept.name}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded border ${objColors.badge} ${objColors.border}`}>Obj {kra.objectiveNumber}</span>
                        <span className="text-xs text-slate-400">{kra.owner}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Off Track */}
      {redItems.length > 0 && (
        <KRAGroup
          title="Off Track — Immediate Action Required"
          items={redItems}
          headerClass="bg-red-50 border-red-200"
          titleClass="text-red-700"
          icon={<XCircle size={15} className="text-red-600" />}
        />
      )}

      {/* At Risk */}
      {amberItems.length > 0 && (
        <KRAGroup
          title="At Risk — Monitor Closely"
          items={amberItems}
          headerClass="bg-amber-50 border-amber-200"
          titleClass="text-amber-700"
          icon={<AlertTriangle size={15} className="text-amber-600" />}
        />
      )}

      {/* On Track summary */}
      {greenItems.length > 0 && (
        <div className="bg-white border border-emerald-200 rounded-2xl overflow-hidden">
          <div className="bg-emerald-50 px-5 py-3 flex items-center justify-between border-b border-emerald-200">
            <div className="flex items-center gap-2">
              <CheckCircle size={15} className="text-emerald-600" />
              <p className="text-sm font-bold text-emerald-700">On Track ({greenItems.length} KRAs)</p>
            </div>
            <p className="text-xs text-emerald-600">No action needed</p>
          </div>
          <div className="px-5 py-3 flex flex-wrap gap-2">
            {greenItems.map(({ kra, dept }) => (
              <span key={kra.id} className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-1 rounded-lg">
                {dept.name}: {kra.code}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pending updates notice */}
      {pendingItems.length > 0 && (
        <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4">
          <p className="text-xs font-semibold text-slate-500 mb-1">
            {pendingItems.length} KRAs haven't been updated yet
          </p>
          <p className="text-xs text-slate-400">
            Go to "Department KRAs" tab, click any KRA card to update its status, progress and blockers.
          </p>
        </div>
      )}
    </div>
  );
}

function KRAGroup({ title, items, headerClass, titleClass, icon }: {
  title: string;
  items: { kra: any; dept: any; update: KRAUpdate | null; status: string }[];
  headerClass: string;
  titleClass: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      <div className={`px-5 py-3 flex items-center gap-2 border-b ${headerClass}`}>
        {icon}
        <p className={`text-sm font-bold ${titleClass}`}>{title} ({items.length})</p>
      </div>
      <div className="divide-y divide-slate-100">
        {items.map(({ kra, dept, update }) => {
          const obj = strategicObjectives[kra.objectiveNumber - 1];
          const objColors = obj ? objectiveColorMap[obj.color] : objectiveColorMap.blue;
          const progress = update?.progress ?? 0;
          const progressColor = progress >= 70 ? 'bg-emerald-500' : progress >= 40 ? 'bg-amber-500' : 'bg-red-500';

          return (
            <div key={kra.id} className="px-5 py-4">
              <div className="flex items-start gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 leading-snug">{kra.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${dept.badgeClass}`}>{dept.name}</span>
                    <span className={`text-xs px-1.5 py-0.5 rounded border ${objColors.badge} ${objColors.border}`}>Obj {kra.objectiveNumber}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Users size={9} /> {kra.owner}</span>
                    <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={9} /> {kra.dueDate}</span>
                  </div>

                  {/* Progress bar */}
                  {update && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-slate-400">Progress</span>
                        <span className="text-xs font-semibold text-slate-600">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${progressColor}`} style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}

                  {update?.blockerNote && (
                    <div className="mt-2 flex items-start gap-1.5">
                      <AlertTriangle size={11} className="text-amber-500 flex-shrink-0 mt-0.5" />
                      <p className="text-xs text-amber-800">{update.blockerNote}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
