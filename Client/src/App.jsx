import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AppShell } from './components/layout/AppShell';

// Pages strictly corresponding to Backend REST Modules
import { DashboardPage } from './pages/DashboardPage';
import { ProjectRegistryPage } from './pages/ProjectRegistryPage';
import { ProjectWorkspacePage } from './pages/ProjectWorkspacePage';
import { ProposalsPage } from './pages/ProposalsPage';
import { ParcelsPage } from './pages/ParcelsPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { AwardsPage } from './pages/AwardsPage';
import { DbtPage } from './pages/DbtPage';
import { RrPage } from './pages/RrPage';
import { PossessionPage } from './pages/PossessionPage';
import { GisPage } from './pages/GisPage';
import { ReportsPage } from './pages/ReportsPage';
import { VaultPage } from './pages/VaultPage';
import { AuditPage } from './pages/AuditPage';

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppShell>
          <Routes>
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />

            {/* Module 11: National & State Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/monitoring/states" element={<Navigate to="/reports" replace />} />
            <Route path="/monitoring/states/:stateId" element={<Navigate to="/reports" replace />} />

            {/* Module 1 & 10: Projects & Lifecycle Milestones */}
            <Route path="/projects" element={<ProjectRegistryPage />} />
            <Route path="/projects/:projectId" element={<ProjectWorkspacePage />} />

            {/* Module 2: Land Requisition Proposals */}
            <Route path="/acquisition/proposals" element={<ProposalsPage />} />
            <Route path="/acquisition/proposals/:proposalId" element={<ProposalsPage />} />

            {/* Module 3: Land Parcels & Survey */}
            <Route path="/land/parcels" element={<ParcelsPage />} />
            <Route path="/land/parcels/:parcelId" element={<ParcelsPage />} />

            {/* Module 5: Statutory Gazette Notifications */}
            <Route path="/acquisition/notifications" element={<NotificationsPage />} />
            <Route path="/acquisition/notifications/:notificationId" element={<NotificationsPage />} />

            {/* Module 6: Statutory Awards & Solatium */}
            <Route path="/compensation/awards" element={<AwardsPage />} />
            <Route path="/compensation/awards/:awardId" element={<AwardsPage />} />

            {/* Module 7: Compensation Ledger & Bank Disbursement */}
            <Route path="/compensation/disbursement" element={<DbtPage />} />
            <Route path="/compensation/disbursement/:transactionId" element={<DbtPage />} />
            <Route path="/compensation/dbt" element={<Navigate to="/compensation/disbursement" replace />} />

            {/* Module 8: Physical Possession & Panchnama */}
            <Route path="/acquisition/possession" element={<PossessionPage />} />
            <Route path="/acquisition/possession/:possessionId" element={<PossessionPage />} />

            {/* Module 9: Rehabilitation & Resettlement */}
            <Route path="/rr" element={<RrPage />} />
            <Route path="/rr/:familyId" element={<RrPage />} />

            {/* Module 4: Spatial GIS */}
            <Route path="/gis" element={<GisPage />} />

            {/* Module 12: Statutory & Bottleneck Reports */}
            <Route path="/reports" element={<ReportsPage />} />

            {/* Module 13: Document Storage & Vault */}
            <Route path="/governance/vault" element={<VaultPage />} />

            {/* Module 14: Immutable Audit Trail */}
            <Route path="/governance/audit" element={<AuditPage />} />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </AppShell>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;