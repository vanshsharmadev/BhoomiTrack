import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';

const PROPOSALS_DATA = [
  {
    id: 'PROP-2026-MoRTH-042',
    projectTitle: 'Surat–Nashik Greenfield Industrial Expressway Spur',
    agency: 'NHAI',
    ministry: 'MoRTH',
    state: 'Gujarat & Maharashtra',
    districts: 'Surat, Navsari, Nashik',
    submissionDate: '2026-08-14',
    currentStage: 'Stage 01: SIA Feasibility Vetting',
    assignedOfficer: 'Dr. V. K. Ramanujam, IAS',
    slaDaysRemaining: 18,
    estimatedLandHa: 340.5,
    estimatedCostCr: 4200.0,
    status: 'Pending Scrutiny',
    technicalScrutiny: 'RoW alignment confirmed with PM GatiShakti NMP v4. Zero railway interlocking conflicts.',
    financialScrutiny: 'Escrow funding provisioned under Bharatmala Tranche-II budget head 5054.',
    legalScrutiny: 'Section 4 SIA public notification issued in 14 village panchayats.',
    dprSummary: '112 km 6-lane access-controlled greenfield expressway to accelerate container movement between Hazira Port and JNPT.',
    queriesCount: 2
  },
  {
    id: 'PROP-2026-RAIL-019',
    projectTitle: 'Dedicated Rail Feeder Line to Dholera SIR',
    agency: 'DFCCIL',
    agencyFullName: 'Dedicated Freight Corridor Corporation of India Ltd',
    ministry: 'Ministry of Railways',
    state: 'Gujarat',
    districts: 'Ahmedabad (Dholera Taluka)',
    submissionDate: '2026-09-02',
    currentStage: 'Stage 01: Forest Buffer Verification',
    assignedOfficer: 'Shri S. K. Patel, IAS',
    slaDaysRemaining: 24,
    estimatedLandHa: 195.2,
    estimatedCostCr: 1850.0,
    status: 'Clarification Required',
    technicalScrutiny: 'Alignment traverses 8.4 Ha protected mangrove buffer near Gulf of Khambhat. Environmental NOC pending.',
    financialScrutiny: 'Sanction approved by Railway Board Infra Committee.',
    legalScrutiny: 'CRZ Clearance application submitted to MoEFCC.',
    dprSummary: '42 km high-axle freight spur providing direct connection between Western DFC and Dholera Special Investment Region.',
    queriesCount: 4
  },
  {
    id: 'PROP-2025-NHAI-108',
    projectTitle: 'Delhi–Mumbai Expressway Pkg 14 (Vadodara–Kim Spur)',
    agency: 'NHAI',
    ministry: 'MoRTH',
    state: 'Gujarat',
    districts: 'Surat, Vadodara',
    submissionDate: '2024-06-10',
    currentStage: 'Stage 01: DPR Scrutiny Complete',
    assignedOfficer: 'CALA Surat',
    slaDaysRemaining: 0,
    estimatedLandHa: 312.4,
    estimatedCostCr: 3890.0,
    status: 'Approved',
    technicalScrutiny: '100% vetted against satellite orthomosaics.',
    financialScrutiny: '₹1,840.5 Cr land compensation sanctioned.',
    legalScrutiny: 'Sec 11 preliminary gazette notified.',
    dprSummary: 'Statutory scrutiny completed. Active in acquisition execution.',
    queriesCount: 0
  }
];

export const ProposalsPage = () => {
  const { proposalId } = useParams();
  const navigate = useNavigate();
  const { proposals, approveProposal, showToast } = useApp();

  const [activeFilter, setActiveFilter] = useState('ALL');

  const selectedProposal = proposalId
    ? proposals.find((p) => p.id === proposalId)
    : null;

  const handleApproveProposal = async (id) => {
    await approveProposal(id);
  };

  const filteredProposals = proposals.filter((p) => {
    if (activeFilter === 'ALL') return true;
    return p.status.toLowerCase().includes(activeFilter.toLowerCase());
  });

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Title */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-primary tracking-tight">Proposals & DPR Scrutiny</h1>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-xs font-mono font-semibold">
              Statutory Gate 01
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Pre-notification scrutiny, Detailed Project Report (DPR) alignment vetting, SIA feasibility, and Ministry sanction gating under RFCTLARR Act 2013.
          </p>
        </div>

        {selectedProposal ? (
          <button
            onClick={() => navigate('/acquisition/proposals')}
            className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold"
          >
            ← Back to Scrutiny Queue
          </button>
        ) : (
          <button
            onClick={() => showToast('New DPR Ingestion Wizard opened', 'info')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-primary-container text-on-primary hover:bg-primary text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            <span>+ Submit New Project Proposal</span>
          </button>
        )}
      </div>

      {/* Detail View for Proposal */}
      {selectedProposal ? (
        <div className="space-y-4 animate-in fade-in duration-100">
          <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
              <div>
                <span className="font-mono text-xs font-bold text-secondary">{selectedProposal.id}</span>
                <h2 className="font-bold text-base text-primary mt-0.5">{selectedProposal.projectTitle}</h2>
                <div className="text-xs text-on-surface-variant mt-0.5">
                  {selectedProposal.agency} • {selectedProposal.ministry} • Jurisdiction: {selectedProposal.districts} ({selectedProposal.state})
                </div>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={selectedProposal.status} />
                {selectedProposal.status !== 'Approved' && (
                  <button
                    onClick={() => handleApproveProposal(selectedProposal.id)}
                    className="px-4 py-2 rounded bg-[#107307] text-white hover:bg-emerald-800 text-xs font-bold shadow-md transition-all"
                  >
                    ✓ Grant Statutory Approval
                  </button>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Estimated Land</span>
                <span className="font-bold text-primary text-sm">{selectedProposal.estimatedLandHa} Ha</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Sanctioned Estimate</span>
                <span className="font-bold text-primary text-sm">₹{selectedProposal.estimatedCostCr.toLocaleString()} Cr</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Assigned Nodal Officer</span>
                <span className="font-bold text-primary text-xs">{selectedProposal.assignedOfficer}</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Statutory SLA</span>
                <span className="font-bold text-secondary text-sm">{selectedProposal.slaDaysRemaining} Days Left</span>
              </div>
            </div>

            {/* Scrutiny Sections */}
            <div className="space-y-3">
              <div className="p-3 rounded bg-surface-container-low/50 border border-outline-variant/20">
                <span className="font-bold text-xs uppercase text-primary block mb-1">Detailed Project Report (DPR) Executive Summary</span>
                <p className="text-xs text-on-surface leading-relaxed">{selectedProposal.dprSummary}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-surface-container-lowest border border-outline-variant/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <span className="material-symbols-outlined text-secondary text-[16px]">engineering</span>
                    <span>1. Technical Scrutiny</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">{selectedProposal.technicalScrutiny}</p>
                </div>

                <div className="p-3 rounded bg-surface-container-lowest border border-outline-variant/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <span className="material-symbols-outlined text-[#107307] text-[16px]">account_balance_wallet</span>
                    <span>2. Financial Scrutiny</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">{selectedProposal.financialScrutiny}</p>
                </div>

                <div className="p-3 rounded bg-surface-container-lowest border border-outline-variant/30 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-primary">
                    <span className="material-symbols-outlined text-secondary text-[16px]">gavel</span>
                    <span>3. Legal & SIA Scrutiny</span>
                  </div>
                  <p className="text-on-surface-variant text-[11px] leading-relaxed">{selectedProposal.legalScrutiny}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Scrutiny Table View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <KpiCard title="Active Scrutiny Queue" value="42" subtitle="18 NHAI • 12 Rail" icon="assignment" />
            <KpiCard title="Avg Scrutiny Velocity" value="14.2" unit="Days" subtitle="Statutory SLA: 30 Days" icon="speed" />
            <KpiCard title="Approved Tranche-II" value="28" subtitle="₹1.42 Lakh Cr Sanctioned" icon="check_circle" />
            <KpiCard title="Clarification Pending" value="7" subtitle="Forest & CRZ Gating" alert={true} icon="pending_actions" />
          </div>

          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1">
                {['ALL', 'Pending', 'Clarification', 'Approved'].map((f) => (
                  <button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    className={`px-3 py-1 rounded text-xs font-semibold ${
                      activeFilter === f ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:bg-surface-container'
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <span className="text-on-surface-variant text-[11px] font-mono">
                {filteredProposals.length} Proposals Listed
              </span>
            </div>

            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider">
                  <tr className="h-10">
                    <th className="px-4 py-2 font-semibold">Proposal ID</th>
                    <th className="px-4 py-2 font-semibold">Project Title</th>
                    <th className="px-4 py-2 font-semibold">Agency</th>
                    <th className="px-4 py-2 font-semibold">State</th>
                    <th className="px-4 py-2 font-semibold">Submitted</th>
                    <th className="px-4 py-2 font-semibold">Nodal Officer</th>
                    <th className="px-4 py-2 font-semibold text-center">SLA Clock</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredProposals.map((prop) => (
                    <tr
                      key={prop.id}
                      onClick={() => navigate(`/acquisition/proposals/${prop.id}`)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-primary">{prop.id}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-primary block truncate max-w-xs">{prop.projectTitle}</span>
                        <span className="text-[11px] text-on-surface-variant">{prop.estimatedLandHa} Ha • ₹{prop.estimatedCostCr} Cr</span>
                      </td>
                      <td className="px-4 py-3 font-bold text-secondary">{prop.agency}</td>
                      <td className="px-4 py-3">{prop.state}</td>
                      <td className="px-4 py-3 font-mono">{prop.submissionDate}</td>
                      <td className="px-4 py-3">{prop.assignedOfficer}</td>
                      <td className="px-4 py-3 text-center font-mono">
                        <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-bold">
                          {prop.slaDaysRemaining}d
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={prop.status} />
                      </td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/acquisition/proposals/${prop.id}`)}
                          className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs"
                        >
                          Scrutinize →
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
