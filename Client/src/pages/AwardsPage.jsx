import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';

export const AwardsPage = () => {
  const { awardId } = useParams();
  const navigate = useNavigate();
  const { awards, approveAward } = useApp();

  const selectedAward = awardId
    ? awards.find((a) => a.id === awardId)
    : null;

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Title */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-primary tracking-tight">Statutory Awards & Solatium Calculation (Section 23 & 30)</h1>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-xs font-mono font-semibold">
              RFCTLARR 100% Solatium Mandate
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Market valuation assessment, statutory multiplier calibration, 100% Solatium determination, and Competent Authority award sanctioning.
          </p>
        </div>

        {selectedAward && (
          <button
            onClick={() => navigate('/compensation/awards')}
            className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold"
          >
            ← Back to Awards Roster
          </button>
        )}
      </div>

      {/* Award Detail View */}
      {selectedAward ? (
        <div className="space-y-4 animate-in fade-in duration-100">
          <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-primary">{selectedAward.id}</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-mono text-xs">
                    Khasra {selectedAward.khasraNo}
                  </span>
                </div>
                <h2 className="font-bold text-sm text-primary mt-1">{selectedAward.projectName}</h2>
                <div className="text-xs text-on-surface-variant mt-0.5">
                  Beneficiary: <strong>{selectedAward.beneficiaryName}</strong> ({selectedAward.beneficiaryId})
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={selectedAward.status} />
                {selectedAward.status.includes('Collector') && (
                  <button
                    onClick={() => approveAward(selectedAward.id)}
                    className="px-4 py-2 rounded bg-primary text-on-primary hover:bg-primary-container text-xs font-bold shadow-md transition-colors"
                  >
                    ✓ Authorize Award Sanction
                  </button>
                )}
              </div>
            </div>

            {/* Statutory Compensation Calculation Matrix */}
            <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30 space-y-3">
              <span className="font-bold text-xs uppercase tracking-wider text-primary block">
                Section 26 to 30 Statutory Compensation Breakdown
              </span>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-[10px] text-outline uppercase block">1. Base Market Value</span>
                  <span className="font-bold text-primary text-base">₹{(selectedAward.baseMarketValueRupees / 100000).toFixed(2)} L</span>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">Sec 26 Circle Rate Valuation</div>
                </div>

                <div className="p-3 rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-[10px] text-outline uppercase block">2. Multiplier Factor</span>
                  <span className="font-bold text-secondary text-base">{selectedAward.multiplierFactor}.00x</span>
                  <div className="text-[10px] text-on-surface-variant mt-0.5">First Schedule Factor (Rural)</div>
                </div>

                <div className="p-3 rounded bg-surface-container-lowest border border-outline-variant/20">
                  <span className="text-[10px] text-outline uppercase block">3. Statutory Solatium</span>
                  <span className="font-bold text-[#107307] text-base">₹{(selectedAward.solatiumRupees / 100000).toFixed(2)} L</span>
                  <div className="text-[10px] text-[#107307] font-semibold mt-0.5">100% Solatium (Sec 30)</div>
                </div>

                <div className="p-3 rounded bg-primary-container text-on-primary border border-primary">
                  <span className="text-[10px] text-primary-fixed-dim uppercase block">4. Total Sanctioned Award</span>
                  <span className="font-bold text-white text-lg">₹{(selectedAward.totalAwardRupees / 100000).toFixed(2)} Lakh</span>
                  <div className="text-[10px] text-primary-fixed-dim mt-0.5">Direct PFMS Bank Credit</div>
                </div>
              </div>
            </div>

            {/* Legal Attestation Strip */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
              <div className="p-3 rounded bg-surface-container-lowest border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Declaration Officer</span>
                <span className="font-bold text-primary">{selectedAward.declaredBy}</span>
                <div className="text-[11px] text-on-surface-variant mt-0.5">Date of Award: {selectedAward.declarationDate}</div>
              </div>
              <div className="p-3 rounded bg-surface-container-lowest border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Treasury Payment Ref</span>
                <span className="font-bold text-secondary">{selectedAward.paymentReference}</span>
                <div className="text-[11px] text-[#107307] mt-0.5">Linked to PFMS Direct Benefit Gateway</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Awards Table View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <KpiCard title="Awards Declared" value="616" subtitle="Sec 23 Compliant" icon="payments" />
            <KpiCard title="Sanctioned Total" value="₹2.14L" unit="Cr" subtitle="100% Escrow Deposited" icon="account_balance_wallet" />
            <KpiCard title="100% Solatium Disbursed" value="₹1.07L" unit="Cr" subtitle="First Schedule Compliant" icon="verified" />
            <KpiCard title="Pending CALA Sanction" value="14" subtitle="Valuation Under Review" alert={true} icon="pending" />
          </div>

          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                  <tr className="h-10">
                    <th className="px-4 py-2 font-semibold">Award ID</th>
                    <th className="px-4 py-2 font-semibold">Project & Corridor</th>
                    <th className="px-4 py-2 font-semibold">Khasra / Parcel</th>
                    <th className="px-4 py-2 font-semibold">Beneficiary Name</th>
                    <th className="px-4 py-2 font-semibold text-right">Base Valuation</th>
                    <th className="px-4 py-2 font-semibold text-right">100% Solatium</th>
                    <th className="px-4 py-2 font-semibold text-right">Total Award</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {awards.map((awd) => (
                    <tr
                      key={awd.id}
                      onClick={() => navigate(`/compensation/awards/${awd.id}`)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-primary">{awd.id}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-primary block truncate max-w-xs">{awd.projectName}</span>
                        <span className="text-[11px] text-on-surface-variant font-mono">{awd.projectCode}</span>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span className="font-bold text-primary">Khasra {awd.khasraNo}</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">{awd.beneficiaryName}</td>
                      <td className="px-4 py-3 text-right font-mono">₹{(awd.baseMarketValueRupees / 100000).toFixed(2)} L</td>
                      <td className="px-4 py-3 text-right font-mono text-[#107307] font-semibold">
                        ₹{(awd.solatiumRupees / 100000).toFixed(2)} L
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-primary text-sm">
                        ₹{(awd.totalAwardRupees / 100000).toFixed(2)} L
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={awd.status} /></td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/compensation/awards/${awd.id}`)}
                          className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs"
                        >
                          Details →
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
