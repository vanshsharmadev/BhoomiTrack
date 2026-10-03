import React from 'react';
import { useApp } from '../context/AppContext';
import { KpiCard } from '../components/common/KpiCard';

export const AuditPage = () => {
  const { auditLogs } = useApp();

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Title */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-primary tracking-tight">STQC L-4 Sovereign Audit Trail Log</h1>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-xs font-mono font-semibold">
              Immutable Cryptographic Chain
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Append-only evidentiary ledger of administrative approvals, valuation changes, statutory gazette issuances, and PFMS financial transactions.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded bg-[#EAF7EC] text-[#107307] text-xs font-mono font-bold border border-[#B8E4BC]">
            Audit Integrity: 100% Certified
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
        <KpiCard title="Total Audit Entries" value="1.82M" subtitle="Indexed since Genesis" icon="history_edu" />
        <KpiCard title="STQC L-4 Verification" value="Pass" subtitle="Zero Hash Breaches" icon="verified" />
        <KpiCard title="Financial Actions Logged" value="100%" subtitle="PFMS Double-Entry Audited" icon="account_balance" />
        <KpiCard title="Retention Horizon" value="50 Years" subtitle="National Archives Mandate" icon="inventory_2" />
      </div>

      {/* Table */}
      <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
              <tr className="h-10">
                <th className="px-4 py-2 font-semibold">Audit Event ID</th>
                <th className="px-4 py-2 font-semibold">Timestamp (IST)</th>
                <th className="px-4 py-2 font-semibold">Actor & Role</th>
                <th className="px-4 py-2 font-semibold">Module</th>
                <th className="px-4 py-2 font-semibold">Target Entity</th>
                <th className="px-4 py-2 font-semibold">Statutory Action</th>
                <th className="px-4 py-2 font-semibold">Details</th>
                <th className="px-4 py-2 font-semibold">Hash Block</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-mono">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-4 py-3 font-bold text-primary">{log.id}</td>
                  <td className="px-4 py-3 text-on-surface-variant whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3 font-sans">
                    <span className="font-semibold text-primary block">{log.actorName}</span>
                    <span className="text-[11px] text-on-surface-variant">{log.actorRole}</span>
                  </td>
                  <td className="px-4 py-3 font-sans text-secondary font-medium">{log.module}</td>
                  <td className="px-4 py-3 text-primary font-bold">{log.entity}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-semibold text-[11px]">
                      {log.action}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-sans text-on-surface text-xs max-w-xs">{log.details}</td>
                  <td className="px-4 py-3 text-secondary text-[11px]">{log.hash}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
