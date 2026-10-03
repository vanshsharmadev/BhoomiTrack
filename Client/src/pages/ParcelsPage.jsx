import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge } from '../components/common/StatusBadge';
import { KpiCard } from '../components/common/KpiCard';

export const ParcelsPage = () => {
  const { parcelId } = useParams();
  const navigate = useNavigate();
  const { parcels, showToast, verifyParcel } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVillage, setSelectedVillage] = useState('ALL');

  const selectedParcel = parcelId
    ? parcels.find((p) => p.id === parcelId || p.khasraNo === parcelId || p.ulpin === parcelId)
    : null;

  const filteredParcels = parcels.filter((pcl) => {
    const matchSearch =
      !searchTerm.trim() ||
      pcl.khasraNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pcl.ulpin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pcl.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pcl.district.toLowerCase().includes(searchTerm.toLowerCase());

    const matchVillage = selectedVillage === 'ALL' || pcl.village === selectedVillage;
    return matchSearch && matchVillage;
  });

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Title */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-primary tracking-tight">Cadastral Parcels & Khasra Database</h1>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-xs font-mono font-semibold">
              Bhu-Naksha & ULPIN Synced
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5">
            Master revenue cadastral parcel repository, unique land parcel identification (ULPIN), 7/12 Jamabandi & RoR land record verification.
          </p>
        </div>

        {selectedParcel ? (
          <button
            onClick={() => navigate('/land/parcels')}
            className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold"
          >
            ← Back to Parcels Grid
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => showToast('Connecting to State Bhu-Naksha GeoJSON endpoint...', 'info')}
              className="px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold border border-outline-variant/30"
            >
              Import Bhu-Naksha GeoJSON
            </button>
            <button
              onClick={() => showToast('RoR Jamabandi Validation completed: 100% matched', 'success')}
              className="px-3 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold shadow-sm"
            >
              Bulk RoR Validation
            </button>
          </div>
        )}
      </div>

      {/* Parcel Detail View */}
      {selectedParcel ? (
        <div className="space-y-4 animate-in fade-in duration-100">
          <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary font-mono text-base">Khasra No: {selectedParcel.khasraNo}</span>
                  <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary font-mono text-xs">
                    ULPIN: {selectedParcel.ulpin}
                  </span>
                  <span className="text-outline font-mono text-xs">Survey No: {selectedParcel.surveyNo}</span>
                </div>
                <div className="text-xs text-on-surface-variant mt-1">
                  Village: <strong>{selectedParcel.village}</strong> • Taluka: {selectedParcel.taluka} • District: {selectedParcel.district} ({selectedParcel.state})
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selectedParcel.acquisitionStatus || selectedParcel.status} />
                {selectedParcel.verificationStatus !== 'VERIFIED' && (
                  <button
                    onClick={() => verifyParcel && verifyParcel(selectedParcel.id)}
                    className="px-3 py-1.5 rounded bg-[#107307] text-white hover:bg-[#0d5c06] text-xs font-semibold shadow-xs"
                  >
                    ✓ Mark Field Verified
                  </button>
                )}
                <button
                  onClick={() => navigate('/gis')}
                  className="px-3 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold"
                >
                  Locate on GIS Map
                </button>
              </div>
            </div>

            {/* Geometry & Valuation Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Total Area (Holding)</span>
                <span className="font-bold text-primary text-sm">{selectedParcel.totalAreaHa} Ha</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Acquired Area (RoW)</span>
                <span className="font-bold text-primary text-sm">{selectedParcel.acquiredAreaHa} Ha</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Severed Remainder</span>
                <span className="font-bold text-secondary text-sm">{selectedParcel.severedAreaHa} Ha</span>
              </div>
              <div className="p-3 rounded bg-surface-container-low border border-outline-variant/20">
                <span className="text-[10px] text-outline uppercase block">Statutory Total Award</span>
                <span className="font-bold text-[#107307] text-sm">₹{(selectedParcel.totalAward / 100000).toFixed(2)} Lakh</span>
              </div>
            </div>

            {/* Two-Column Detail breakdown */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded bg-surface-container-low/40 border border-outline-variant/30 space-y-2">
                <h4 className="font-bold text-xs uppercase text-primary">Ownership & Title Verification</h4>
                <div className="divide-y divide-outline-variant/20">
                  <div className="py-1.5 flex justify-between">
                    <span className="text-on-surface-variant">Primary Title Holder:</span>
                    <strong className="text-primary">{selectedParcel.ownerName}</strong>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-on-surface-variant">Owner ID / Token:</span>
                    <span className="font-mono text-secondary">{selectedParcel.ownerId}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-on-surface-variant">Joint Co-Sharers:</span>
                    <span className="font-mono">{selectedParcel.jointHoldersCount} Registered Heirs</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-on-surface-variant">Land Classification:</span>
                    <span className="font-semibold text-primary">{selectedParcel.landClassification}</span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 rounded bg-surface-container-low/40 border border-outline-variant/30 space-y-2">
                <h4 className="font-bold text-xs uppercase text-primary">Statutory Acquisition Gating</h4>
                <div className="divide-y divide-outline-variant/20">
                  <div className="py-1.5 flex justify-between">
                    <span className="text-on-surface-variant">Project Requisition:</span>
                    <strong className="text-primary">{selectedParcel.projectName}</strong>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-on-surface-variant">Section 11 Notification:</span>
                    <span className="font-mono text-secondary">{selectedParcel.notificationRef}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-on-surface-variant">Joint Survey (JVS):</span>
                    <span className="text-[#107307] font-semibold">{selectedParcel.surveyStatus}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-on-surface-variant">Physical Possession:</span>
                    <span className="font-semibold">{selectedParcel.possessionStatus}</span>
                  </div>
                  <div className="py-1.5 flex justify-between">
                    <span className="text-on-surface-variant">PFMS Disbursal:</span>
                    <span className="font-bold text-[#107307]">{selectedParcel.dbtStatus}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Parcels Table View with Search */
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <KpiCard title="Requisitioned Khasras" value="48,920" subtitle="Spread across 1,284 projects" icon="layers" />
            <KpiCard title="Total Land Schedule" value="2.84M" unit="Ha" subtitle="100% Jamabandi Synced" icon="crop_free" />
            <KpiCard title="ULPIN Seeded" value="98.2%" subtitle="Unique Parcel ID Assigned" icon="qr_code" />
            <KpiCard title="Severance Disputed" value="142" subtitle="Schedule I Claims Active" alert={true} icon="warning" />
          </div>

          <div className="bg-surface-container-lowest p-3.5 rounded shadow-sm border border-outline-variant/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
            <div className="flex items-center bg-surface-container-low rounded px-2.5 h-[34px] border border-outline-variant/30 flex-1 max-w-md">
              <span className="material-symbols-outlined text-secondary text-[16px] mr-1.5">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Khasra Number, ULPIN, Owner Name, Village..."
                className="w-full bg-transparent text-xs text-primary focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedVillage}
                onChange={(e) => setSelectedVillage(e.target.value)}
                className="h-[34px] px-2.5 bg-surface-container-low text-xs rounded border border-outline-variant/30 focus:outline-none"
              >
                <option value="ALL">All Revenue Villages</option>
                <option value="Kim">Kim (Olpad, Surat)</option>
                <option value="Dharuhera">Dharuhera (Rewari)</option>
                <option value="Dadri Rural">Dadri Rural (G.B. Nagar)</option>
                <option value="Manchar">Manchar (Pune)</option>
              </select>
            </div>
          </div>

          <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
            <div className="w-full overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead className="bg-surface-container-low text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
                  <tr className="h-10">
                    <th className="px-4 py-2 font-semibold">Khasra / ULPIN</th>
                    <th className="px-4 py-2 font-semibold">Village / District</th>
                    <th className="px-4 py-2 font-semibold">Primary Title Holder</th>
                    <th className="px-4 py-2 font-semibold">Classification</th>
                    <th className="px-4 py-2 font-semibold text-right">Holding Area</th>
                    <th className="px-4 py-2 font-semibold text-right">Acquired Area</th>
                    <th className="px-4 py-2 font-semibold text-right">Valuation (Award)</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                    <th className="px-4 py-2 text-center font-semibold">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {filteredParcels.map((pcl) => (
                    <tr
                      key={pcl.id}
                      onClick={() => navigate(`/land/parcels/${pcl.id}`)}
                      className="hover:bg-surface-container-low transition-colors cursor-pointer"
                    >
                      <td className="px-4 py-3">
                        <span className="font-bold text-primary font-mono block">Khasra {pcl.khasraNo}</span>
                        <span className="text-[11px] font-mono text-secondary">{pcl.ulpin}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-medium text-primary block">{pcl.village}</span>
                        <span className="text-[11px] text-on-surface-variant">{pcl.district} ({pcl.state})</span>
                      </td>
                      <td className="px-4 py-3 font-semibold text-primary">{pcl.ownerName}</td>
                      <td className="px-4 py-3 text-on-surface-variant truncate max-w-xs">{pcl.landClassification}</td>
                      <td className="px-4 py-3 text-right font-mono">{pcl.totalAreaHa} Ha</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-primary">{pcl.acquiredAreaHa} Ha</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#107307]">
                        ₹{(pcl.totalAward / 100000).toFixed(2)} L
                      </td>
                      <td className="px-4 py-3"><StatusBadge status={pcl.acquisitionStatus} /></td>
                      <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => navigate(`/gis?khasra=${pcl.khasraNo || pcl.khasraNumber}`)}
                            title="Locate on National Cadastral GIS"
                            className="p-1 rounded bg-surface-container hover:bg-surface-container-high text-secondary"
                          >
                            <span className="material-symbols-outlined text-[16px]">map</span>
                          </button>
                          <button
                            onClick={() => navigate(`/land/parcels/${pcl.id}`)}
                            className="px-2.5 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs"
                          >
                            Dossier →
                          </button>
                        </div>
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
