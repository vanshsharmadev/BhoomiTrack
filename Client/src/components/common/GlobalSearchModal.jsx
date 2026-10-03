import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

export const GlobalSearchModal = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, projects, parcels, notifications, awards } = useApp();
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.altKey && e.key.toLowerCase() === 'k') || (e.ctrlKey && e.key.toLowerCase() === 'k')) {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isSearchModalOpen) {
        setIsSearchModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchModalOpen, setIsSearchModalOpen]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();

    const matchedProjects = (projects || []).filter(
      (p) =>
        p.id?.toLowerCase().includes(q) ||
        p.projectCode?.toLowerCase().includes(q) ||
        p.name?.toLowerCase().includes(q) ||
        p.state?.toLowerCase().includes(q) ||
        p.district?.toLowerCase().includes(q)
    );

    const matchedParcels = (parcels || []).filter(
      (pcl) =>
        pcl.id?.toLowerCase().includes(q) ||
        pcl.khasraNo?.toLowerCase().includes(q) ||
        pcl.ulpin?.toLowerCase().includes(q) ||
        pcl.village?.toLowerCase().includes(q) ||
        pcl.ownerName?.toLowerCase().includes(q)
    );

    const matchedNotifs = (notifications || []).filter(
      (n) =>
        n.id?.toLowerCase().includes(q) ||
        n.notificationNumber?.toLowerCase().includes(q) ||
        n.projectCode?.toLowerCase().includes(q) ||
        n.section?.toLowerCase().includes(q)
    );

    const matchedAwards = (awards || []).filter(
      (a) =>
        a.id?.toLowerCase().includes(q) ||
        a.beneficiaryName?.toLowerCase().includes(q) ||
        a.khasraNo?.toLowerCase().includes(q)
    );

    return {
      projects: matchedProjects,
      parcels: matchedParcels,
      notifications: matchedNotifs,
      awards: matchedAwards
    };
  }, [query, projects, parcels, notifications, awards]);

  if (!isSearchModalOpen) return null;

  const handleSelect = (url) => {
    setIsSearchModalOpen(false);
    setQuery('');
    navigate(url);
  };

  const totalHits = searchResults
    ? searchResults.projects.length +
      searchResults.parcels.length +
      searchResults.notifications.length +
      searchResults.awards.length
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-primary-container/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="w-full max-w-3xl bg-surface-container-lowest rounded-lg shadow-2xl border border-outline-variant overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant/40 flex items-center gap-3">
          <span className="material-symbols-outlined text-secondary text-[24px]">search</span>
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Project Code, Khasra, ULPIN, Gazette S.O., Owner, Award ID..."
            className="w-full bg-transparent text-primary placeholder-outline font-medium text-base focus:outline-none"
          />
          {query && (
            <button onClick={() => setQuery('')} className="text-outline hover:text-primary">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded bg-surface-container-high text-xs font-mono text-on-surface-variant">
            ESC
          </kbd>
        </div>

        {/* Results Area */}
        <div className="overflow-y-auto p-4 space-y-4 flex-1">
          {!query && (
            <div className="text-center py-10 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">travel_explore</span>
              <p className="text-sm font-medium">Quick Discovery across the Sovereign Cadastral Repository</p>
              <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
                <span className="px-2 py-1 bg-surface-container rounded cursor-pointer hover:bg-surface-container-high" onClick={() => setQuery('DME')}>
                  Try "DME"
                </span>
                <span className="px-2 py-1 bg-surface-container rounded cursor-pointer hover:bg-surface-container-high" onClick={() => setQuery('Khasra 114')}>
                  Try "Khasra 114"
                </span>
                <span className="px-2 py-1 bg-surface-container rounded cursor-pointer hover:bg-surface-container-high" onClick={() => setQuery('Patel')}>
                  Try "Patel"
                </span>
                <span className="px-2 py-1 bg-surface-container rounded cursor-pointer hover:bg-surface-container-high" onClick={() => setQuery('Sec 19')}>
                  Try "Sec 19"
                </span>
              </div>
            </div>
          )}

          {query && totalHits === 0 && (
            <div className="text-center py-10 text-on-surface-variant">
              <span className="material-symbols-outlined text-4xl text-outline mb-2">search_off</span>
              <p className="text-sm">No statutory records matching "{query}" found in current database.</p>
            </div>
          )}

          {searchResults && (
            <>
              {searchResults.projects.length > 0 && (
                <div>
                  <div className="text-xs uppercase font-bold text-outline tracking-wider mb-1 flex items-center justify-between">
                    <span>Projects & Corridors ({searchResults.projects.length})</span>
                    <span className="text-[10px]">National Project Registry</span>
                  </div>
                  <div className="divide-y divide-outline-variant/20 bg-surface-container-low/40 rounded border border-outline-variant/20">
                    {searchResults.projects.map((p) => (
                      <div
                        key={p.id}
                        onClick={() => handleSelect(`/projects/${p.id}`)}
                        className="p-2.5 hover:bg-surface-container cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div className="flex flex-col">
                          <span className="font-bold text-primary text-sm">{p.name}</span>
                          <span className="text-xs text-on-surface-variant font-code-tabular">
                            {p.projectCode} • {p.agency} • {p.state} ({p.district})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-semibold text-primary font-code-tabular">{p.progressPercent}%</span>
                          <div className="text-[10px] text-outline uppercase">{p.currentStage.split(':')[0]}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.parcels.length > 0 && (
                <div>
                  <div className="text-xs uppercase font-bold text-outline tracking-wider mb-1 flex items-center justify-between">
                    <span>Cadastral Parcels & Khasras ({searchResults.parcels.length})</span>
                    <span className="text-[10px]">Bhu-Naksha Sync</span>
                  </div>
                  <div className="divide-y divide-outline-variant/20 bg-surface-container-low/40 rounded border border-outline-variant/20">
                    {searchResults.parcels.map((pcl) => (
                      <div
                        key={pcl.id}
                        onClick={() => handleSelect(`/land/parcels/${pcl.id}`)}
                        className="p-2.5 hover:bg-surface-container cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary text-sm font-code-tabular">Khasra {pcl.khasraNo}</span>
                            <span className="text-xs px-1.5 py-0.2 rounded bg-surface-container-high text-secondary">
                              ULPIN: {pcl.ulpin}
                            </span>
                          </div>
                          <span className="text-xs text-on-surface-variant">
                            {pcl.village}, {pcl.district} • Owner: {pcl.ownerName}
                          </span>
                        </div>
                        <div className="text-right text-xs">
                          <span className="font-semibold text-primary font-code-tabular">{pcl.acquiredAreaHa} Ha</span>
                          <div className="text-[10px] text-[#107307] font-semibold">{pcl.acquisitionStatus}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.notifications.length > 0 && (
                <div>
                  <div className="text-xs uppercase font-bold text-outline tracking-wider mb-1 flex items-center justify-between">
                    <span>Statutory Gazette Notifications ({searchResults.notifications.length})</span>
                    <span className="text-[10px]">e-Gazette Repository</span>
                  </div>
                  <div className="divide-y divide-outline-variant/20 bg-surface-container-low/40 rounded border border-outline-variant/20">
                    {searchResults.notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => handleSelect(`/acquisition/notifications/${n.id}`)}
                        className="p-2.5 hover:bg-surface-container cursor-pointer flex items-center justify-between transition-colors"
                      >
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-primary text-sm font-code-tabular">{n.notificationNumber}</span>
                            <span className="text-xs px-1.5 py-0.2 rounded bg-surface-container-high text-primary font-semibold">
                              {n.section}
                            </span>
                          </div>
                          <span className="text-xs text-on-surface-variant">
                            {n.projectName} • Gazette Date: {n.gazettePublicationDate}
                          </span>
                        </div>
                        <div className="text-right text-xs">
                          <span className="font-code-tabular font-bold text-secondary">{n.totalAreaHa} Ha</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2 bg-surface-container-low border-t border-outline-variant/30 flex items-center justify-between text-xs text-on-surface-variant">
          <span>Sovereign Security: All query audits logged under STQC L-4</span>
          <span>Tip: Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
