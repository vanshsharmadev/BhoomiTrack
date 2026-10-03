import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';

export const ProjectRegistryPage = () => {
  const { projects, selectedStateFilter, setSelectedStateFilter, selectedAgencyFilter, setSelectedAgencyFilter } = useApp();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStage, setSelectedStage] = useState('ALL');
  const [selectedRisk, setSelectedRisk] = useState('ALL');
  const [selectedProjectForDrawer, setSelectedProjectForDrawer] = useState(null);

  // Column Customization Options
  const [visibleColumns, setVisibleColumns] = useState({
    agency: false,
    compensation: false,
    families: false,
    lastUpdated: false
  });
  const [isCustomizeOpen, setIsCustomizeOpen] = useState(false);

  // Filtering Logic
  const filteredList = useMemo(() => {
    return projects.filter((p) => {
      const matchSearch =
        !searchTerm.trim() ||
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.projectCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.district.toLowerCase().includes(searchTerm.toLowerCase());

      const matchState = selectedStateFilter === 'ALL' || p.state.includes(selectedStateFilter);
      const matchAgency = selectedAgencyFilter === 'ALL' || p.agency === selectedAgencyFilter;
      const matchStage = selectedStage === 'ALL' || p.currentStage.toLowerCase().includes(selectedStage.toLowerCase());
      const matchRisk = selectedRisk === 'ALL' || p.risk.toLowerCase() === selectedRisk.toLowerCase();

      return matchSearch && matchState && matchAgency && matchStage && matchRisk;
    });
  }, [projects, searchTerm, selectedStateFilter, selectedAgencyFilter, selectedStage, selectedRisk]);

  const activeFiltersCount =
    (selectedStateFilter !== 'ALL' ? 1 : 0) +
    (selectedAgencyFilter !== 'ALL' ? 1 : 0) +
    (selectedStage !== 'ALL' ? 1 : 0) +
    (selectedRisk !== 'ALL' ? 1 : 0) +
    (searchTerm.trim() ? 1 : 0);

  const resetFilters = () => {
    setSelectedStateFilter('ALL');
    setSelectedAgencyFilter('ALL');
    setSelectedStage('ALL');
    setSelectedRisk('ALL');
    setSearchTerm('');
  };

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Title & Sovereign Actions */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-lg text-primary tracking-tight">
              Central Project Registry & Master Infrastructure Repository
            </h1>
            <span className="px-2 py-0.5 rounded bg-surface-container-high text-secondary text-xs font-mono font-semibold">
              RFCTLARR 2013 Audited
            </span>
          </div>
          <p className="text-xs text-on-surface-variant mt-0.5 max-w-4xl">
            Unified statutory portfolio across Union Ministries and State CALA authorities. Discovery-first scanning index with progressive disclosure.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsCustomizeOpen(!isCustomizeOpen)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container-low hover:bg-surface-container text-primary text-xs font-semibold border border-outline-variant/30 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">view_column</span>
            <span>Customize Columns</span>
          </button>
          <button
            onClick={() => navigate('/acquisition/proposals')}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-primary-container text-on-primary hover:bg-primary text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add_box</span>
            <span>+ Submit New Acquisition Project</span>
          </button>
        </div>
      </div>

      {/* Column Customizer Panel */}
      {isCustomizeOpen && (
        <div className="bg-surface-container-low p-3 rounded border border-outline-variant/30 flex items-center justify-between gap-4 text-xs animate-in fade-in duration-100">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-bold text-primary uppercase text-[10px] tracking-wider">Toggle Optional Columns:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleColumns.agency}
                onChange={(e) => setVisibleColumns({ ...visibleColumns, agency: e.target.checked })}
                className="rounded text-primary accent-primary"
              />
              <span>Executing Agency</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleColumns.compensation}
                onChange={(e) => setVisibleColumns({ ...visibleColumns, compensation: e.target.checked })}
                className="rounded text-primary accent-primary"
              />
              <span>Compensation Escrow</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleColumns.families}
                onChange={(e) => setVisibleColumns({ ...visibleColumns, families: e.target.checked })}
                className="rounded text-primary accent-primary"
              />
              <span>Affected Families</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={visibleColumns.lastUpdated}
                onChange={(e) => setVisibleColumns({ ...visibleColumns, lastUpdated: e.target.checked })}
                className="rounded text-primary accent-primary"
              />
              <span>Last Audited</span>
            </label>
          </div>
          <button
            onClick={() => setIsCustomizeOpen(false)}
            className="text-xs text-secondary font-semibold hover:underline"
          >
            Done
          </button>
        </div>
      )}

      {/* Filter Cockpit Strip */}
      <div className="bg-surface-container-lowest p-3.5 rounded shadow-sm border border-outline-variant/30 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Quick Search */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-outline mb-1">Search Registry</label>
            <div className="flex items-center bg-surface-container-low rounded px-2.5 h-[34px] border border-outline-variant/30">
              <span className="material-symbols-outlined text-secondary text-[16px] mr-1.5">search</span>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Code, Name, District..."
                className="w-full bg-transparent text-xs text-primary placeholder-outline focus:outline-none"
              />
            </div>
          </div>

          {/* Agency Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-outline mb-1">Ministry / Agency</label>
            <select
              value={selectedAgencyFilter}
              onChange={(e) => setSelectedAgencyFilter(e.target.value)}
              className="w-full h-[34px] px-2 bg-surface-container-low text-xs text-on-surface rounded border border-outline-variant/30 focus:outline-none"
            >
              <option value="ALL">All Agencies (NHAI, DFCCIL, MoRTH...)</option>
              <option value="NHAI">NHAI - National Highways</option>
              <option value="DFCCIL">DFCCIL - Dedicated Freight</option>
              <option value="MRIDC">MRIDC - Maharashtra Rail</option>
              <option value="UPEIDA">UPEIDA - UP Expressways</option>
              <option value="NHSRCL">NHSRCL - High Speed Rail</option>
            </select>
          </div>

          {/* State Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-outline mb-1">Jurisdiction / State</label>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="w-full h-[34px] px-2 bg-surface-container-low text-xs text-on-surface rounded border border-outline-variant/30 focus:outline-none"
            >
              <option value="ALL">All States & Union Territories</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Haryana">Haryana</option>
            </select>
          </div>

          {/* Stage Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-outline mb-1">Statutory Stage</label>
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="w-full h-[34px] px-2 bg-surface-container-low text-xs text-on-surface rounded border border-outline-variant/30 focus:outline-none"
            >
              <option value="ALL">All Statutory Stages</option>
              <option value="Sec 4">Sec 4: SIA / Ingestion</option>
              <option value="Survey">Stage 02: Joint Verification (JVS)</option>
              <option value="Sec 11">Sec 11: Preliminary Gazette</option>
              <option value="Sec 19">Sec 19: Acquisition Declaration</option>
              <option value="Sec 23">Sec 23: Valuation & Award</option>
              <option value="Sec 38">Sec 38: Possession Handover</option>
            </select>
          </div>

          {/* Risk Filter */}
          <div className="flex flex-col">
            <label className="text-[10px] font-bold uppercase tracking-wider text-outline mb-1">Risk Classification</label>
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="w-full h-[34px] px-2 bg-surface-container-low text-xs text-on-surface rounded border border-outline-variant/30 focus:outline-none"
            >
              <option value="ALL">All Risk Classes</option>
              <option value="critical">🔴 Critical Alert</option>
              <option value="high">🟠 High (Objections &gt; 40)</option>
              <option value="low">🟢 Low (Clear Milestones)</option>
              <option value="clear">✅ Clear (100% Vested)</option>
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {activeFiltersCount > 0 && (
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-outline-variant/20 flex-wrap text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[11px] text-outline uppercase font-semibold">Active Filter Filters ({activeFiltersCount}):</span>
              {selectedStateFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-medium">
                  State: {selectedStateFilter}
                  <span className="material-symbols-outlined text-[14px] cursor-pointer" onClick={() => setSelectedStateFilter('ALL')}>close</span>
                </span>
              )}
              {selectedAgencyFilter !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container-high text-primary text-xs font-medium">
                  Agency: {selectedAgencyFilter}
                  <span className="material-symbols-outlined text-[14px] cursor-pointer" onClick={() => setSelectedAgencyFilter('ALL')}>close</span>
                </span>
              )}
              {selectedRisk !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FEF3EB] text-[#D95D08] text-xs font-medium">
                  Risk: {selectedRisk}
                  <span className="material-symbols-outlined text-[14px] cursor-pointer" onClick={() => setSelectedRisk('ALL')}>close</span>
                </span>
              )}
              {searchTerm && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface-container text-on-surface text-xs font-medium">
                  Query: "{searchTerm}"
                  <span className="material-symbols-outlined text-[14px] cursor-pointer" onClick={() => setSearchTerm('')}>close</span>
                </span>
              )}
            </div>
            <button
              onClick={resetFilters}
              className="text-secondary hover:underline text-xs font-semibold uppercase"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </div>

      {/* Authoritative Redesigned Clean Project Table */}
      <div className="bg-surface-container-lowest rounded shadow-sm border border-outline-variant/30 overflow-hidden">
        <div className="px-4 py-2.5 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary">Master Registry Project Roster</span>
            <span className="px-2 py-0.2 rounded bg-surface-container-high text-primary font-mono text-[11px] font-semibold">
              {filteredList.length} of {projects.length} Corridors
            </span>
          </div>
          <span className="text-on-surface-variant text-[11px]">
            Tip: Click anywhere on a row to preview details or open workspace
          </span>
        </div>

        <div className="w-full overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-surface-container-low/70 text-outline font-mono uppercase tracking-wider border-b border-outline-variant/30">
              <tr className="h-10">
                <th className="px-4 py-2 font-semibold">1. Project</th>
                <th className="px-4 py-2 font-semibold">2. Location</th>
                {visibleColumns.agency && <th className="px-4 py-2 font-semibold">Agency</th>}
                <th className="px-4 py-2 font-semibold w-40">3. Acquisition Progress</th>
                <th className="px-4 py-2 font-semibold">4. Current Stage</th>
                <th className="px-4 py-2 font-semibold">5. Risk</th>
                <th className="px-4 py-2 font-semibold">6. Status</th>
                {visibleColumns.compensation && <th className="px-4 py-2 font-semibold text-right">Compensation</th>}
                {visibleColumns.families && <th className="px-4 py-2 font-semibold text-right">Affected Families</th>}
                {visibleColumns.lastUpdated && <th className="px-4 py-2 font-semibold">Audited</th>}
                <th className="px-4 py-2 font-semibold text-center w-24">7. Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20">
              {filteredList.map((p) => (
                <tr
                  key={p.id}
                  onClick={() => setSelectedProjectForDrawer(p)}
                  className="hover:bg-surface-container-low transition-colors cursor-pointer"
                >
                  {/* 1. Project */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-mono font-bold text-primary hover:underline">
                        {p.projectCode}
                      </span>
                      <span className="text-on-surface-variant truncate max-w-xs" title={p.name}>
                        {p.name}
                      </span>
                    </div>
                  </td>

                  {/* 2. Location */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="font-semibold text-primary">{p.state}</span>
                      <span className="text-on-surface-variant text-[11px]">{p.district}</span>
                    </div>
                  </td>

                  {/* Optional: Agency */}
                  {visibleColumns.agency && (
                    <td className="px-4 py-3">
                      <span className="font-bold text-primary">{p.agency}</span>
                    </td>
                  )}

                  {/* 3. Progress (Clean Bar + Ha) */}
                  <td className="px-4 py-3">
                    <div className="flex flex-col w-36">
                      <div className="flex justify-between items-baseline mb-1 font-mono">
                        <span className="font-bold text-primary text-xs">{p.progressPercent}%</span>
                        <span className="text-[10px] text-on-surface-variant">
                          {p.landAcquiredHa} / {p.landRequiredHa} Ha
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            p.progressPercent > 80 ? 'bg-[#107307]' : p.progressPercent > 60 ? 'bg-secondary' : 'bg-[#D95D08]'
                          }`}
                          style={{ width: `${p.progressPercent}%` }}
                        />
                      </div>
                    </div>
                  </td>

                  {/* 4. Current Stage */}
                  <td className="px-4 py-3">
                    <div className="inline-flex flex-col">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-primary font-semibold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                        {p.statutorySection}
                      </span>
                      <span className="text-[11px] text-on-surface-variant pl-1 pt-0.5 truncate max-w-[140px]">
                        {p.currentStage.split(':')[1]?.trim() || p.currentStage}
                      </span>
                    </div>
                  </td>

                  {/* 5. Risk */}
                  <td className="px-4 py-3">
                    <RiskBadge level={p.risk} />
                  </td>

                  {/* 6. Overall Status */}
                  <td className="px-4 py-3">
                    <StatusBadge status={p.overallStatus} />
                  </td>

                  {/* Optional: Compensation */}
                  {visibleColumns.compensation && (
                    <td className="px-4 py-3 text-right font-mono">
                      <div className="font-bold text-primary">₹{p.compensationSanctionedCr} Cr</div>
                      <div className="text-[10px] text-[#107307]">{p.compensationPercent}% Paid</div>
                    </td>
                  )}

                  {/* Optional: Families */}
                  {visibleColumns.families && (
                    <td className="px-4 py-3 text-right font-mono">
                      <div className="font-bold text-primary">{p.affectedFamilies}</div>
                      <div className="text-[10px] text-secondary">{p.familiesRehabilitated} Done</div>
                    </td>
                  )}

                  {/* Optional: Audited */}
                  {visibleColumns.lastUpdated && (
                    <td className="px-4 py-3 text-on-surface-variant font-mono text-[11px]">
                      {p.lastUpdated}
                    </td>
                  )}

                  {/* 7. Action */}
                  <td className="px-4 py-3 text-center" onClick={(e) => e.stopPropagation()}>
                    <div className="inline-flex items-center gap-1">
                      <button
                        onClick={() => navigate(`/projects/${p.id}`)}
                        className="px-2.5 py-1 rounded bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold shadow-sm transition-colors"
                      >
                        Open →
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick View Drawer */}
      {selectedProjectForDrawer && (
        <div className="fixed inset-0 z-50 flex justify-end bg-primary-container/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-lg bg-surface-container-lowest h-full shadow-2xl border-l border-outline-variant flex flex-col justify-between overflow-y-auto">
            {/* Drawer Header */}
            <div>
              <div className="p-4 bg-surface-container-low border-b border-outline-variant/30 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase font-bold text-secondary tracking-wider">
                    Statutory Project Dossier
                  </span>
                  <h3 className="font-bold text-base text-primary font-mono">{selectedProjectForDrawer.projectCode}</h3>
                </div>
                <button
                  onClick={() => setSelectedProjectForDrawer(null)}
                  className="p-1 rounded text-outline hover:text-primary hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined text-[20px]">close</span>
                </button>
              </div>

              {/* Drawer Content */}
              <div className="p-4 space-y-4 text-xs">
                <div>
                  <h4 className="font-bold text-sm text-primary">{selectedProjectForDrawer.name}</h4>
                  <p className="text-on-surface-variant text-xs mt-1">
                    {selectedProjectForDrawer.agencyFullName} • {selectedProjectForDrawer.ministry}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 p-3 bg-surface-container-low rounded border border-outline-variant/20 font-mono">
                  <div>
                    <span className="text-[10px] text-outline uppercase block">Jurisdiction</span>
                    <span className="font-bold text-primary">{selectedProjectForDrawer.state}</span>
                    <div className="text-[11px] text-on-surface-variant">{selectedProjectForDrawer.district}</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-outline uppercase block">Corridor Type</span>
                    <span className="font-bold text-primary truncate block">{selectedProjectForDrawer.corridorType}</span>
                    <div className="text-[11px] text-secondary">{selectedProjectForDrawer.villagesCount} Villages</div>
                  </div>
                </div>

                {/* Statutory Progress Matrix */}
                <div className="p-3 bg-surface-container-low rounded border border-outline-variant/20 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-[10px] text-outline">Statutory Progress</span>
                    <StatusBadge status={selectedProjectForDrawer.overallStatus} />
                  </div>
                  <div className="flex items-baseline justify-between font-mono">
                    <span className="text-sm font-bold text-primary">{selectedProjectForDrawer.progressPercent}% Vested</span>
                    <span className="text-on-surface-variant">{selectedProjectForDrawer.landAcquiredHa} / {selectedProjectForDrawer.landRequiredHa} Ha</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-[#107307] h-full rounded-full"
                      style={{ width: `${selectedProjectForDrawer.progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Risk & Early Warnings */}
                <div className="p-3 rounded border border-outline-variant/30 space-y-1 bg-[#FFF9F5]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold uppercase text-[10px] text-[#D95D08]">Risk Assessment</span>
                    <RiskBadge level={selectedProjectForDrawer.risk} />
                  </div>
                  <p className="text-on-surface text-xs leading-relaxed font-medium">
                    {selectedProjectForDrawer.riskReason}
                  </p>
                </div>

                {/* Financial Summary */}
                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="text-[10px] text-outline uppercase block">Sanctioned Escrow</span>
                    <span className="font-bold text-primary text-sm">₹{selectedProjectForDrawer.compensationSanctionedCr} Cr</span>
                  </div>
                  <div className="p-2.5 rounded bg-surface-container-low border border-outline-variant/20">
                    <span className="text-[10px] text-outline uppercase block">DBT Disbursed</span>
                    <span className="font-bold text-[#107307] text-sm">₹{selectedProjectForDrawer.compensationDisbursedCr} Cr</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-4 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between gap-3">
              <button
                onClick={() => setSelectedProjectForDrawer(null)}
                className="px-3 py-1.5 rounded text-xs font-semibold text-on-surface-variant hover:bg-surface-container"
              >
                Close Preview
              </button>
              <button
                onClick={() => navigate(`/projects/${selectedProjectForDrawer.id}`)}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold shadow-md transition-all"
              >
                <span>Enter Full Project Workspace</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
