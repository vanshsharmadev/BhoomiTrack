import React from 'react';

export const StatusBadge = ({ status }) => {
  const getBadgeStyle = () => {
    const s = (status || '').toLowerCase();
    if (s.includes('complete') || s.includes('vested') || s.includes('successful') || s.includes('approved') || s.includes('delivered') || s.includes('on track')) {
      return 'bg-[#EAF7EC] text-[#107307] border-[#B8E4BC]';
    }
    if (s.includes('critical') || s.includes('lapse') || s.includes('blocked') || s.includes('stay') || s.includes('fail') || s.includes('dispute')) {
      return 'bg-[#FDEAEA] text-[#A61B1B] border-[#F8B4B4]';
    }
    if (s.includes('warning') || s.includes('delayed') || s.includes('at risk') || s.includes('reconciliation') || s.includes('notice') || s.includes('scheduled')) {
      return 'bg-[#FEF3EB] text-[#D95D08] border-[#FCD3B6]';
    }
    // Draft / In Review / Default
    return 'bg-[#EDF2F7] text-[#0B3B60] border-[#CBD5E1]';
  };

  const getDotStyle = () => {
    const s = (status || '').toLowerCase();
    if (s.includes('complete') || s.includes('vested') || s.includes('successful') || s.includes('approved') || s.includes('delivered') || s.includes('on track')) {
      return 'bg-[#107307]';
    }
    if (s.includes('critical') || s.includes('lapse') || s.includes('blocked') || s.includes('stay') || s.includes('fail') || s.includes('dispute')) {
      return 'bg-[#A61B1B]';
    }
    if (s.includes('warning') || s.includes('delayed') || s.includes('at risk') || s.includes('reconciliation') || s.includes('notice') || s.includes('scheduled')) {
      return 'bg-[#D95D08]';
    }
    return 'bg-[#0B3B60]';
  };

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-xs font-semibold ${getBadgeStyle()}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${getDotStyle()}`}></span>
      <span>{status}</span>
    </span>
  );
};

export const RiskBadge = ({ level = 'Low' }) => {
  const normalized = (level || '').toLowerCase();
  
  if (normalized === 'critical') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-error-container text-on-error-container border border-error/20 text-xs font-bold">
        <span className="material-symbols-outlined text-[14px]">warning</span>
        <span>Critical</span>
      </span>
    );
  }
  if (normalized === 'high') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FEF3EB] text-[#D95D08] border border-[#FCD3B6] text-xs font-bold">
        <span className="material-symbols-outlined text-[14px]">priority_high</span>
        <span>High</span>
      </span>
    );
  }
  if (normalized === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#FFF9E6] text-[#B78103] border border-[#FFE8A3] text-xs font-medium">
        <span className="material-symbols-outlined text-[14px]">schedule</span>
        <span>Medium</span>
      </span>
    );
  }
  if (normalized === 'clear') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#EAF7EC] text-[#107307] border border-[#B8E4BC] text-xs font-medium">
        <span className="material-symbols-outlined text-[14px]">check_circle</span>
        <span>Clear</span>
      </span>
    );
  }
  // Low
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-surface-container-high text-primary border border-outline-variant/30 text-xs font-medium">
      <span className="text-[8px] text-emerald-600">●</span>
      <span>Low</span>
    </span>
  );
};
