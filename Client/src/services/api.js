// Sovereign Civic Infrastructure - Unified Backend API Client
// Implements specs from FRONTEND_API_INTEGRATION_GUIDE.md
// Seamlessly connects to live Spring Boot / PostGIS backend (Render) with zero-downtime mock fallback.

import apiClient, { API_BASE_URL } from '../api/client';

export { API_BASE_URL };

export const ApiService = {
  // ==================== SYSTEM HEALTH ====================
  checkHealth: async () => {
    try {
      const res = await apiClient.get('/health');
      return res;
    } catch {
      try {
        const res2 = await apiClient.get('/api/health');
        return res2;
      } catch {
        return null;
      }
    }
  },

  // ==================== MODULE 1: PROJECTS (/api/projects) ====================
  getProjects: async (params = {}) => {
    try {
      return await apiClient.get('/api/projects', { params });
    } catch (err) {
      console.warn('[NLAMS API] getProjects failed, falling back:', err.message);
      return null;
    }
  },

  getProjectById: async (id) => {
    try {
      return await apiClient.get(`/api/projects/${id}`);
    } catch (err) {
      console.warn(`[NLAMS API] getProjectById(${id}) failed:`, err.message);
      return null;
    }
  },

  createProject: async (projectData) => {
    return await apiClient.post('/api/projects', projectData);
  },

  updateProject: async (id, projectData) => {
    return await apiClient.put(`/api/projects/${id}`, projectData);
  },

  updateProjectStatus: async (id, status, remarks) => {
    return await apiClient.patch(`/api/projects/${id}/status`, { status, remarks });
  },

  // ==================== MODULE 2: PROPOSALS (/api/proposals) ====================
  getProposals: async (params = {}) => {
    try {
      return await apiClient.get('/api/proposals', { params });
    } catch (err) {
      console.warn('[NLAMS API] getProposals failed:', err.message);
      return null;
    }
  },

  getProposalById: async (id) => {
    return await apiClient.get(`/api/proposals/${id}`);
  },

  createProposal: async (proposalData) => {
    return await apiClient.post('/api/proposals', proposalData);
  },

  submitProposal: async (id) => {
    return await apiClient.post(`/api/proposals/${id}/submit`);
  },

  approveProposal: async (id, { decision = 'APPROVED', remarks = '', approvedBy = '', approvalLevel = 'DISTRICT' } = {}) => {
    return await apiClient.post(`/api/proposals/${id}/approve`, {
      decision,
      remarks,
      approvedBy,
      approvalLevel
    });
  },

  returnProposal: async (id) => {
    return await apiClient.post(`/api/proposals/${id}/return`);
  },

  rejectProposal: async (id) => {
    return await apiClient.post(`/api/proposals/${id}/reject`);
  },

  getProposalHistory: async (id) => {
    return await apiClient.get(`/api/proposals/${id}/history`);
  },

  // ==================== MODULE 3: LAND PARCELS (/api/land-parcels) ====================
  getLandParcels: async (params = {}) => {
    try {
      return await apiClient.get('/api/land-parcels', { params });
    } catch (err) {
      console.warn('[NLAMS API] getLandParcels failed:', err.message);
      return null;
    }
  },

  getLandParcelById: async (id) => {
    return await apiClient.get(`/api/land-parcels/${id}`);
  },

  createLandParcel: async (parcelData) => {
    return await apiClient.post('/api/land-parcels', parcelData);
  },

  verifyLandParcel: async (id, { verificationStatus = 'VERIFIED', verifiedBy = '', remarks = '' } = {}) => {
    return await apiClient.patch(`/api/land-parcels/${id}/verify`, {
      verificationStatus,
      verifiedBy,
      remarks
    });
  },

  updateLandParcelStatus: async (id, { status, remarks = '' }) => {
    return await apiClient.patch(`/api/land-parcels/${id}/status`, { status, remarks });
  },

  // ==================== MODULE 4: GIS & MAPBOX / LEAFLET (/api/gis) ====================
  getProjectParcelsGeoJson: async (projectId) => {
    try {
      return await apiClient.get(`/api/gis/projects/${projectId}/parcels`);
    } catch (err) {
      console.warn(`[NLAMS API] getProjectParcelsGeoJson(${projectId}) failed:`, err.message);
      return null;
    }
  },

  getProjectGisSummary: async (projectId) => {
    try {
      return await apiClient.get(`/api/gis/projects/${projectId}/summary`);
    } catch (err) {
      console.warn(`[NLAMS API] getProjectGisSummary(${projectId}) failed:`, err.message);
      return null;
    }
  },

  getDistrictParcelsGeoJson: async (district) => {
    try {
      return await apiClient.get(`/api/gis/parcels/district`, { params: { district } });
    } catch (err) {
      console.warn(`[NLAMS API] getDistrictParcelsGeoJson(${district}) failed:`, err.message);
      return null;
    }
  },

  getNearbyParcels: async (lat, lng, radiusKm = 10) => {
    try {
      return await apiClient.get(`/api/gis/parcels/nearby`, { params: { lat, lng, radiusKm } });
    } catch (err) {
      console.warn('[NLAMS API] getNearbyParcels failed:', err.message);
      return null;
    }
  },

  // ==================== MODULE 5: GAZETTE NOTIFICATIONS (/api/notifications) ====================
  getNotifications: async (params = {}) => {
    try {
      return await apiClient.get('/api/notifications', { params });
    } catch (err) {
      console.warn('[NLAMS API] getNotifications failed:', err.message);
      return null;
    }
  },

  getNotificationById: async (id) => {
    return await apiClient.get(`/api/notifications/${id}`);
  },

  createNotification: async (notificationData) => {
    return await apiClient.post('/api/notifications', notificationData);
  },

  // ==================== MODULE 6: STATUTORY AWARDS (/api/awards) ====================
  getAwards: async (params = {}) => {
    try {
      return await apiClient.get('/api/awards', { params });
    } catch (err) {
      console.warn('[NLAMS API] getAwards failed:', err.message);
      return null;
    }
  },

  getAwardById: async (id) => {
    return await apiClient.get(`/api/awards/${id}`);
  },

  createAward: async (awardData) => {
    return await apiClient.post('/api/awards', awardData);
  },

  // ==================== MODULE 7: COMPENSATION & DISBURSEMENT (/api/compensation) ====================
  getCompensationLedger: async (params = {}) => {
    try {
      return await apiClient.get('/api/compensation', { params });
    } catch (err) {
      console.warn('[NLAMS API] getCompensationLedger failed:', err.message);
      return null;
    }
  },

  createCompensationAssessment: async (compensationData) => {
    return await apiClient.post('/api/compensation', compensationData);
  },

  approveCompensation: async (id) => {
    return await apiClient.post(`/api/compensation/${id}/approve`);
  },

  markCompensationPaid: async (id, { paidAmount, paymentDate, transactionReference, paymentMode = 'RTGS', remarks = '' }) => {
    return await apiClient.post(`/api/compensation/${id}/mark-paid`, {
      paidAmount,
      paymentDate: paymentDate || new Date().toISOString().slice(0, 10),
      transactionReference,
      paymentMode,
      remarks
    });
  },

  // ==================== MODULE 8: PHYSICAL POSSESSION (/api/possession) ====================
  getPossessions: async (params = {}) => {
    try {
      return await apiClient.get('/api/possession', { params });
    } catch (err) {
      console.warn('[NLAMS API] getPossessions failed:', err.message);
      return null;
    }
  },

  schedulePossession: async (possessionData) => {
    return await apiClient.post('/api/possession', possessionData);
  },

  updatePossessionStatus: async (id, { status = 'POSSESSION_TAKEN', possessionDate, remarks = '' }) => {
    return await apiClient.patch(`/api/possession/${id}/status`, {
      status,
      possessionDate: possessionDate || new Date().toISOString().slice(0, 10),
      remarks
    });
  },

  // ==================== MODULE 9: REHABILITATION & RESETTLEMENT (/api/rr/families) ====================
  getRrFamilies: async (params = {}) => {
    try {
      return await apiClient.get('/api/rr/families', { params });
    } catch (err) {
      console.warn('[NLAMS API] getRrFamilies failed:', err.message);
      return null;
    }
  },

  registerRrFamily: async (familyData) => {
    return await apiClient.post('/api/rr/families', familyData);
  },

  updateRrFamilyStatus: async (id, { status = 'COMPLETED', assistanceProvided, remarks = '' }) => {
    return await apiClient.patch(`/api/rr/families/${id}/status`, {
      status,
      assistanceProvided,
      remarks
    });
  },

  // ==================== MODULE 10: LIFECYCLE MILESTONES & DELAY PIPELINE ====================
  initializeMilestones: async (projectId) => {
    return await apiClient.post(`/api/projects/${projectId}/milestones/initialize-lifecycle`);
  },

  getMilestones: async (projectId) => {
    try {
      return await apiClient.get(`/api/projects/${projectId}/milestones`);
    } catch (err) {
      console.warn(`[NLAMS API] getMilestones(${projectId}) failed:`, err.message);
      return null;
    }
  },

  // ==================== MODULE 11: EXECUTIVE DASHBOARDS (/api/dashboard) ====================
  getNationalDashboard: async () => {
    try {
      return await apiClient.get('/api/dashboard/national');
    } catch (err) {
      console.warn('[NLAMS API] getNationalDashboard failed:', err.message);
      return null;
    }
  },
  getNationalAnalytics: async () => {
    return await ApiService.getNationalDashboard();
  },

  getProjectDashboard: async (projectId) => {
    try {
      return await apiClient.get(`/api/dashboard/project/${projectId}`);
    } catch (err) {
      console.warn(`[NLAMS API] getProjectDashboard(${projectId}) failed:`, err.message);
      return null;
    }
  },

  getStateDashboard: async (stateName) => {
    try {
      return await apiClient.get(`/api/dashboard/state/${encodeURIComponent(stateName)}`);
    } catch (err) {
      console.warn(`[NLAMS API] getStateDashboard(${stateName}) failed:`, err.message);
      return null;
    }
  },

  getDistrictDashboard: async (districtName) => {
    try {
      return await apiClient.get(`/api/dashboard/district/${encodeURIComponent(districtName)}`);
    } catch (err) {
      console.warn(`[NLAMS API] getDistrictDashboard(${districtName}) failed:`, err.message);
      return null;
    }
  },

  // ==================== MODULE 12: STATUTORY REPORTS (/api/reports) ====================
  getStateWiseReport: async () => {
    try {
      return await apiClient.get('/api/reports/state-wise');
    } catch (err) {
      console.warn('[NLAMS API] getStateWiseReport failed:', err.message);
      return null;
    }
  },

  getDistrictWiseReport: async () => {
    try {
      return await apiClient.get('/api/reports/district-wise');
    } catch (err) {
      console.warn('[NLAMS API] getDistrictWiseReport failed:', err.message);
      return null;
    }
  },

  getCompensationReport: async () => {
    try {
      return await apiClient.get('/api/reports/compensation');
    } catch (err) {
      console.warn('[NLAMS API] getCompensationReport failed:', err.message);
      return null;
    }
  },

  getPossessionReport: async () => {
    try {
      return await apiClient.get('/api/reports/possession');
    } catch (err) {
      console.warn('[NLAMS API] getPossessionReport failed:', err.message);
      return null;
    }
  },

  getRrReport: async () => {
    try {
      return await apiClient.get('/api/reports/rr');
    } catch (err) {
      console.warn('[NLAMS API] getRrReport failed:', err.message);
      return null;
    }
  },

  getDelaysReport: async () => {
    try {
      return await apiClient.get('/api/reports/delays');
    } catch (err) {
      console.warn('[NLAMS API] getDelaysReport failed:', err.message);
      return null;
    }
  },

  // ==================== MODULE 13: DOCUMENT STORAGE & UPLOADS (/api/documents) ====================
  uploadDocument: async (formData) => {
    return await apiClient.post('/api/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },

  downloadDocumentUrl: (id) => {
    return `${API_BASE_URL}/api/documents/${id}/download`;
  },

  getEntityDocuments: async (entityType, entityId) => {
    try {
      return await apiClient.get(`/api/documents/entity/${entityType}/${entityId}`);
    } catch (err) {
      console.warn(`[NLAMS API] getEntityDocuments(${entityType}, ${entityId}) failed:`, err.message);
      return null;
    }
  },

  // ==================== MODULE 14: IMMUTABLE AUDIT TRAIL (/api/audit) ====================
  getAuditTrail: async (params = {}) => {
    try {
      return await apiClient.get('/api/audit', { params });
    } catch (err) {
      console.warn('[NLAMS API] getAuditTrail failed:', err.message);
      return null;
    }
  },

  getEntityAuditHistory: async (entityName, entityId) => {
    try {
      return await apiClient.get(`/api/audit/${entityName}/${entityId}`);
    } catch (err) {
      console.warn(`[NLAMS API] getEntityAuditHistory(${entityName}, ${entityId}) failed:`, err.message);
      return null;
    }
  },
};

export default ApiService;
