import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';

export const RrPage = () => {
  const { familyId } = useParams();
  const navigate = useNavigate();
  const { rrFamilies } = useApp();

  const selectedFamily = familyId
    ? rrFamilies.find((f) => f.id === familyId)
    : null;

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Title */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-primary tracking-tight">Rehabilitation & Resettlement (R&R) Management</h1>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-xs font-mono font-semibold">
              RFCTLARR Schedule II Statutory Entitlements
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            SIA displaced family census, housing plot allotments, subsistence grants, livelihood assistance packages, and resettlement colony infrastructure.
          </p>
        </div>

        {selectedFamily && (
          <button
            onClick={() => navigate('/rr')}
            className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold"
          >
            ← Back to R&R Roster
          </button>
        )}
      </div>

      {/* Detail View for R&R Family */}
      {selectedFamily ? (
        <div className="space-y-4 animate-in fade-in duration-100">
          <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-primary">{selectedFamily.id}</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono text-xs font-bold">
                    {selectedFamily.entitlementCategory}
                  </span>
                </div>
                <h2 className="font-bold text-base text-primary mt-1">Head of Family: {selectedFamily.headOfFamily}</h2>
                <div className="text-xs text-on-surface-variant mt-0.5">
                  Village: {selectedFamily.village} ({selectedFamily.district}, {selectedFamily.state}) • Family Members: <strong>{selectedFamily.membersCount}</strong>
                </div>
              </div>

              <StatusBadge status={selectedFamily.status} />
            </div>

            {/* Schedule II Entitlements Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded bg-surface-container-low border border-outline-variant/20 space-y-1">
                <span className="text-[10px] text-outline uppercase font-semibold block">1. Housing Entitlement</span>
                <span className="font-bold text-primary text-sm block">{selectedFamily.housingAllotment}</span>
                <p className="text-on-surface-variant text-[11px] mt-0.5">
                  Colony Site: {selectedFamily.resettlementColonyLocation}
                </p>
              </div>

              <div className="p-3.5 rounded bg-surface-container-low border border-outline-variant/20 space-y-1">
                <span className="text-[10px] text-outline uppercase font-semibold block">2. Subsistence Allowance</span>
                <span className="font-bold text-[#107307] text-sm block">{selectedFamily.subsistenceGrant}</span>
                <p className="text-on-surface-variant text-[11px] mt-0.5">
                  ₹3,000 per month for 12 months under RFCTLARR Section 31
                </p>
              </div>

              <div className="p-3.5 rounded bg-surface-container-low border border-outline-variant/20 space-y-1">
                <span className="text-[10px] text-outline uppercase font-semibold block">3. Livelihood Grant</span>
                <span className="font-bold text-secondary text-sm block">{selectedFamily.livelihoodAssistance}</span>
                <p className="text-on-surface-variant text-[11px] mt-0.5">
                  One-time resettlement grant or PMKVY vocational training slot
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* R&R Table View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <KpiCard title="Displaced Families" value="8,92,400" subtitle="Schedule II Identified" icon="family_restroom" />
            <KpiCard title="Housing Allotted" value="7,41,000" subtitle="83% Physical Handover" progress={83} icon="home" />
            <KpiCard title="Subsistence Grants" value="₹3,212" unit="Cr" subtitle="100% PFMS Disbursed" icon="payments" />
            <KpiCard title="Livelihood Assisted" value="6,82,000" subtitle="Jobs & Skill Credits" icon="work" />
          </div>

          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                  <tr className="h-10">
                    <th className="px-4 py-2 font-semibold">Family ID</th>
                    <th className="px-4 py-2 font-semibold">Head of Family</th>
                    <th className="px-4 py-2 font-semibold">Village / State</th>
                    <th className="px-4 py-2 font-semibold">Vulnerability Criteria</th>
                    <th className="px-4 py-2 font-semibold">Housing Allotment</th>
                    <th className="px-4 py-2 font-semibold">Subsistence Grant</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {rrFamilies.map((fam) => (
                    <tr
                      key={fam.id}
                      onClick={() => navigate(`/rr/${fam.id}`)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-primary">{fam.id}</td>
                      <td className="px-4 py-3 font-semibold text-primary">{fam.headOfFamily}</td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-primary block">{fam.village}</span>
                        <span className="text-[11px] text-on-surface-variant font-mono">{fam.district} ({fam.state})</span>
                      </td>
                      <td className="px-4 py-3 text-on-surface-variant font-medium">{fam.vulnerabilityClass}</td>
                      <td className="px-4 py-3 font-medium text-secondary truncate max-w-xs">{fam.housingAllotment}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#107307]">{fam.subsistenceGrant}</td>
                      <td className="px-4 py-3"><StatusBadge status={fam.status} /></td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/rr/${fam.id}`)}
                          className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs"
                        >
                          Dossier →
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
