import React from 'react';
import { Clock, ShieldCheck, FileText, Database, UserCheck, CheckCircle2 } from 'lucide-react';
import { AuditLogEntry } from '../types';

interface AdminAuditLogProps {
  logs: AuditLogEntry[];
}

export const AdminAuditLog: React.FC<AdminAuditLogProps> = ({ logs }) => {
  return (
    <div className="space-y-6">
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-white shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30">
            Compliance & Transparency
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-300">Statutory Tax Research Audit Trail</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-black tracking-tight">
          System Audit & Verification Trail
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
          Chronological record of knowledge verifications, resource generation, tax year updates, and firm policy modifications.
        </p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                <th className="p-3 font-bold">Timestamp</th>
                <th className="p-3 font-bold">User</th>
                <th className="p-3 font-bold">Action</th>
                <th className="p-3 font-bold">Target</th>
                <th className="p-3 font-bold">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-500 font-mono text-[11px] whitespace-nowrap">
                    {log.timestamp}
                  </td>
                  <td className="p-3 font-bold text-slate-900 whitespace-nowrap">
                    {log.user}
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 font-semibold rounded text-[10px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="p-3 text-slate-700 font-mono text-[11px]">
                    {log.targetType}:{log.targetId}
                  </td>
                  <td className="p-3 text-slate-600 text-[11px]">
                    {log.details}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
