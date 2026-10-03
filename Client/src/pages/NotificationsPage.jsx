import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';

export const NotificationsPage = () => {
  const { notificationId } = useParams();
  const navigate = useNavigate();
  const { notifications, requestSec19Extension } = useApp();

  const selectedNotif = notificationId
    ? notifications.find((n) => n.id === notificationId || n.notificationNumber === notificationId)
    : null;

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Title */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-primary tracking-tight">Statutory Gazette Notifications</h1>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-xs font-mono font-semibold">
              RFCTLARR Sections 11, 15, 19
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Official legal notifications repository, e-Gazette publications, Section 19 1-year lapse countdowns, and CCA-accredited digital signature verification.
          </p>
        </div>

        {selectedNotif ? (
          <button
            onClick={() => navigate('/acquisition/notifications')}
            className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold"
          >
            ← Back to Notifications Register
          </button>
        ) : (
          <button
            onClick={() => navigate('/governance/vault')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold border border-outline-variant/30"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">folder_special</span>
            <span>Open Gazette Vault</span>
          </button>
        )}
      </div>

      {/* Detail View for Notification */}
      {selectedNotif ? (
        <div className="space-y-4 animate-in fade-in duration-100">
          <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-base font-bold text-primary">{selectedNotif.notificationNumber}</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-mono text-xs font-bold">
                    {selectedNotif.section}
                  </span>
                  <span className="text-xs text-on-surface-variant">{selectedNotif.type}</span>
                </div>
                <h2 className="font-bold text-sm text-primary mt-1">{selectedNotif.projectName}</h2>
                <div className="text-xs text-on-surface-variant mt-0.5">
                  e-Gazette Ref: <strong>{selectedNotif.gazetteRefNumber}</strong> • Published: {selectedNotif.gazettePublicationDate}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <StatusBadge status={selectedNotif.status} />
                {selectedNotif.daysToLapseSec19 > 0 && (
                  <button
                    onClick={() => requestSec19Extension(selectedNotif.projectCode)}
                    className="px-3 py-1.5 rounded bg-error text-white hover:bg-red-800 text-xs font-bold shadow-md transition-colors"
                  >
                    Enforce Sec 19(7) Extension
                  </button>
                )}
              </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Requisitioned Area</span>
                <span className="font-bold text-primary text-sm">{selectedNotif.totalAreaHa} Ha</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Affected Khasras</span>
                <span className="font-bold text-primary text-sm">{selectedNotif.affectedParcelsCount} Parcels</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Objection Deadline</span>
                <span className="font-bold text-secondary text-sm">{selectedNotif.objectionDeadlineDate}</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Sec 19 Statutory Clock</span>
                <span className={`font-bold text-sm ${selectedNotif.daysToLapseSec19 > 0 ? 'text-error' : 'text-[#107307]'}`}>
                  {selectedNotif.daysToLapseSec19 > 0 ? `${selectedNotif.daysToLapseSec19} Days Left` : 'Declared / Lapsed'}
                </span>
              </div>
            </div>

            {/* Document Digital Verification Box */}
            <div className="p-4 rounded bg-surface-container-low border border-outline-variant/30 space-y-2 text-xs">
              <div className="flex items-center justify-between pb-1 border-b border-outline-variant/20">
                <span className="font-bold uppercase tracking-wider text-primary">e-Gazette Digital Signature Attestation</span>
                <span className="text-[11px] font-mono text-[#107307] font-semibold flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">verified</span>
                  <span>CCA India Accredited</span>
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono">
                <div>
                  <span className="text-[10px] text-outline uppercase block">Signatory Authority</span>
                  <span className="font-bold text-primary">{selectedNotif.signatoryName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-outline uppercase block">DSC SHA-256 Token</span>
                  <span className="font-bold text-secondary">{selectedNotif.digitalSignature}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Notifications Table View */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <KpiCard title="Gazettes Published" value="950" subtitle="Section 11(1) Active" icon="campaign" />
            <KpiCard title="Section 19 Declarations" value="783" subtitle="Final Vesting Declarations" icon="verified" />
            <KpiCard title="Approaching 1-Yr Lapse" value="12" subtitle="Action: Sec 19(7) Extension" alert={true} icon="warning" />
            <KpiCard title="DSC Verified Rate" value="100%" subtitle="SHA-256 Token Attested" icon="shield" />
          </div>

          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                  <tr className="h-10">
                    <th className="px-4 py-2 font-semibold">Notification No</th>
                    <th className="px-4 py-2 font-semibold">Section & Type</th>
                    <th className="px-4 py-2 font-semibold">Project & Corridor</th>
                    <th className="px-4 py-2 font-semibold">Gazette Date</th>
                    <th className="px-4 py-2 font-semibold text-right">Affected Parcels</th>
                    <th className="px-4 py-2 font-semibold">Objection Deadline</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {notifications.map((notif) => (
                    <tr
                      key={notif.id}
                      onClick={() => navigate(`/acquisition/notifications/${notif.id}`)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3 font-mono font-bold text-primary">{notif.notificationNumber}</td>
                      <td className="px-4 py-3">
                        <span className="font-bold text-secondary font-mono">{notif.section}</span>
                        <div className="text-[11px] text-on-surface-variant">{notif.type}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-primary block truncate max-w-xs">{notif.projectName}</span>
                        <span className="text-[11px] text-on-surface-variant">{notif.state}</span>
                      </td>
                      <td className="px-4 py-3 font-mono">{notif.gazettePublicationDate}</td>
                      <td className="px-4 py-3 text-right font-mono font-bold">{notif.affectedParcelsCount}</td>
                      <td className="px-4 py-3 font-mono">{notif.objectionDeadlineDate}</td>
                      <td className="px-4 py-3"><StatusBadge status={notif.status} /></td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => navigate(`/acquisition/notifications/${notif.id}`)}
                          className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs"
                        >
                          Gazette →
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
