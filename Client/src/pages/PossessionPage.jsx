import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';

export const PossessionPage = () => {
  const { possessionId } = useParams();
  const navigate = useNavigate();
  const { possessions, executePanchnama } = useApp();

  const selectedPos = possessionId
    ? possessions.find((p) => p.id === possessionId)
    : null;

  const handleExecutePanchnama = async (id) => {
    await executePanchnama(id);
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Title */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-primary tracking-tight">Physical Possession & Handover (Section 38 & 40)</h1>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-xs font-mono font-semibold">
              Statutory Vesting & Panchnama
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Physical site possession procedures, Panchnama evidentiary dossiers, police and executive magistrate requisitioning, and encumbrance-free vesting certification.
          </p>
        </div>

        {selectedPos && (
          <button
            onClick={() => navigate('/acquisition/possession')}
            className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold"
          >
            ← Back to Possession Ledger
          </button>
        )}
      </div>

      {/* Detail View for Possession */}
      {selectedPos ? (
        <div className="space-y-4 animate-in fade-in duration-100">
          <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-primary">{selectedPos.id}</span>
                  <span className="font-bold font-mono text-xs px-2 py-0.5 rounded bg-surface-container-high text-secondary">
                    Khasra {selectedPos.khasraNo}
                  </span>
                </div>
                <h2 className="font-bold text-sm text-primary mt-1">{selectedPos.projectName}</h2>
                <div className="text-xs text-on-surface-variant mt-0.5">
                  Village: {selectedPos.village} ({selectedPos.district}, {selectedPos.state}) • Executing Authority: <strong>{selectedPos.executingAuthority}</strong>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={selectedPos.status} />
                {selectedPos.status !== 'Physical Possession Complete' && (
                  <button
                    onClick={() => handleExecutePanchnama(selectedPos.id)}
                    className="px-4 py-2 rounded bg-primary text-on-primary hover:bg-primary-container text-xs font-bold shadow-md transition-colors"
                  >
                    Execute Panchnama & Vest Land
                  </button>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Vested Area</span>
                <span className="font-bold text-primary text-sm">{selectedPos.vestedAreaHa} Ha</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Panchnama Date</span>
                <span className="font-bold text-secondary text-xs">{selectedPos.panchnamaDate}</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Police Assistance</span>
                <span className={`font-bold text-xs ${selectedPos.lawAndOrderSupportRequired ? 'text-error' : 'text-[#107307]'}`}>
                  {selectedPos.lawAndOrderSupportRequired ? 'Requisitioned' : 'Not Required'}
                </span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Panchnama Memo</span>
                <span className="font-bold text-primary text-xs">{selectedPos.signedPanchnamaUploaded ? '✓ Uploaded & DSC Signed' : 'Pending Signing'}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Possession Table View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <KpiCard title="Requisitioned Target" value="2.84M" unit="Ha" subtitle="Total Project Scope" icon="layers" />
            <KpiCard title="Physically Possessed" value="2.11M" unit="Ha" subtitle="74.2% Vested & Delivered" progress={74.2} icon="verified" />
            <KpiCard title="Panchnamas Executed" value="539" subtitle="Vesting Certificates Issued" icon="receipt_long" />
            <KpiCard title="Pending Handover" value="0.73M" unit="Ha" subtitle="Active Corridor Works" alert={true} icon="schedule" />
          </div>

          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                  <tr className="h-10">
                    <th className="px-4 py-2 font-semibold">Possession ID</th>
                    <th className="px-4 py-2 font-semibold">Project & Corridor</th>
                    <th className="px-4 py-2 font-semibold">Khasra / Village</th>
                    <th className="px-4 py-2 font-semibold text-right">Vested Area (Ha)</th>
                    <th className="px-4 py-2 font-semibold">Panchnama Date</th>
                    <th className="px-4 py-2 font-semibold">Executing CALA</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {possessions.map((pos) => (
                    <tr
                      key={pos.id}
                      onClick={() => navigate(`/acquisition/possession/${pos.id}`)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-primary">{pos.id}</td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-primary block truncate max-w-xs">{pos.projectName}</span>
                        <span className="text-[11px] text-on-surface-variant font-mono">{pos.projectId}</span>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        <span className="font-bold text-primary">Khasra {pos.khasraNo}</span>
                        <div className="text-[11px] text-on-surface-variant font-sans">{pos.village}</div>
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-primary">{pos.vestedAreaHa} Ha</td>
                      <td className="px-4 py-3 font-mono text-on-surface-variant">{pos.panchnamaDate}</td>
                      <td className="px-4 py-3 font-medium text-primary">{pos.executingAuthority}</td>
                      <td className="px-4 py-3"><StatusBadge status={pos.status} /></td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/acquisition/possession/${pos.id}`)}
                          className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs"
                        >
                          Panchnama →
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
