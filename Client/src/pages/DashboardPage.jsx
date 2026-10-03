import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { KpiCard } from '../components/common/KpiCard';
import { WorkflowFunnel } from '../components/common/WorkflowFunnel';
import { StatusBadge, RiskBadge } from '../components/common/StatusBadge';

export const DashboardPage = () => {
  const {
    projects,
    dbtTransactions,
    selectedStateFilter,
    setSelectedStateFilter,
    selectedAgencyFilter,
    setSelectedAgencyFilter,
    requestSec19Extension
  } = useApp();

  const navigate = useNavigate();
  const [selectedVelocityMetric, setSelectedVelocityMetric] = useState('possession');

  // Filtered lists
  const filteredProjects = projects.filter((p) => {
    const matchState = selectedStateFilter === 'ALL' || p.state.includes(selectedStateFilter);
    const matchAgency = selectedAgencyFilter === 'ALL' || p.agency === selectedAgencyFilter;
    return matchState && matchAgency;
  });

  return (
    <div className="flex flex-col w-full pb-10 space-y-4">
      {/* Telemetry & Operational Health Bar */}
      <div className="w-full bg-primary-container text-on-primary py-1.5 px-4 rounded shadow-sm flex items-center justify-between gap-3 text-xs font-mono tracking-wide overflow-x-auto whitespace-nowrap">
        <div className="flex items-center gap-4 flex-nowrap shrink-0">
          <div className="flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-[#138808] animate-pulse"></span>
            <span className="text-on-primary uppercase font-bold tracking-wider">PM GatiShakti NMP:</span>
            <span className="text-primary-fixed-dim">Sync Active (Δ +1.2s)</span>
          </div>
          <span className="text-outline">|</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-primary-fixed">verified</span>
            <span>STQC L-4 Audit Certified</span>
          </div>
          <span className="text-outline">|</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-[#138808]">account_balance</span>
            <span>PFMS Escrow Gateway: Live</span>
          </div>
          <span className="text-outline">|</span>
          <div className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[15px] text-secondary-fixed">satellite_alt</span>
            <span>ISRO Bhuvan Cadastre V3 Linked</span>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="bg-white/10 px-2 py-0.5 rounded text-white text-[11px]">
            Cabinet Infra Group (CIG) Viewport
          </span>
          <span className="text-outline-variant text-[11px]">Synced Today 08:30:14 IST</span>
        </div>
      </div>

      {/* Operational Filter & Context Control Strip */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex flex-col">
            <label className="text-[11px] text-outline uppercase font-semibold mb-0.5">State / UT Jurisdiction</label>
            <select
              value={selectedStateFilter}
              onChange={(e) => setSelectedStateFilter(e.target.value)}
              className="bg-surface-container-low text-xs text-on-surface py-1.5 px-3 rounded font-medium border border-outline-variant/30 focus:outline-none"
            >
              <option value="ALL">All States & Union Territories (Pan-India)</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Haryana">Haryana</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Odisha">Odisha</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] text-outline uppercase font-semibold mb-0.5">Executing Agency</label>
            <select
              value={selectedAgencyFilter}
              onChange={(e) => setSelectedAgencyFilter(e.target.value)}
              className="bg-surface-container-low text-xs text-on-surface py-1.5 px-3 rounded font-medium border border-outline-variant/30 focus:outline-none"
            >
              <option value="ALL">All Union Agencies (NHAI, DFCCIL, NHSRCL...)</option>
              <option value="NHAI">NHAI - National Highways Authority</option>
              <option value="DFCCIL">DFCCIL - Dedicated Freight Corridor</option>
              <option value="MRIDC">MRIDC - Maharashtra Rail Infra</option>
              <option value="UPEIDA">UPEIDA - UP Expressways</option>
              <option value="NHSRCL">NHSRCL - High Speed Rail</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end lg:self-auto">
          <button
            onClick={() => navigate('/projects')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-surface-container hover:bg-surface-container-high text-primary text-xs font-semibold transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">table_view</span>
            <span>Master Registry</span>
          </button>
          <button
            onClick={() => navigate('/governance/parliamentary-returns')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-primary hover:bg-[#0B3B60] text-on-primary text-xs font-semibold shadow-sm transition-colors"
          >
            <span className="material-symbols-outlined text-[16px] text-primary-fixed">picture_as_pdf</span>
            <span>Parliamentary Return Dossier</span>
          </button>
        </div>
      </div>

      {/* Strategic National KPIs (Strictly Tabular & High-Density) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
        <KpiCard
          title="Monitored Corridors"
          value="1,284"
          subtitle="1,153 Active • 131 Vested"
          trend="↑ 6.2% YoY"
          progress={89.7}
          icon="polyline"
        />
        <KpiCard
          title="Total Land Target"
          value="2.84M"
          unit="Ha"
          subtitle="2.11M Ha Possessed"
          badge="74.2%"
          progress={74.2}
          icon="crop_free"
        />
        <KpiCard
          title="Sanctioned Awards"
          value="₹2,14,890"
          unit="Cr"
          subtitle="PFMS Escrow Backed"
          badge="100% Fund"
          progress={100}
          icon="payments"
        />
        <KpiCard
          title="Disbursed via DBT"
          value="₹1,88,420"
          unit="Cr"
          subtitle="87.7% Settled"
          badge="99.2% Aadhaar"
          progress={87.7}
          icon="account_balance_wallet"
        />
        <KpiCard
          title="Families Rehabilitated"
          value="8,92,400"
          subtitle="Schedule II Resettled"
          badge="83.0%"
          progress={83.0}
          icon="family_restroom"
        />
        <KpiCard
          title="Critical Attention"
          value="47"
          unit="Projects"
          subtitle="12 Sec 19 Lapse • 35 In Court"
          progress={68}
          alert={true}
          icon="warning"
        />
      </div>

      {/* Acquisition Progress Lifecycle Funnel */}
      <WorkflowFunnel onStageClick={(stg) => navigate('/projects')} />

      {/* Two-Column Analytics: State Velocity League & AI Risk Delay Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: State Velocity League (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[20px]">leaderboard</span>
                  <h3 className="font-bold text-sm text-primary tracking-tight">
                    State & UT Acquisition Velocity League
                  </h3>
                </div>
                <span className="text-xs text-on-surface-variant">
                  Ranked by Physical Possession % against RFCTLARR Disbursals
                </span>
              </div>
              <div className="flex items-center gap-1 bg-surface-container-low p-0.5 rounded">
                <button
                  onClick={() => setSelectedVelocityMetric('possession')}
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    selectedVelocityMetric === 'possession' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                  }`}
                >
                  Possession %
                </button>
                <button
                  onClick={() => setSelectedVelocityMetric('dbt')}
                  className={`px-2 py-0.5 rounded text-xs font-semibold ${
                    selectedVelocityMetric === 'dbt' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'
                  }`}
                >
                  DBT Settle %
                </button>
              </div>
            </div>

            {/* Performance Items */}
            <div className="space-y-3">
              {[
                { rank: '01', state: 'Gujarat', projects: '142 Projects • 38,420 Ha', dbt: '96.4%', cStaff: '98%', pct: 92.0, stateId: 'GJ' },
                { rank: '02', state: 'Maharashtra', projects: '188 Projects • 54,110 Ha', dbt: '91.2%', cStaff: '92%', pct: 88.0, stateId: 'MH' },
                { rank: '03', state: 'Tamil Nadu', projects: '112 Projects • 29,840 Ha', dbt: '89.5%', cStaff: '94%', pct: 85.0, stateId: 'TN' },
                { rank: '04', state: 'Uttar Pradesh', projects: '246 Projects • 72,190 Ha', dbt: '84.8%', cStaff: '89%', pct: 79.4, stateId: 'UP' },
                { rank: '05', state: 'Haryana', projects: '84 Projects • 19,820 Ha', dbt: '78.2%', cStaff: '85%', pct: 61.0, stateId: 'HR' },
                { rank: '06', state: 'Odisha', projects: '98 Projects • 27,400 Ha', dbt: '64.0%', cStaff: '81%', pct: 58.4, stateId: 'OD' }
              ].map((row) => (
                <div
                  key={row.state}
                  onClick={() => navigate('/reports')}
                  className="p-2 rounded bg-surface-container-low/40 hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold bg-surface-container-high px-1.5 py-0.2 rounded text-primary">
                        {row.rank}
                      </span>
                      <span className="font-bold text-primary">{row.state}</span>
                      <span className="text-on-surface-variant font-mono text-[11px]">({row.projects})</span>
                    </div>
                    <div className="flex items-center gap-3 font-mono">
                      <span>DBT: <strong className="text-[#107307]">{row.dbt}</strong></span>
                      <span className="font-bold text-primary text-sm">{row.pct}%</span>
                    </div>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${row.pct > 80 ? 'bg-[#107307]' : row.pct > 60 ? 'bg-secondary' : 'bg-[#D95D08]'}`}
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-outline-variant/20 flex items-center justify-between text-xs text-on-surface-variant">
            <span className="font-mono text-[11px]">Calibrated via RoR Jamabandi & BhuNaksha API Sync</span>
            <button
              onClick={() => navigate('/reports')}
              className="text-secondary font-semibold hover:underline flex items-center gap-0.5"
            >
              <span>View Statutory & State Reports</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>

        {/* Right: AI Statutory Delay Radar (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-error text-[20px]">radar</span>
                  <h3 className="font-bold text-sm text-primary tracking-tight">AI Statutory Delay Radar</h3>
                </div>
                <span className="text-xs text-on-surface-variant">Machine-learning statutory risk classification</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container text-[11px] font-bold uppercase">
                18 High Priority
              </span>
            </div>

            {/* Delay Penalty Exposure Strip */}
            <div className="p-3 rounded bg-[#FFF5F5] border border-error/20 mb-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-error uppercase font-bold tracking-wider">Delay Penalty Exposure</span>
                <span className="font-mono font-bold text-error text-base">₹18,450 Cr</span>
              </div>
              <p className="text-xs text-on-surface-variant mt-1 leading-snug">
                Section 19 (1-year lapse threshold) approaching expiry in <strong>17 days</strong> across 12 packages in Haryana (Rewari corridor) & UP.
              </p>
            </div>

            {/* Causation Factors */}
            <div className="space-y-2 mb-3">
              <div className="text-[11px] text-outline uppercase font-semibold">Primary Risk Causation Factors (AI Classified)</div>
              {[
                { factor: 'Cadastral Documentation & RoR Mismatch', pct: 42, color: 'bg-error' },
                { factor: 'Physical JVS & Forest Boundary Conflict', pct: 28, color: 'bg-[#D95D08]' },
                { factor: 'Compensation Escrow Dispute / Multiple Titling', pct: 18, color: 'bg-secondary' },
                { factor: 'R&R Land Allotment Local Opposition', pct: 8, color: 'bg-primary' }
              ].map((c) => (
                <div key={c.factor}>
                  <div className="flex items-center justify-between text-xs mb-0.5">
                    <span className="text-primary truncate">{c.factor}</span>
                    <span className="font-mono font-bold">{c.pct}%</span>
                  </div>
                  <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                    <div className={`h-full ${c.color}`} style={{ width: `${c.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant/20 flex flex-col gap-1.5">
            <button
              onClick={() => requestSec19Extension('PRJ-DFCC-WDFC-02')}
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-primary hover:bg-primary-container text-on-primary text-xs font-semibold shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px] text-primary-fixed">send</span>
              <span>Dispatch Statutory Advisory to District Collectors</span>
            </button>
            <span className="text-center text-[10px] text-outline font-mono">
              Automated Section 19(7) Extension Notices Prepared
            </span>
          </div>
        </div>
      </div>

      {/* Lower Section: Cadastral GIS Alignment View & Real-time PFMS DBT Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: GIS Alignment View (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-secondary text-[20px]">public</span>
                  <h3 className="font-bold text-sm text-primary tracking-tight">National Cadastral GIS Alignment View</h3>
                </div>
                <span className="text-xs text-on-surface-variant">Live ISRO Bhuvan Spatial Feed • Right-of-Way (RoW) Alignment</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => navigate('/gis')}
                  className="px-2 py-1 rounded bg-primary text-on-primary text-xs font-semibold"
                >
                  Full GIS Portal
                </button>
              </div>
            </div>

            {/* Vector Preview Canvas */}
            <div className="relative w-full h-56 bg-slate-900 rounded overflow-hidden shadow-inner border border-outline-variant/30">
              <div
                className="w-full h-full bg-cover bg-center opacity-80"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')`
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent flex flex-col justify-between p-3">
                <div className="flex items-start justify-between">
                  <div className="bg-surface/95 backdrop-blur-md px-2.5 py-1.5 rounded shadow-sm text-xs">
                    <span className="font-bold text-primary block">Delhi–Mumbai Expressway (DME Pkg 14)</span>
                    <span className="font-mono text-[10px] text-on-surface-variant">Chainage: KM 412+000 to KM 465+200 • Surat/Vadodara</span>
                  </div>
                  <div className="bg-surface/95 backdrop-blur-md px-2 py-0.5 rounded text-[10px] font-mono text-[#107307] font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#107307] animate-pulse"></span>
                    High Res 0.5m Ortho
                  </div>
                </div>

                <div className="bg-surface-container-lowest/95 backdrop-blur-md p-2 rounded shadow-sm flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-3">
                    <span>Lat: <strong>21.1702° N</strong></span>
                    <span>Long: <strong>72.8311° E</strong></span>
                    <span>EPSG: <strong>4326 (WGS84)</strong></span>
                  </div>
                  <span className="text-primary font-bold">ULPIN: 24-08-01-4410928</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-3 text-center text-xs">
            <div className="bg-surface-container-low p-2 rounded border border-outline-variant/20">
              <span className="text-outline uppercase text-[10px] block">DME Delhi–Mumbai</span>
              <span className="font-bold font-mono text-primary text-sm">94.8% RoW Clear</span>
            </div>
            <div className="bg-surface-container-low p-2 rounded border border-outline-variant/20">
              <span className="text-outline uppercase text-[10px] block">EDFC Khurja–Dadri</span>
              <span className="font-bold font-mono text-[#D95D08] text-sm">81.2% RoW Clear</span>
            </div>
            <div className="bg-surface-container-low p-2 rounded border border-outline-variant/20">
              <span className="text-outline uppercase text-[10px] block">Pune–Nashik Semi HSR</span>
              <span className="font-bold font-mono text-error text-sm">64.5% RoW Clear</span>
            </div>
          </div>
        </div>

        {/* Right: Real-time PFMS DBT Disbursal Stream (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 mb-2 border-b border-outline-variant/20">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[#107307] text-[20px]">currency_rupee</span>
                  <h3 className="font-bold text-sm text-primary tracking-tight">Direct Benefit Disbursal (DBT)</h3>
                </div>
                <span className="text-xs text-on-surface-variant">PFMS Host-to-Host Electronic Ledger Disbursal</span>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#EAF7EC] text-[#107307] font-mono text-xs font-bold border border-[#B8E4BC]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#107307] animate-ping"></span> Real-time
              </span>
            </div>

            {/* Disbursed Today Callout */}
            <div className="p-3 rounded bg-surface-container-low mb-3 flex items-center justify-between border border-outline-variant/20">
              <div>
                <span className="text-[10px] text-outline uppercase font-semibold block">Disbursed Today (IST)</span>
                <div className="font-bold font-mono text-primary text-lg">₹142.8 <span className="text-xs font-normal text-on-surface-variant">Cr</span></div>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-outline uppercase font-semibold block">Beneficiaries</span>
                <div className="font-bold font-mono text-[#107307] text-lg">3,420 <span className="text-xs font-normal text-on-surface-variant">Farmers</span></div>
              </div>
            </div>

            {/* Stream Rows */}
            <div className="space-y-1.5 font-mono text-xs">
              {dbtTransactions.map((tx) => (
                <div
                  key={tx.id}
                  onClick={() => navigate(`/compensation/dbt/${tx.id}`)}
                  className={`p-2 rounded cursor-pointer transition-colors flex items-center justify-between border ${
                    tx.pfmsStatus.includes('Reconciliation')
                      ? 'bg-[#FFF8F0] border-[#FCD3B6]'
                      : 'bg-surface-container-lowest hover:bg-surface-container-low border-outline-variant/20'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`material-symbols-outlined text-[16px] ${
                      tx.pfmsStatus.includes('Reconciliation') ? 'text-[#D95D08]' : 'text-[#107307]'
                    }`}>
                      {tx.pfmsStatus.includes('Reconciliation') ? 'warning' : 'check_circle'}
                    </span>
                    <div>
                      <span className="text-primary font-bold block">{tx.id}</span>
                      <span className="text-on-surface-variant text-[11px]">{tx.beneficiaryName}</span>
                    </div>
                  </div>
                  <span className={`font-bold ${tx.pfmsStatus.includes('Reconciliation') ? 'text-[#D95D08]' : 'text-[#107307]'}`}>
                    ₹{(tx.amountRupees / 100000).toFixed(2)} L
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-2 border-t border-outline-variant/20 mt-2">
            <button
              onClick={() => navigate('/compensation/dbt')}
              className="text-xs text-secondary font-semibold hover:underline flex items-center justify-between w-full"
            >
              <span>Inspect Full PFMS Disbursal Ledger</span>
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Cockpit: Active Cabinet Committee on Infrastructure (CCI) Escalations */}
      <div className="bg-surface-container-lowest p-4 rounded shadow-sm border border-outline-variant/30">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-3 mb-2 border-b border-outline-variant/20 gap-2">
          <div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-error text-[20px]">notification_important</span>
              <h3 className="font-bold text-sm text-primary tracking-tight">
                Active Cabinet Committee on Infrastructure (CCI) Escalations
              </h3>
            </div>
            <span className="text-xs text-on-surface-variant">
              Corridors triggering statutory Section 19 lapse or High Court stay orders
            </span>
          </div>
          <span className="text-xs font-mono text-error font-semibold">
            3 Strategic Corridors Mandating CALA Directives
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-surface-container-low text-outline font-mono uppercase tracking-wider">
                <th className="py-2.5 px-3 font-semibold">Project Identifier</th>
                <th className="py-2.5 px-3 font-semibold">Executing CALA / District</th>
                <th className="py-2.5 px-3 font-semibold">Affected Land</th>
                <th className="py-2.5 px-3 font-semibold">Statutory Risk</th>
                <th className="py-2.5 px-3 font-semibold">Time to Lapse</th>
                <th className="py-2.5 px-3 text-right font-semibold">Direct Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/20 font-body-sm">
              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-2.5 px-3 cursor-pointer" onClick={() => navigate('/projects/PRJ-DFCC-WDFC-02')}>
                  <div className="font-bold text-primary">DFCCIL-WDFC-PKG-02</div>
                  <div className="text-on-surface-variant text-[11px]">Western DFC Rewari–Dadri Corridor</div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="font-medium text-primary">CALA Rewari / DRO</span>
                  <div className="text-[11px] text-on-surface-variant font-mono">Haryana • 26 Villages</div>
                </td>
                <td className="py-2.5 px-3 font-mono">
                  <div className="font-bold text-primary">480.20 Ha</div>
                  <div className="text-[11px] text-on-surface-variant">2,340 Khasras</div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-error-container text-on-error-container font-mono text-[10px] font-bold uppercase">
                    Section 19 Lapse Risk
                  </span>
                  <div className="text-[11px] text-error mt-0.5">Sec 11 gazette published 348 days ago</div>
                </td>
                <td className="py-2.5 px-3 font-mono font-bold text-error">
                  17 Days Remaining
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => requestSec19Extension('PRJ-DFCC-WDFC-02')}
                    className="px-3 py-1 rounded bg-primary text-on-primary font-semibold hover:bg-primary-container text-xs transition-colors shadow-sm"
                  >
                    Enforce Sec 19(7)
                  </button>
                </td>
              </tr>

              <tr className="hover:bg-surface-container-low transition-colors">
                <td className="py-2.5 px-3 cursor-pointer" onClick={() => navigate('/projects/PRJ-MAHA-PNSH-01')}>
                  <div className="font-bold text-primary">MRIDC-PNSH-SEMI-01</div>
                  <div className="text-on-surface-variant text-[11px]">Pune–Nashik Semi High-Speed Rail</div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="font-medium text-primary">CALA Pune / Ambegaon</span>
                  <div className="text-[11px] text-on-surface-variant font-mono">Maharashtra • 54 Villages</div>
                </td>
                <td className="py-2.5 px-3 font-mono">
                  <div className="font-bold text-primary">620.00 Ha</div>
                  <div className="text-[11px] text-on-surface-variant">4,120 Khasras</div>
                </td>
                <td className="py-2.5 px-3">
                  <span className="px-2 py-0.5 rounded bg-[#FEF3EB] text-[#D95D08] font-mono text-[10px] font-bold uppercase">
                    Boundary Contestation
                  </span>
                  <div className="text-[11px] text-[#D95D08] mt-0.5">Forest boundary overlap in Sangamner</div>
                </td>
                <td className="py-2.5 px-3 font-mono font-medium text-on-surface-variant">
                  Joint Demarcation Active
                </td>
                <td className="py-2.5 px-3 text-right">
                  <button
                    onClick={() => navigate('/field/joint-verification')}
                    className="px-3 py-1 rounded bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs transition-colors"
                  >
                    View Rover JVS
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
