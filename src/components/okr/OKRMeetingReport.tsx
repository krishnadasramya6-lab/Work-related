import { useState } from 'react';
import { X, Copy, CheckCheck, FileText, AlertTriangle, XCircle, CheckCircle, MessageSquare } from 'lucide-react';
import { departments, strategicObjectives } from '../../data/okrData';
import { KRAUpdate } from '../../store/useOKRStore';
import { baselineMetadata } from '../../data/kraBaseline';

interface Props {
  updates: Record<string, KRAUpdate>;
  onClose: () => void;
}

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

function today() {
  return new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function OKRMeetingReport({ updates, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const [copiedJson, setCopiedJson] = useState(false);

  // Gather all updated KRAs with context
  const allKRAs = departments.flatMap(dept =>
    dept.kras.map(kra => {
      const update = updates[kra.id] ?? null;
      const obj = strategicObjectives[kra.objectiveNumber - 1];
      return { kra, dept, update, obj };
    })
  ).filter(x => x.update !== null);

  const offTrack  = allKRAs.filter(x => x.update!.status === 'red');
  const atRisk    = allKRAs.filter(x => x.update!.status === 'amber');
  const onTrack   = allKRAs.filter(x => x.update!.status === 'green');
  const decisions = allKRAs.filter(x => x.update!.decisionNeeded?.trim());
  const blockers  = allKRAs.filter(x => x.update!.blockerNote?.trim());
  const totalKRAs = departments.reduce((s, d) => s + d.kras.length, 0);

  // Build human-readable report
  function buildReport(): string {
    const lines: string[] = [];
    const divider  = '═'.repeat(60);
    const thin     = '─'.repeat(60);

    lines.push(divider);
    lines.push('IRILLIC — LEADERSHIP MEETING REPORT');
    lines.push(`Date: ${today()}  |  Generated: ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`);
    if (baselineMetadata.lastMeetingDate) {
      lines.push(`Previous baseline: ${baselineMetadata.lastMeetingDate}`);
    }
    lines.push(divider);
    lines.push('');

    lines.push('EXECUTIVE SUMMARY');
    lines.push(thin);
    lines.push(`  KRAs Updated  : ${allKRAs.length} of ${totalKRAs}`);
    lines.push(`  Off Track     : ${offTrack.length}`);
    lines.push(`  At Risk       : ${atRisk.length}`);
    lines.push(`  On Track      : ${onTrack.length}`);
    lines.push(`  Decisions Made: ${decisions.length}`);
    lines.push(`  Blockers Raised: ${blockers.length}`);
    lines.push('');

    if (decisions.length > 0) {
      lines.push('DECISIONS MADE');
      lines.push(thin);
      decisions.forEach(({ kra, dept, update, obj }) => {
        lines.push(`  [${dept.name}] Obj ${kra.objectiveNumber} — ${kra.code}`);
        lines.push(`  KRA    : ${kra.title}`);
        lines.push(`  Decision: ${update!.decisionNeeded}`);
        lines.push(`  Owner  : ${kra.owner}  |  Due: ${kra.dueDate}`);
        lines.push('');
      });
    }

    if (offTrack.length > 0) {
      lines.push('OFF TRACK — REQUIRE IMMEDIATE ACTION');
      lines.push(thin);
      offTrack.forEach(({ kra, dept, update }) => {
        lines.push(`  [${dept.name}] ${kra.code} — ${kra.title}`);
        lines.push(`  Progress: ${update!.progress}%  |  Owner: ${kra.owner}  |  Due: ${kra.dueDate}`);
        if (update!.blockerNote) lines.push(`  Blocker: ${update!.blockerNote}`);
        lines.push('');
      });
    }

    if (atRisk.length > 0) {
      lines.push('AT RISK — MONITOR CLOSELY');
      lines.push(thin);
      atRisk.forEach(({ kra, dept, update }) => {
        lines.push(`  [${dept.name}] ${kra.code} — ${kra.title}`);
        lines.push(`  Progress: ${update!.progress}%  |  Owner: ${kra.owner}  |  Due: ${kra.dueDate}`);
        if (update!.blockerNote) lines.push(`  Blocker: ${update!.blockerNote}`);
        lines.push('');
      });
    }

    if (onTrack.length > 0) {
      lines.push('ON TRACK');
      lines.push(thin);
      onTrack.forEach(({ kra, dept, update }) => {
        lines.push(`  [${dept.name}] ${kra.code} — ${kra.title} (${update!.progress}%)`);
      });
      lines.push('');
    }

    lines.push(divider);
    lines.push('TO SAVE AS BASELINE:');
    lines.push('Paste this full report to Claude Code and say "save to baseline"');
    lines.push('Claude will update the GitHub data file in under 2 minutes.');
    lines.push(divider);
    lines.push('');
    lines.push('── DATA BLOCK (do not edit) ──');
    lines.push(buildDataBlock());

    return lines.join('\n');
  }

  // Machine-readable JSON block for Claude to parse
  function buildDataBlock(): string {
    const payload = {
      meetingDate: today(),
      generatedAt: new Date().toISOString(),
      updates: Object.fromEntries(
        allKRAs.map(({ kra, update }) => [kra.id, update])
      ),
    };
    return JSON.stringify(payload, null, 2);
  }

  const report = buildReport();

  const handleCopyReport = async () => {
    await navigator.clipboard.writeText(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCopyJson = async () => {
    await navigator.clipboard.writeText(buildDataBlock());
    setCopiedJson(true);
    setTimeout(() => setCopiedJson(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-slate-800 rounded-xl flex items-center justify-center">
              <FileText size={17} className="text-white" />
            </div>
            <div>
              <p className="font-bold text-slate-800">Meeting Report</p>
              <p className="text-xs text-slate-400">{today()} · {allKRAs.length} KRAs updated</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={18} />
          </button>
        </div>

        {/* Summary chips */}
        <div className="px-6 py-3 flex gap-2 flex-wrap border-b border-slate-100 flex-shrink-0">
          {[
            { count: offTrack.length,  label: 'Off Track',  color: 'bg-red-100 text-red-700 border-red-200',       icon: XCircle },
            { count: atRisk.length,    label: 'At Risk',    color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertTriangle },
            { count: onTrack.length,   label: 'On Track',   color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle },
            { count: decisions.length, label: 'Decisions',  color: 'bg-blue-100 text-blue-700 border-blue-200',    icon: MessageSquare },
          ].map(x => (
            <div key={x.label} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${x.color}`}>
              <x.icon size={11} />
              {x.count} {x.label}
            </div>
          ))}
        </div>

        {/* Report preview */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <pre className="text-xs text-slate-700 font-mono whitespace-pre-wrap leading-relaxed bg-slate-50 rounded-xl p-4 border border-slate-200">
            {report}
          </pre>
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0">
          <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
            <p className="text-xs font-semibold text-blue-700 mb-1">How to save to GitHub:</p>
            <ol className="text-xs text-blue-700 space-y-0.5 list-decimal list-inside">
              <li>Click "Copy Full Report" below</li>
              <li>Open Claude Code and paste it</li>
              <li>Say <strong>"save to baseline"</strong></li>
              <li>Done — GitHub updates in under 2 minutes</li>
            </ol>
          </div>
          <div className="flex gap-2 justify-end">
            <button
              onClick={handleCopyJson}
              className="flex items-center gap-2 text-sm px-4 py-2 border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50"
            >
              {copiedJson ? <CheckCheck size={14} className="text-emerald-600" /> : <Copy size={14} />}
              {copiedJson ? 'Copied!' : 'Copy Data Only'}
            </button>
            <button
              onClick={handleCopyReport}
              className="flex items-center gap-2 text-sm px-5 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700"
            >
              {copied ? <CheckCheck size={14} className="text-emerald-400" /> : <Copy size={14} />}
              {copied ? 'Copied!' : 'Copy Full Report'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
