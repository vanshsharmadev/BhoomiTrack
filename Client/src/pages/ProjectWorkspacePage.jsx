import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';

export const ProjectWorkspacePage = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const {
    projects,
    parcels,
    notifications,
    awards,
    dbtTransactions,
    rrFamilies,
    possessions,
    auditLogs
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

  // Find project
  const project = projects.find((p) => p.id === projectId || p.projectCode === projectId) || projects[0];

  // Linked records directly matching backend modules
  const linkedParcels = parcels.filter((pcl) => pcl.projectId === project.numericId || pcl.projectId === project.id || pcl.projectName === project.name);
  const linkedNotifs = notifications.filter((n) => n.projectCode === project.projectCode || n.projectId === project.numericId);
  const linkedAwards = awards.filter((a) => a.projectCode === project.projectCode || a.projectId === project.numericId);
  const linkedDbt = dbtTransactions.filter((t) => t.projectId === project.numericId || t.projectCode === project.projectCode);
  const linkedRr = rrFamilies.filter((r) => r.projectId === project.numericId || r.projectCode === project.projectCode);
  const linkedPossessions = possessions.filter((pos) => pos.projectId === project.numericId || pos.projectCode === project.projectCode);
  const linkedAudits = auditLogs.filter((a) => a.details?.includes(project.projectCode) || a.entity?.includes(project.id) || a.entity?.includes(project.projectCode));

  const tabs = [
    { id: 'overview', label: 'Overview & Lifecycle', icon: 'dashboard' },
    { id: 'parcels', label: `Land Parcels (${linkedParcels.length})`, icon: 'grid_view' },
    { id: 'notifications', label: `Gazette Notices (${linkedNotifs.length})`, icon: 'campaign' },
    { id: 'awards', label: `Awards & Solatium (${linkedAwards.length})`, icon: 'payments' },
    { id: 'compensation', label: `Compensation (${linkedDbt.length || dbtTransactions.length})`, icon: 'account_balance_wallet' },
    { id: 'possession', label: `Possession Logs (${linkedPossessions.length})`, icon: 'transfer_within_a_station' },
    { id: 'rr', label: `R&R Families (${linkedRr.length})`, icon: 'domain' },
    { id: 'audit', label: 'Audit Trail', icon: 'history_edu' }
  ];

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Workspace Header Strip */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-secondary bg-surface-container-high px-2 py-0.5 rounded">
              {project.projectCode}
            </span>
            <span className="text-outline">•</span>
            <span className="text-xs text-on-surface-variant font-medium">{project.agencyFullName || project.agency}</span>
            <span className="text-outline">•</span>
            <StatusBadge status={project.overallStatus || project.status} />
          </div>
          <h1 className="font-bold text-xl text-primary tracking-tight mt-1">{project.name || project.projectName}</h1>
          <p className="text-xs text-on-surface-variant mt-0.5">
            {project.corridorType || project.projectType} • {project.state} ({project.district}) • Unit: {project.requiredLandUnit || 'ACRES'}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap self-end md:self-auto">
          <button
            onClick={() => navigate(`/gis?projectId=${project.numericId || project.id}`)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold border border-outline-variant/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">map</span>
            <span>Open in GIS</span>
          </button>
          <button
            onClick={() => navigate('/reports')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-primary text-xs font-semibold border border-outline-variant/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">assessment</span>
            <span>Project Reports</span>
          </button>
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-on-primary text-xs font-semibold hover:bg-primary-container transition-colors"
          >
            <span>Back to Registry</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto border-b border-outline-variant/20 pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-2 rounded text-xs font-semibold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-primary text-on-primary shadow-xs'
                : 'bg-surface-container-lowest text-on-surface-variant hover:bg-surface-container border border-outline-variant/30'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB CONTENT: 1. OVERVIEW & LIFECYCLE */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <KpiCard title="Estimated Land Requirement" value={`${project.landRequiredHa || 150} Ha`} subtitle={`${project.progressPercent || 25}% Progress`} icon="straighten" />
            <KpiCard title="Current Statutory Stage" value={project.statutorySection || 'Sec 11'} subtitle={project.currentStage || 'Stage 01: Inception'} icon="timeline" />
            <KpiCard title="Total Compensation Outlay" value={`₹${project.compensationSanctionedCr || 150} Cr`} subtitle={`₹${project.compensationDisbursedCr || 75} Cr Disbursed`} icon="payments" />
            <KpiCard title="Projected Completion" value={project.expectedCompletionDate || '2028-12-31'} subtitle={`Started ${project.projectStartDate || '2026-01-01'}`} icon="event" />
          </div>

          <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-primary">Statutory 9-Stage RFCTLARR Acquisition Pipeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20 text-xs">
                <div className="font-bold text-primary">Stage 1: Requisition & DPR Proposal</div>
                <div className="text-[11px] text-on-surface-variant mt-1">Multi-tier administrative review and Collector sanction.</div>
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-[#EAF7EC] text-[#107307] text-[10px] font-bold">Completed</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20 text-xs">
                <div className="font-bold text-primary">Stage 2: Section 11 Preliminary Gazette</div>
                <div className="text-[11px] text-on-surface-variant mt-1">Official publication in state gazette and regional daily.</div>
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-primary-fixed text-on-primary-fixed text-[10px] font-bold">Active / In Progress</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20 text-xs">
                <div className="font-bold text-primary">Stage 3: Section 23 Award & Solatium</div>
                <div className="text-[11px] text-on-surface-variant mt-1">Mandatory 100% Solatium determination and PFMS DBT.</div>
                <span className="inline-block mt-2 px-2 py-0.5 rounded bg-surface-container-high text-secondary text-[10px] font-bold">Pending Sec 19</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 2. LAND PARCELS */}
      {activeTab === 'parcels' && (
        <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-bold text-sm text-primary">Cadastral Revenue Parcels</h3>
            <button onClick={() => navigate('/land/parcels')} className="text-xs text-secondary font-semibold hover:underline">
              Open Master Parcels Grid →
            </button>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                <tr className="h-10">
                  <th className="px-4 py-2 font-semibold">Parcel No</th>
                  <th className="px-4 py-2 font-semibold">Survey / Khasra</th>
                  <th className="px-4 py-2 font-semibold">Village</th>
                  <th className="px-4 py-2 font-semibold">Owner Name</th>
                  <th className="px-4 py-2 font-semibold">Area</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                  <th className="px-4 py-2 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-mono">
                {linkedParcels.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-bold text-primary">{p.parcelNumber || p.id}</td>
                    <td className="px-4 py-3 text-secondary">{p.khasraNo || p.surveyNo}</td>
                    <td className="px-4 py-3 font-sans text-on-surface-variant">{p.village}</td>
                    <td className="px-4 py-3 font-sans font-medium text-primary">{p.ownerName}</td>
                    <td className="px-4 py-3 font-bold text-primary">{p.areaHa || p.area} Ha</td>
                    <td className="px-4 py-3 font-sans"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3 font-sans">
                      <button onClick={() => navigate(`/land/parcels/${p.id}`)} className="text-xs text-secondary hover:underline font-semibold">
                        Details →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 3. NOTIFICATIONS */}
      {activeTab === 'notifications' && (
        <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-bold text-sm text-primary">Statutory Gazette Notifications</h3>
            <button onClick={() => navigate('/acquisition/notifications')} className="text-xs text-secondary font-semibold hover:underline">
              View All Gazette Notices →
            </button>
          </div>
          <div className="space-y-2 text-xs">
            {linkedNotifs.map((n) => (
              <div key={n.id} className="p-3 rounded bg-surface-container-low/40 border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-primary">{n.id}</span>
                    <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-[11px] font-semibold">{n.type}</span>
                  </div>
                  <div className="text-on-surface-variant mt-1">Gazette Ref: {n.gazetteNo} • Issued: {n.issueDate}</div>
                </div>
                <StatusBadge status={n.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 4. AWARDS */}
      {activeTab === 'awards' && (
        <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-bold text-sm text-primary">Section 23 Statutory Awards & 100% Solatium</h3>
            <button onClick={() => navigate('/compensation/awards')} className="text-xs text-secondary font-semibold hover:underline">
              Open Awards Ledger →
            </button>
          </div>
          <div className="space-y-3">
            {linkedAwards.map((a) => (
              <div key={a.id} className="p-3 rounded bg-surface-container-low/40 border border-outline-variant/20 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-primary text-sm">{a.id}</span>
                    <span className="font-mono text-on-surface-variant">Khasra {a.khasraNo}</span>
                  </div>
                  <div className="text-on-surface-variant mt-1">
                    Beneficiary: <strong>{a.beneficiaryName}</strong> • Market Value: ₹{a.marketValueCr} Cr • Solatium: ₹{a.solatiumCr} Cr
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right font-mono">
                    <span className="font-bold text-primary text-base">₹{a.totalAwardCr} Cr</span>
                    <div className="text-[10px] text-[#107307]">{a.status}</div>
                  </div>
                  <button onClick={() => navigate(`/compensation/awards/${a.id}`)} className="px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs">
                    Inspect Award
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 5. COMPENSATION */}
      {activeTab === 'compensation' && (
        <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-bold text-sm text-primary">Direct Benefit Transfer (DBT) & Treasury Ledger</h3>
            <button onClick={() => navigate('/compensation/disbursement')} className="text-xs text-secondary font-semibold hover:underline">
              Open Disbursement Roster →
            </button>
          </div>
          <div className="w-full overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                <tr className="h-10">
                  <th className="px-4 py-2 font-semibold">Transaction Ref</th>
                  <th className="px-4 py-2 font-semibold">Beneficiary</th>
                  <th className="px-4 py-2 font-semibold">Amount</th>
                  <th className="px-4 py-2 font-semibold">Bank UTR</th>
                  <th className="px-4 py-2 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/20 font-mono">
                {dbtTransactions.slice(0, 5).map((t) => (
                  <tr key={t.id} className="hover:bg-surface-container-low transition-colors">
                    <td className="px-4 py-3 font-bold text-primary">{t.id}</td>
                    <td className="px-4 py-3 font-sans text-primary">{t.beneficiaryName}</td>
                    <td className="px-4 py-3 font-bold text-[#107307]">₹{(t.amount / 100000).toFixed(2)} Lakh</td>
                    <td className="px-4 py-3 text-secondary">{t.bankUtr}</td>
                    <td className="px-4 py-3 font-sans"><StatusBadge status={t.pfmsStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB CONTENT: 6. POSSESSION */}
      {activeTab === 'possession' && (
        <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-bold text-sm text-primary">Physical Land Possession & Panchnama Logs</h3>
            <button onClick={() => navigate('/acquisition/possession')} className="text-xs text-secondary font-semibold hover:underline">
              Open Possession Roster →
            </button>
          </div>
          <div className="space-y-2 text-xs">
            {possessions.slice(0, 5).map((pos) => (
              <div key={pos.id} className="p-3 rounded bg-surface-container-low/40 border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold font-mono text-primary">{pos.id}</span>
                    <span className="font-mono text-secondary">Khasra {pos.khasraNo}</span>
                  </div>
                  <div className="text-on-surface-variant mt-1">Village: {pos.village} • Officer: {pos.executingAuthority}</div>
                </div>
                <StatusBadge status={pos.status} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 7. R&R */}
      {activeTab === 'rr' && (
        <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-bold text-sm text-primary">Rehabilitation & Resettlement (R&R) Families</h3>
            <button onClick={() => navigate('/rr')} className="text-xs text-secondary font-semibold hover:underline">
              Open R&R Management →
            </button>
          </div>
          <div className="space-y-2 text-xs">
            {rrFamilies.slice(0, 5).map((f) => (
              <div key={f.id} className="p-3 rounded bg-surface-container-low/40 border border-outline-variant/20 flex items-center justify-between">
                <div>
                  <div className="font-bold text-primary">{f.headName} ({f.membersCount} Members)</div>
                  <div className="text-on-surface-variant mt-0.5">{f.entitlement}</div>
                </div>
                <StatusBadge status={f.rehabStatus} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB CONTENT: 8. AUDIT HISTORY */}
      {activeTab === 'audit' && (
        <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
            <h3 className="font-bold text-sm text-primary">STQC L-4 Cryptographic Audit Trail</h3>
            <button onClick={() => navigate('/governance/audit')} className="text-xs text-secondary font-semibold hover:underline">
              Open Global Audit Log →
            </button>
          </div>
          <div className="divide-y divide-outline-variant/20 text-xs">
            {auditLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="py-2.5 flex items-start justify-between gap-4 font-mono">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-primary">{log.action}</span>
                    <span className="text-on-surface-variant">• {log.module}</span>
                    <span className="text-secondary text-[11px]">[{log.entity}]</span>
                  </div>
                  <p className="text-on-surface font-sans text-xs mt-0.5">{log.details}</p>
                  <div className="text-[10px] text-outline mt-0.5">
                    Actor: {log.actorName} ({log.actorRole}) • Hash: {log.hash}
                  </div>
                </div>
                <span className="text-on-surface-variant text-[11px] whitespace-nowrap">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
