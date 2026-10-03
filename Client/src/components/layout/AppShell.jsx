import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp, ROLES } from '../../context/AppContext';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

export const AppShell = ({ children }) => {
  const {
    currentRole,
    setCurrentRole,
    isSearchModalOpen,
    setIsSearchModalOpen,
    toastMessage,
    backendHealth,
    dbtTransactions,
    isHydrating,
    liveSyncTime,
    refreshAllData
  } = useApp();

  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Navigation sections strictly aligned with the 14 Backend REST Modules
  const navSections = [
    {
      group: 'overview',
      title: 'Overview & Portals',
      items: [
        { path: '/dashboard', label: 'National Dashboard', icon: 'space_dashboard' },
        { path: '/projects', label: 'Central Project Registry', icon: 'account_balance' },
        { path: '/reports', label: 'Statutory & Delay Reports', icon: 'assessment' },
      ]
    },
    {
      group: 'acquisition',
      title: 'Statutory Acquisition',
      items: [
        { path: '/acquisition/proposals', label: 'Proposals & Requisition', icon: 'assignment_turned_in' },
        { path: '/land/parcels', label: 'Cadastral Parcels', icon: 'grid_view' },
        { path: '/acquisition/notifications', label: 'Gazette Notifications', icon: 'campaign' },
        { path: '/compensation/awards', label: 'Award & Solatium (Sec 23)', icon: 'payments' },
        { path: '/acquisition/possession', label: 'Possession & Panchnama', icon: 'transfer_within_a_station' },
      ]
    },
    {
      group: 'finance_rr',
      title: 'Finance & Resettlement',
      items: [
        { path: '/compensation/disbursement', label: 'Compensation & PFMS DBT', icon: 'account_balance_wallet' },
        { path: '/rr', label: 'R&R Entitlements', icon: 'domain' },
      ]
    },
    {
      group: 'spatial_reports',
      title: 'GIS & Spatial Intelligence',
      items: [
        { path: '/gis', label: 'National Cadastral GIS', icon: 'map' },
      ]
    },
    {
      group: 'governance',
      title: 'Sovereign Governance',
      items: [
        { path: '/governance/vault', label: 'Gazette & Legal Vault', icon: 'folder_special' },
        { path: '/governance/audit', label: 'Immutable Audit Trail', icon: 'history_edu' },
      ]
    }
  ];

  const handleRoleChange = (roleKey) => {
    const nextRole = ROLES[roleKey];
    setCurrentRole(nextRole);
    setIsRoleDropdownOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-on-surface flex flex-col font-sans">
      <GlobalSearchModal />

      {/* Floating Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom duration-200">
          <div className={`flex items-center gap-2 px-4 py-3 rounded shadow-xl text-white text-sm font-medium ${
            toastMessage.type === 'success' ? 'bg-[#107307]' : toastMessage.type === 'error' ? 'bg-[#BA1A1A]' : 'bg-[#0A2540]'
          }`}>
            <span className="material-symbols-outlined text-[18px]">
              {toastMessage.type === 'success' ? 'check_circle' : toastMessage.type === 'error' ? 'error' : 'info'}
            </span>
            <span>{toastMessage.message}</span>
          </div>
        </div>
      )}

      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 h-16 z-40 bg-surface/95 backdrop-blur-md border-b border-outline-variant/30 flex items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-4 shrink-0">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-1.5 rounded text-on-surface-variant hover:bg-surface-container-high"
          >
            <span className="material-symbols-outlined text-[22px]">menu</span>
          </button>

          {/* National Identity Emblem & Brand */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
            <div className="w-9 h-9 rounded bg-primary-container text-on-primary flex items-center justify-center font-bold text-sm tracking-wider shadow-sm">
              🇮🇳
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-primary tracking-tight text-base uppercase">NLAMS</span>
                <span className="px-1.5 py-0.2 rounded bg-surface-container-high text-on-surface font-mono text-[10px] uppercase font-semibold">
                  Gov of India
                </span>
              </div>
              <span className="text-[11px] text-on-surface-variant truncate max-w-[260px] hidden sm:block">
                Ministry of Rural Development • PM GatiShakti NMP
              </span>
            </div>
          </div>
        </div>

        {/* Global Search Bar (Trigger) */}
        <div className="flex-1 min-w-0 max-w-xl hidden md:flex items-center mx-6">
          <button
            onClick={() => setIsSearchModalOpen(true)}
            className="w-full flex items-center justify-between bg-surface-container-lowest border border-outline-variant/50 rounded px-3 py-1.5 shadow-sm text-left hover:border-primary/50 transition-colors"
          >
            <div className="flex items-center gap-2 text-outline text-xs truncate">
              <span className="material-symbols-outlined text-[18px] text-secondary shrink-0">search</span>
              <span className="truncate">Search by Project Code, Khasra No., ULPIN, Gazette Ref...</span>
            </div>
            <kbd className="px-1.5 py-0.5 bg-surface-container-low text-on-surface-variant rounded font-mono text-[10px] font-semibold border border-outline-variant/30 shrink-0 ml-2">
              ALT+K
            </kbd>
          </button>
        </div>

        {/* Right Action Tools: Session Security, Live Status & Role Switcher */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Spring Boot / PostGIS Backend Telemetry Indicator */}
          {backendHealth ? (
            <div className="hidden lg:flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#EAF7EC] text-[#107307] rounded border border-[#B8E4BC] text-xs font-mono shadow-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-[#107307] animate-pulse"></span>
                <span className="font-bold text-[10px] uppercase">Cloud Backend: Live</span>
                {liveSyncTime && <span className="text-[9px] text-[#107307]/75 font-normal">({liveSyncTime})</span>}
              </div>
              <button
                onClick={refreshAllData}
                disabled={isHydrating}
                title="Sync and re-fetch from Live Cloud Server"
                className="p-1 rounded bg-surface-container-low hover:bg-surface-container text-secondary text-xs flex items-center gap-1 border border-outline-variant/30"
              >
                <span className={`material-symbols-outlined text-[15px] ${isHydrating ? 'animate-spin' : ''}`}>
                  sync
                </span>
              </button>
            </div>
          ) : (
            <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low text-secondary rounded border border-outline-variant/30 text-xs font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
              <span className="font-semibold text-[10px] uppercase">Autonomous Mode: Active</span>
            </div>
          )}

          {/* Quick Reports Link */}
          <NavLink
            to="/reports"
            className="px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1 bg-surface-container-lowest text-primary border border-outline-variant hover:bg-surface-container"
          >
            <span className="material-symbols-outlined text-[16px]">assessment</span>
            <span className="hidden sm:inline">Reports</span>
          </NavLink>

          {/* Notifications Button */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="p-1.5 rounded text-on-surface-variant hover:bg-surface-container-high transition-colors relative"
            >
              <span className="material-symbols-outlined text-[20px]">notifications</span>
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-error"></span>
            </button>

            {/* Notification Drawer Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-surface-container-lowest rounded shadow-xl border border-outline-variant/40 p-3 z-50 animate-in fade-in duration-100">
                <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20 mb-2">
                  <span className="font-bold text-xs uppercase tracking-wider text-primary">Statutory Alerts</span>
                  <span className="text-[10px] font-bold text-error bg-error-container px-1.5 py-0.5 rounded">Live Telemetry</span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="p-2 rounded bg-[#FFF5F5] border border-error/20 cursor-pointer" onClick={() => { setIsNotifOpen(false); navigate('/reports'); }}>
                    <div className="font-bold text-error">Milestone Delay Alert</div>
                    <div className="text-on-surface-variant text-[11px] mt-0.5">Corridors exceeding statutory milestone SLA. Review delay report.</div>
                  </div>
                  <div className="p-2 rounded bg-[#FEF3EB] border border-[#FCD3B6] cursor-pointer" onClick={() => { setIsNotifOpen(false); navigate('/compensation/disbursement'); }}>
                    <div className="font-bold text-[#D95D08]">PFMS Treasury Staging</div>
                    <div className="text-on-surface-variant text-[11px] mt-0.5">Direct compensation awards ready for bank disbursement.</div>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low cursor-pointer" onClick={() => { setIsNotifOpen(false); navigate('/acquisition/notifications'); }}>
                    <div className="font-bold text-primary">Official Gazette Registry</div>
                    <div className="text-on-surface-variant text-[11px] mt-0.5">Preliminary and final declaration notices active.</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher & User Profile */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded bg-surface-container-low hover:bg-surface-container border border-outline-variant/30 text-left transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-xs">
                {currentRole.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-primary truncate max-w-[130px] leading-tight">
                  {currentRole.name}
                </span>
                <span className="text-[10px] text-secondary font-medium truncate max-w-[130px] leading-tight">
                  {currentRole.level}
                </span>
              </div>
              <span className="material-symbols-outlined text-[16px] text-outline">expand_more</span>
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-surface-container-lowest rounded shadow-xl border border-outline-variant/40 p-2 z-50 animate-in fade-in duration-100">
                <div className="px-3 py-2 border-b border-outline-variant/20 mb-1">
                  <div className="text-[10px] uppercase font-bold text-outline">Active Sovereign Persona</div>
                  <div className="font-bold text-xs text-primary">{currentRole.name}</div>
                  <div className="text-[11px] text-on-surface-variant">{currentRole.title}</div>
                  <div className="text-[10px] text-secondary mt-0.5">{currentRole.dept}</div>
                </div>

                <div className="text-[10px] uppercase font-bold text-outline px-3 py-1.5">
                  Switch Administrative Authority
                </div>

                <div className="space-y-0.5">
                  {Object.entries(ROLES).map(([key, role]) => (
                    <button
                      key={key}
                      onClick={() => handleRoleChange(key)}
                      className={`w-full text-left px-3 py-2 rounded text-xs transition-colors flex flex-col ${
                        currentRole.id === role.id
                          ? 'bg-surface-container-high text-primary font-bold'
                          : 'hover:bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      <span className="font-semibold">{role.name}</span>
                      <span className="text-[10px] text-outline">{role.level}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Layout Container */}
      <div className="flex pt-16 flex-1">
        {/* Sidebar Nav */}
        <aside
          className={`fixed top-16 bottom-0 left-0 w-64 bg-surface-container-lowest border-r border-outline-variant/30 flex flex-col z-30 transition-transform duration-200 lg:translate-x-0 ${
            isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
            {navSections.map((section) => (
              <div key={section.group} className="space-y-1">
                <div className="px-3 text-[10px] uppercase tracking-wider font-bold text-outline">
                  {section.title}
                </div>
                <div className="space-y-0.5">
                  {section.items.map((item) => (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2 rounded text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-primary text-on-primary font-bold shadow-xs'
                            : 'text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface'
                        }`
                      }
                    >
                      <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                      <span>{item.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* System Version & Statutory Compliance Footer */}
          <div className="p-3 border-t border-outline-variant/20 bg-surface-container-low/40 text-[10px] font-mono text-outline">
            <div className="flex justify-between items-center font-bold text-secondary">
              <span>NLAMS • RFCTLARR 2013</span>
              <span>v2.4.0</span>
            </div>
            <div className="text-[9px] text-on-surface-variant mt-0.5">
              NIC e-Gov Standard • DoLR MoRD
            </div>
          </div>
        </aside>

        {/* Content Body */}
        <main className="flex-1 lg:pl-64 flex flex-col min-w-0">
          <div className="p-4 lg:p-6 flex-1 w-full max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Backdrop for Mobile */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/40 z-20 lg:hidden backdrop-blur-xs"
        />
      )}
    </div>
  );
};
