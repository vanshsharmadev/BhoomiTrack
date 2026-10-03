import React from 'react';

export const STAGES = [
  { id: '01', title: 'DPR & Ingestion', count: '1,258 Corridors', completion: '98%', status: 'Normal (18d avg)', section: 'Sec 4 SIA', color: 'text-[#107307]' },
  { id: '02', title: 'Joint Survey (JVS)', count: '1,130 Corridors', completion: '88%', status: 'Normal (42d avg)', section: 'Field Rover', color: 'text-[#107307]' },
  { id: '03', title: 'Sec 11 Gazette', count: '950 Corridors', completion: '74%', status: 'Published', section: 'Preliminary', color: 'text-[#107307]' },
  { id: '04', title: 'Sec 15 Hearing', count: '873 Corridors', completion: '68%', status: '60d Objection', section: 'Inquiries', color: 'text-[#107307]' },
  { id: '05', title: 'Sec 19 Declaration', count: '783 Corridors', completion: '61%', status: '18 SLA Warnings', section: '1-Yr Window', color: 'text-[#D95D08]', isWarning: true },
  { id: '06', title: 'Sec 23/30 Award', count: '616 Corridors', completion: '48%', status: 'Valuation Active', section: 'Solatium 100%', color: 'text-secondary' },
  { id: '07', title: 'Sec 38 Possession', count: '539 Possessed', completion: '42%', status: 'Critical Bottleneck', section: 'Vesting Panchnama', color: 'text-error', isCritical: true }
];

export const WorkflowFunnel = ({ activeStage = null, onStageClick = null }) => {
  return (
    <div className="w-full bg-surface-container-lowest p-space-md rounded shadow-sm border border-outline-variant/30 mb-space-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-space-sm mb-space-md gap-2 border-b border-outline-variant/20">
        <div>
          <div className="flex items-center gap-space-xs">
            <span className="inline-block w-1.5 h-4 bg-primary rounded-full"></span>
            <h2 className="font-headline-md text-headline-md text-primary tracking-tight font-bold">
              National Acquisition Statutory Lifecycle Funnel (RFCTLARR Act, 2013)
            </h2>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
            Stage-gated statutory progression across 1,284 mega-infrastructure project corridors
          </p>
        </div>
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-surface-container-low rounded font-code-tabular text-label-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[16px] text-secondary">speed</span>
            <span>Avg Statutory Velocity:</span>
            <span className="font-bold text-primary">312 Days</span>
            <span className="text-outline">(SLA: 365 Days)</span>
          </div>
          <span className="px-2.5 py-0.5 rounded-full bg-[#EAF7EC] text-[#107307] font-label-sm text-xs uppercase font-bold border border-[#B8E4BC]">
            91.4% Stage Gated
          </span>
        </div>
      </div>

      {/* 7-Stage Horizontal Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-2">
        {STAGES.map((stg, idx) => {
          const isActive = activeStage === stg.id;
          return (
            <div
              key={stg.id}
              onClick={() => onStageClick && onStageClick(stg)}
              className={`p-space-sm rounded relative group transition-all cursor-pointer border min-w-0 ${
                stg.isCritical
                  ? 'bg-[#FFF0F0] border-error/30 hover:bg-[#FFE2E2]'
                  : stg.isWarning
                  ? 'bg-[#FFF8F0] border-[#FCD3B6] hover:bg-[#FFEEDC]'
                  : 'bg-surface-container-low border-outline-variant/20 hover:bg-surface-container'
              } ${isActive ? 'ring-2 ring-primary shadow-md' : ''}`}
            >
              <div className="flex items-center justify-between text-xs mb-1 font-code-tabular">
                <span className="font-bold text-secondary">{stg.id} / STAGE</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-bold">
                  {stg.completion}
                </span>
              </div>

              <div className="font-label-lg text-sm text-primary font-bold leading-tight truncate" title={stg.title}>
                {stg.title}
              </div>

              <div className="text-xs font-code-tabular text-on-surface-variant mt-1">
                {stg.count}
              </div>

              <div className={`mt-2 text-xs flex items-center gap-1 font-semibold ${stg.color}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {stg.isCritical ? 'priority_high' : stg.isWarning ? 'schedule' : 'check_circle'}
                </span>
                <span className="truncate">{stg.status}</span>
              </div>

              <div className="mt-1 text-[10px] text-outline uppercase font-mono tracking-wider">
                {stg.section}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
