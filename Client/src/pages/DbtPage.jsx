import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';

export const DbtPage = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { dbtTransactions, executeDbt } = useApp();

  const selectedTxn = transactionId
    ? dbtTransactions.find((t) => t.id === transactionId)
    : null;

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Title */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-primary tracking-tight">Direct Benefit Transfer (DBT) Disbursal Engine</h1>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-[#107307] text-xs font-mono font-semibold">
              PFMS Host-to-Host Integration Live
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Real-time electronic treasury disbursal under RFCTLARR Act 2013, Aadhaar NPCI mapper clearance, and bank reconciliation exception management.
          </p>
        </div>

        {selectedTxn && (
          <button
            onClick={() => navigate('/compensation/dbt')}
            className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold"
          >
            ← Back to PFMS Ledger
          </button>
        )}
      </div>

      {/* Detail View for DBT Transaction */}
      {selectedTxn ? (
        <div className="space-y-4 animate-in fade-in duration-100">
          <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-primary">{selectedTxn.id}</span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-secondary">
                    Award: {selectedTxn.awardId}
                  </span>
                </div>
                <h2 className="font-bold text-base text-primary mt-1">Beneficiary: {selectedTxn.beneficiaryName}</h2>
                <div className="text-xs text-on-surface-variant font-mono mt-0.5">
                  Aadhaar: <strong>{selectedTxn.maskedAadhaar}</strong> • Bank: {selectedTxn.bankName} ({selectedTxn.maskedAccount}) • IFSC: {selectedTxn.ifsc}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={selectedTxn.pfmsStatus} />
                {!selectedTxn.pfmsStatus.includes('Successful') && (
                  <button
                    onClick={() => executeDbt(selectedTxn.id)}
                    className="px-4 py-2 rounded bg-primary text-on-primary hover:bg-primary-container text-xs font-bold shadow-md transition-colors"
                  >
                    Execute PFMS Disbursal
                  </button>
                )}
              </div>
            </div>

            {/* Financial Telemetry */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Sanctioned Amount</span>
                <span className="font-bold text-[#107307] text-base">₹{(selectedTxn.amountRupees / 100000).toFixed(2)} Lakh</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Initiation Timestamp</span>
                <span className="font-bold text-primary text-xs">{selectedTxn.initiationDate}</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Bank UTR Number</span>
                <span className="font-bold text-secondary text-xs">{selectedTxn.bankUtr || 'Pending Clearing'}</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">NPCI Mapper Status</span>
                <span className={`font-bold text-xs ${selectedTxn.npciMapperMatch ? 'text-[#107307]' : 'text-error'}`}>
                  {selectedTxn.npciMapperMatch ? '✓ Aadhaar Seeded & Active' : '✕ Name Mismatch Discrepancy'}
                </span>
              </div>
            </div>

            {/* Exception Callout (if any) */}
            {selectedTxn.exceptionReason && (
              <div className="p-3 rounded bg-[#FFF8F0] border border-[#FCD3B6] text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-[#D95D08] font-bold">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  <span>Reconciliation Exception Diagnostic</span>
                </div>
                <p className="text-on-surface leading-relaxed font-mono">{selectedTxn.exceptionReason}</p>
                <div className="pt-2 flex items-center gap-2">
                  <button
                    onClick={() => executeDbt(selectedTxn.id)}
                    className="px-3 py-1 rounded bg-[#D95D08] text-white hover:bg-amber-800 text-xs font-semibold shadow-sm"
                  >
                    Override with Tehsildar Affidavit & Re-disburse
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* DBT Master Stream Table */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <KpiCard title="Total Disbursed (PFMS)" value="₹1,88,420" unit="Cr" subtitle="87.7% Settled" icon="payments" />
            <KpiCard title="Disbursed Today" value="₹142.8" unit="Cr" subtitle="3,420 Farmers Credited" icon="account_balance" />
            <KpiCard title="NPCI Aadhaar Match" value="99.2%" subtitle="Direct Bank Mapping" icon="fingerprint" />
            <KpiCard title="Reconciliation Exceptions" value="0.8%" subtitle="Name & IFSC Discrepancies" alert={true} icon="sync_problem" />
          </div>

          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                  <tr className="h-10">
                    <th className="px-4 py-2 font-semibold">Transaction ID</th>
                    <th className="px-4 py-2 font-semibold">Award Ref</th>
                    <th className="px-4 py-2 font-semibold">Beneficiary Name</th>
                    <th className="px-4 py-2 font-semibold">Masked Account</th>
                    <th className="px-4 py-2 font-semibold text-right">Disbursed Amount</th>
                    <th className="px-4 py-2 font-semibold">Bank Status</th>
                    <th className="px-4 py-2 font-semibold text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {dbtTransactions.map((tx) => (
                    <tr
                      key={tx.id}
                      onClick={() => navigate(`/compensation/dbt/${tx.id}`)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-primary">{tx.id}</td>
                      <td className="px-4 py-3 font-mono text-secondary">{tx.awardId}</td>
                      <td className="px-4 py-3 font-semibold text-primary">{tx.beneficiaryName}</td>
                      <td className="px-4 py-3 font-mono text-on-surface-variant">
                        {tx.bankName} ({tx.maskedAccount})
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#107307] text-sm">
                        ₹{(tx.amountRupees / 100000).toFixed(2)} Lakh
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={tx.pfmsStatus} /></td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/compensation/dbt/${tx.id}`)}
                          className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs"
                        >
                          Audit UTR →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
