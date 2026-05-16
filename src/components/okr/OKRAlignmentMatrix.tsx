import { departments, strategicObjectives, objectiveColorMap } from '../../data/okrData';
import { GitBranch } from 'lucide-react';

export function OKRAlignmentMatrix() {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-600 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
            <GitBranch size={18} />
          </div>
          <div>
            <h2 className="text-lg font-bold">Cross-Functional Alignment Matrix</h2>
            <p className="text-slate-300 text-xs">Which departments own KRAs under each strategic objective</p>
          </div>
        </div>
      </div>

      {/* Matrix Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-4 py-3 text-slate-600 font-semibold w-32 min-w-[8rem]">Department</th>
                {strategicObjectives.map(obj => {
                  const colors = objectiveColorMap[obj.color];
                  return (
                    <th key={obj.id} className="px-3 py-3 text-center min-w-[100px]">
                      <div className={`mx-auto w-7 h-7 rounded-lg flex items-center justify-center text-white font-bold text-sm mb-1 ${colors.dot}`}>
                        {obj.number}
                      </div>
                      <span className={`text-xs font-semibold ${colors.text}`}>{obj.shortTitle}</span>
                    </th>
                  );
                })}
                <th className="px-3 py-3 text-center text-slate-500 font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {departments.map((dept, idx) => {
                const total = dept.kras.length;
                return (
                  <tr key={dept.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-4 py-3">
                      <span className={`font-semibold text-xs px-2 py-1 rounded-lg border ${dept.badgeClass}`}>
                        {dept.name}
                      </span>
                    </td>
                    {strategicObjectives.map(obj => {
                      const count = dept.kras.filter(k => k.objectiveRef === obj.id).length;
                      const colors = objectiveColorMap[obj.color];
                      return (
                        <td key={obj.id} className="px-3 py-3 text-center">
                          {count > 0 ? (
                            <div className={`inline-flex items-center justify-center w-8 h-8 rounded-lg font-bold text-sm ${colors.badge}`}>
                              {count}
                            </div>
                          ) : (
                            <div className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-200">
                              —
                            </div>
                          )}
                        </td>
                      );
                    })}
                    <td className="px-3 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-slate-800 text-white font-bold text-sm">
                        {total}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {/* Column totals */}
              <tr className="bg-slate-800 text-white">
                <td className="px-4 py-3 font-semibold text-xs">Total KRAs</td>
                {strategicObjectives.map(obj => {
                  const total = departments.reduce((s, d) => s + d.kras.filter(k => k.objectiveRef === obj.id).length, 0);
                  return (
                    <td key={obj.id} className="px-3 py-3 text-center font-bold text-sm">
                      {total}
                    </td>
                  );
                })}
                <td className="px-3 py-3 text-center font-bold text-sm">
                  {departments.reduce((s, d) => s + d.kras.length, 0)}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Most Cross-Functional KRAs */}
      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-4">Most Cross-Functional Dependencies</h3>
        <div className="space-y-2">
          {[
            { kr: 'KR 4.1 — L.nm V2 Milestone Delivery', depts: ['RND', 'Product Mgmt', 'QA/RA', 'Purchase', 'MFG', 'Sales', 'Marketing'], note: 'All departments involved in NPD milestone governance' },
            { kr: 'KR 1.2 — 4 Specialty Launches + KOL Activation', depts: ['Product Mgmt', 'RND', 'MKG', 'CAS', 'QA/RA'], note: 'Product, clinical, and regulatory all required' },
            { kr: 'KR 3.3 — Working Capital & Inventory Reduction', depts: ['MFG', 'Purchase', 'Finance', 'Sales'], note: 'Requires coordinated demand-supply planning' },
            { kr: 'KR 2.1 — .nm Sales 133 Domestic + 22 International', depts: ['Sales', 'MKG', 'Product Mgmt', 'MFG', 'Purchase'], note: 'Revenue target with supply chain dependency' },
          ].map(item => (
            <div key={item.kr} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-slate-700">{item.kr}</p>
                <p className="text-xs text-slate-500 mt-0.5">{item.note}</p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  {item.depts.map(d => {
                    const dept = departments.find(dep => dep.name === d || dep.name.startsWith(d));
                    return (
                      <span key={d} className={`text-xs px-1.5 py-0.5 rounded border ${dept?.badgeClass ?? 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        {d}
                      </span>
                    );
                  })}
                </div>
              </div>
              <div className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 rounded-lg bg-slate-700 text-white flex items-center justify-center text-sm font-bold">
                  {item.depts.length}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Ownership rules */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs font-semibold text-blue-700 mb-2">OWNERSHIP MODEL (EOS Rules)</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-blue-800">
          {[
            { role: 'Accountable Owner', desc: 'Single person accountable for KRA outcome' },
            { role: 'Support Functions', desc: 'Departments that contribute inputs/dependencies' },
            { role: 'Dependency Owners', desc: 'Teams whose outputs gate this KRA' },
            { role: 'PMO', desc: 'Governs update compliance and escalations' },
          ].map(x => (
            <div key={x.role} className="bg-white/70 rounded-lg p-2 border border-blue-100">
              <p className="font-semibold">{x.role}</p>
              <p className="opacity-80 mt-0.5">{x.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
