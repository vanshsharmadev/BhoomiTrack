import React from 'react';

export const KpiCard = ({ title, value, unit, subtitle, progress, icon, badge, trend, alert }) => {
  return (
    <div className={`p-space-md rounded shadow-sm flex flex-col justify-between transition-all ${
      alert ? 'bg-gradient-to-br from-surface-container-lowest to-[#FFF5F5] border border-error/20' : 'bg-surface-container-lowest border border-outline-variant/30 hover:border-secondary/40'
    }`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-label-sm text-label-sm text-outline uppercase tracking-wider font-semibold">
          {title}
        </span>
        {icon && (
          <span className={`material-symbols-outlined text-[20px] ${alert ? 'text-error' : 'text-secondary'}`}>
            {icon}
          </span>
        )}
      </div>

      <div className="my-1">
        <div className={`font-headline-lg text-headline-lg font-code-tabular tracking-tight font-bold ${
          alert ? 'text-error' : 'text-primary'
        }`}>
          {value} {unit && <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">{unit}</span>}
        </div>
        
        {subtitle && (
          <div className="flex items-center justify-between mt-1 text-label-sm font-code-tabular text-on-surface-variant">
            <span>{subtitle}</span>
            {badge && <span className="font-bold text-[#107307]">{badge}</span>}
          </div>
        )}

        {trend && (
          <div className="flex items-center gap-1 mt-1 text-label-sm font-code-tabular">
            <span className={trend.startsWith('↑') || trend.includes('+') ? 'text-[#107307] font-bold' : 'text-[#D95D08]'}>
              {trend}
            </span>
          </div>
        )}
      </div>

      {progress !== undefined && (
        <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden mt-2">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              alert ? 'bg-error' : progress > 80 ? 'bg-[#107307]' : progress > 50 ? 'bg-secondary' : 'bg-[#D95D08]'
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}
    </div>
  );
};

export const AiFindingCard = ({ finding, evidence, confidence, humanReview, actionRequired, onAction }) => {
  return (
    <div className="bg-[#F8FAFC] border-l-4 border-l-secondary border border-outline-variant/40 rounded p-space-md shadow-sm">
      <div className="flex items-center justify-between pb-1 border-b border-outline-variant/30 mb-space-xs">
        <div className="flex items-center gap-1.5 text-secondary font-label-md text-label-md uppercase tracking-wider font-bold">
          <span className="material-symbols-outlined text-[18px]">psychology</span>
          <span>AI Assistive Analytical Finding</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-surface-container-high text-primary font-code-tabular text-xs font-semibold">
            Confidence: {confidence}%
          </span>
          <span className="px-2 py-0.5 rounded bg-[#FEF3EB] text-[#D95D08] font-label-sm text-xs font-bold uppercase">
            Human Review Required
          </span>
        </div>
      </div>

      <div className="space-y-2 mt-2">
        <div>
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Finding:</span>
          <p className="font-body-md text-body-md text-primary font-medium mt-0.5 leading-snug">
            {finding}
          </p>
        </div>

        <div>
          <span className="font-label-sm text-label-sm text-outline uppercase font-semibold">Evidentiary Basis:</span>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5 leading-relaxed bg-surface-container-lowest p-2 rounded border border-outline-variant/20 font-mono text-xs">
            {evidence}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-outline-variant/30">
          <div className="text-xs text-on-surface-variant">
            <span className="font-semibold text-primary">Statutory Review:</span> {humanReview || 'Pending Officer Verification'}
          </div>

          {actionRequired && (
            <button
              onClick={onAction}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded bg-primary text-on-primary hover:bg-primary-container text-xs font-semibold shadow-sm transition-colors"
            >
              <span className="material-symbols-outlined text-[16px]">task_alt</span>
              <span>{actionRequired}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
