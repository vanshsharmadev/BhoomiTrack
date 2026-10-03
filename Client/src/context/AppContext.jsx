import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import {
  INITIAL_PROJECTS,
  INITIAL_PARCELS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AWARDS,
  INITIAL_DBT_TRANSACTIONS,
  INITIAL_RR_FAMILIES,
  INITIAL_POSSESSIONS,
  INITIAL_AUDIT_LOGS
} from '../data/mockData';
import { ApiService } from '../services/api';

const AppContext = createContext(null);

export const ROLES = {
  CENTRAL: {
    id: 'CENTRAL',
    name: 'Dr. V. K. Ramanujam, IAS',
    title: 'Director General (Land Resources)',
    dept: 'Department of Land Resources • Ministry of Rural Development',
    level: 'Union Government Tier-1'
  },
  STATE: {
    id: 'STATE',
    name: 'Shri S. K. Patel, IAS',
    title: 'State Nodal Officer (Land Acquisition)',
    dept: 'Revenue & Disaster Management Dept • Govt of Gujarat',
    level: 'State Headquarter Tier-2'
  },
  DISTRICT: {
    id: 'DISTRICT',
    name: 'Shri Alok Dwivedi, PCS',
    title: 'District Collector & Competent Authority (CALA)',
    dept: 'Office of the District Magistrate • Greater Noida',
    level: 'District Field Administration Tier-3'
  },
  FINANCE: {
    id: 'FINANCE',
    name: 'Smt. Shailaja Deshmukh',
    title: 'Principal Treasury Officer (PFMS Escrow)',
    dept: 'Finance Wing • National Highway Authority / PFMS',
    level: 'Financial Sanctioning Authority'
  },
  FIELD: {
    id: 'FIELD',
    name: 'Amin K. L. Mistry',
    title: 'Senior Cadastral Amin / DGPS Rover Officer',
    dept: 'Field Survey Directorate • NavIC GNSS Taskforce',
    level: 'Field Verification Staff'
  },
  AUDITOR: {
    id: 'AUDITOR',
    name: 'Shri D. C. Joshi',
    title: 'Chief Vigilance & STQC L-4 Auditor',
    dept: 'Comptroller & Auditor General of India (CAG Team)',
    level: 'Constitutional Audit & Transparency'
  }
};

const INITIAL_PROPOSALS = [
  {
    id: 'PROP-2026-MoRTH-042',
    projectTitle: 'Surat–Nashik Greenfield Industrial Expressway Spur',
    agency: 'NHAI',
    ministry: 'MoRTH',
    state: 'Gujarat & Maharashtra',
    districts: 'Surat, Navsari, Nashik',
    submissionDate: '2026-08-14',
    currentStage: 'Stage 01: SIA Feasibility Vetting',
    assignedOfficer: 'Dr. V. K. Ramanujam, IAS',
    slaDaysRemaining: 18,
    estimatedLandHa: 340.5,
    estimatedCostCr: 4200.0,
    status: 'Pending Scrutiny',
    technicalScrutiny: 'RoW alignment confirmed with PM GatiShakti NMP v4. Zero railway interlocking conflicts.',
    financialScrutiny: 'Escrow funding provisioned under Bharatmala Tranche-II budget head 5054.',
    legalScrutiny: 'Section 4 SIA public notification issued in 14 village panchayats.',
    dprSummary: '112 km 6-lane access-controlled greenfield expressway to accelerate container movement between Hazira Port and JNPT.',
    queriesCount: 2
  },
  {
    id: 'PROP-2026-RAIL-019',
    projectTitle: 'Dedicated Rail Feeder Line to Dholera SIR',
    agency: 'DFCCIL',
    agencyFullName: 'Dedicated Freight Corridor Corporation of India Ltd',
    ministry: 'Ministry of Railways',
    state: 'Gujarat',
    districts: 'Ahmedabad (Dholera Taluka)',
    submissionDate: '2026-09-02',
    currentStage: 'Stage 01: Forest Buffer Verification',
    assignedOfficer: 'Shri S. K. Patel, IAS',
    slaDaysRemaining: 24,
    estimatedLandHa: 195.2,
    estimatedCostCr: 1850.0,
    status: 'Clarification Required',
    technicalScrutiny: 'Alignment traverses 8.4 Ha protected mangrove buffer near Gulf of Khambhat. Environmental NOC pending.',
    financialScrutiny: 'Sanction approved by Railway Board Infra Committee.',
    legalScrutiny: 'CRZ Clearance application submitted to MoEFCC.',
    dprSummary: '42 km high-axle freight spur providing direct connection between Western DFC and Dholera Special Investment Region.',
    queriesCount: 4
  }
];

export const AppProvider = ({ children }) => {
  const [currentRole, setCurrentRole] = useState(ROLES.CENTRAL);

  // Core Datasets Strictly Corresponding to Backend Modules
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
  const [parcels, setParcels] = useState(INITIAL_PARCELS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [awards, setAwards] = useState(INITIAL_AWARDS);
  const [dbtTransactions, setDbtTransactions] = useState(INITIAL_DBT_TRANSACTIONS);
  const [rrFamilies, setRrFamilies] = useState(INITIAL_RR_FAMILIES);
  const [possessions, setPossessions] = useState(INITIAL_POSSESSIONS);
  const [auditLogs, setAuditLogs] = useState(INITIAL_AUDIT_LOGS);

  // Global Filters & UI States
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [selectedAgencyFilter, setSelectedAgencyFilter] = useState('ALL');
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);
  const [isLiveBackend, setIsLiveBackend] = useState(false);
  const [isHydrating, setIsHydrating] = useState(false);
  const [liveSyncTime, setLiveSyncTime] = useState(null);
  const [nationalAnalytics, setNationalAnalytics] = useState(null);

  const showToast = useCallback((message, type = 'info') => {
    setToastMessage({ message, type, id: Date.now() });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  }, []);

  const logAuditEvent = useCallback((action, module, entity, details) => {
    const newEntry = {
      id: `AUD-${Date.now().toString().slice(-5)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' IST',
      actorName: currentRole.name,
      actorRole: currentRole.title,
      module,
      entity,
      action,
      details,
      hash: '0x' + Math.random().toString(16).substring(2, 10) + '98a4e'
    };
    setAuditLogs((prev) => [newEntry, ...prev]);
  }, [currentRole]);

  // Primary Hydration from Live Backend REST Modules
  const hydrateFromLiveBackend = useCallback(async () => {
    try {
      setIsHydrating(true);
      const health = await ApiService.checkHealth();
      if (!health || health.status !== 'UP') {
        setIsLiveBackend(false);
        setIsHydrating(false);
        return;
      }

      setBackendHealth(health);
      setIsLiveBackend(true);

      // Fetch all core backend modules
      const [
        projectsRes,
        proposalsRes,
        parcelsRes,
        notificationsRes,
        awardsRes,
        compensationRes,
        possessionRes,
        rrFamiliesRes,
        auditRes,
        nationalDashboardRes
      ] = await Promise.allSettled([
        ApiService.getProjects({ size: 100 }),
        ApiService.getProposals({ size: 100 }),
        ApiService.getLandParcels({ size: 100 }),
        ApiService.getNotifications({ size: 100 }),
        ApiService.getAwards({ size: 100 }),
        ApiService.getCompensationLedger({ size: 100 }),
        ApiService.getPossessions({ size: 100 }),
        ApiService.getRrFamilies({ size: 100 }),
        ApiService.getAuditTrail({ size: 50 }),
        ApiService.getNationalDashboard()
      ]);

      // 1. Module 1: Projects (/api/projects)
      if (projectsRes.status === 'fulfilled' && projectsRes.value) {
        const liveItems = projectsRes.value.content || projectsRes.value || [];
        if (Array.isArray(liveItems) && liveItems.length > 0) {
          const adaptedLiveProjects = liveItems.map((p) => {
            const landReq = p.estimatedLandRequirement ? Number(p.estimatedLandRequirement) : 150;
            const progress = p.status === 'COMPLETED' ? 100 : p.status === 'IN_ACQUISITION' ? 65 : p.status === 'APPROVED' ? 40 : 20;
            return {
              id: p.projectCode || `PRJ-${p.id}`,
              numericId: p.id,
              projectCode: p.projectCode || `PRJ-${p.id}`,
              name: p.projectName,
              agency: p.implementingAgency || 'NHAI',
              agencyFullName: p.implementingAgency === 'DFCCIL' ? 'Dedicated Freight Corridor Corporation of India Ltd' : p.implementingAgency === 'NHAI' ? 'National Highways Authority of India' : (p.ministryDepartment || 'Central Agency'),
              ministry: p.ministryDepartment || 'Ministry of Railways',
              state: p.state || 'Gujarat',
              district: p.district || 'Surat',
              additionalDistricts: [],
              corridorType: p.projectType || 'Infrastructure Corridor',
              landRequiredHa: +(landReq * (p.requiredLandUnit === 'ACRES' ? 0.404686 : 1)).toFixed(1),
              landAcquiredHa: +(landReq * 0.404686 * (progress / 100)).toFixed(1),
              progressPercent: progress,
              currentStage: p.status === 'IN_ACQUISITION' ? 'Stage 05: Sec 19 Declaration' : p.status === 'APPROVED' ? 'Stage 03: Cadastral Survey' : 'Stage 01: Project Inception',
              statutorySection: p.status === 'IN_ACQUISITION' ? 'Sec 19' : 'Sec 11',
              statutoryVelocityDays: 140,
              statutorySlaDays: 365,
              risk: p.status === 'UNDER_REVIEW' ? 'Medium' : 'Low',
              riskReason: p.description || 'Statutory land acquisition under RFCTLARR Act 2013',
              overallStatus: p.status === 'IN_ACQUISITION' ? 'In Acquisition' : p.status === 'APPROVED' ? 'Approved' : 'Under Review',
              compensationSanctionedCr: +(landReq * 1.5).toFixed(1),
              compensationDisbursedCr: +(landReq * 1.5 * (progress / 100)).toFixed(1),
              compensationPercent: progress,
              affectedFamilies: Math.round(landReq * 2.5),
              familiesRehabilitated: Math.round(landReq * 2.5 * (progress / 100)),
              parcelsCount: Math.round(landReq * 3),
              villagesCount: Math.max(3, Math.round(landReq / 40)),
              chainage: 'Corridor Section 01',
              lastUpdated: p.updatedAt ? p.updatedAt.slice(0, 10) : '2026-10-03',
              isLive: true
            };
          });

          setProjects((prev) => {
            const liveCodes = new Set(adaptedLiveProjects.map((lp) => lp.projectCode));
            const retainedMock = prev.filter((mp) => !liveCodes.has(mp.projectCode));
            return [...adaptedLiveProjects, ...retainedMock];
          });
        }
      }

      // 2. Module 2: Proposals (/api/proposals)
      if (proposalsRes.status === 'fulfilled' && proposalsRes.value) {
        const liveProps = proposalsRes.value.content || proposalsRes.value || [];
        if (Array.isArray(liveProps) && liveProps.length > 0) {
          const adaptedProps = liveProps.map((pr) => ({
            id: pr.proposalNumber || `PROP-${pr.id}`,
            numericId: pr.id,
            projectId: pr.projectId,
            projectTitle: pr.projectName || `Project #${pr.projectId}`,
            agency: 'DFCCIL',
            ministry: 'Ministry of Railways',
            state: pr.state || 'Gujarat',
            districts: pr.district || 'Surat',
            submissionDate: pr.createdAt ? pr.createdAt.slice(0, 10) : '2026-10-03',
            currentStage: pr.status === 'APPROVED' ? 'Stage 02: Approved for Cadastral Survey' : 'Stage 01: Requisition Scrutiny',
            assignedOfficer: 'District Collector Surat',
            slaDaysRemaining: 21,
            estimatedLandHa: pr.landRequired ? +(Number(pr.landRequired) * 0.404686).toFixed(1) : 50.0,
            estimatedCostCr: pr.estimatedCompensation ? +(Number(pr.estimatedCompensation) / 10000000).toFixed(2) : 18.5,
            status: pr.status === 'APPROVED' ? 'Approved' : pr.status === 'SUBMITTED' ? 'Submitted' : 'Pending Scrutiny',
            technicalScrutiny: pr.purpose || 'Statutory freight railway bypass requisition',
            financialScrutiny: `Estimated compensation: ₹${(Number(pr.estimatedCompensation || 0) / 10000000).toFixed(2)} Cr`,
            legalScrutiny: `Villages identified: ${pr.villages || 'Surat talukas'}`,
            dprSummary: pr.remarks || 'Statutory proposal submitted under RFCTLARR Act 2013',
            queriesCount: 0,
            isLive: true
          }));

          setProposals((prev) => {
            const liveIds = new Set(adaptedProps.map((p) => p.id));
            const retained = prev.filter((p) => !liveIds.has(p.id));
            return [...adaptedProps, ...retained];
          });
        }
      }

      // 3. Module 3: Land Parcels (/api/land-parcels)
      if (parcelsRes.status === 'fulfilled' && parcelsRes.value) {
        const liveParcels = parcelsRes.value.content || parcelsRes.value || [];
        if (Array.isArray(liveParcels) && liveParcels.length > 0) {
          const adaptedParcels = liveParcels.map((pcl) => {
            const area = pcl.area ? Number(pcl.area) : 2.5;
            return {
              id: pcl.parcelNumber || `PCL-${pcl.id}`,
              numericId: pcl.id,
              projectId: pcl.projectId,
              projectName: pcl.projectName || 'Surat Bypass Corridor',
              khasraNo: pcl.khasraNumber || pcl.surveyNumber || `KH-${pcl.id}`,
              surveyNo: pcl.surveyNumber || `SRV-${pcl.id}`,
              ulpin: `ULPIN-GJ-SUR-${pcl.id}042`,
              state: pcl.state || 'Gujarat',
              district: pcl.district || 'Surat',
              tehsil: pcl.tehsil || 'Choryasi',
              village: pcl.village || 'Bhestan',
              ownerName: pcl.ownerName || 'Verified Citizen',
              ownerContact: pcl.ownerContact || '+91 98765 43210',
              areaHa: pcl.areaUnit === 'ACRES' ? +(area * 0.404686).toFixed(2) : area,
              landType: pcl.landType || 'Private Agricultural',
              status: pcl.acquisitionStatus ? pcl.acquisitionStatus.replace(/_/g, ' ') : 'Identified',
              verificationStatus: pcl.verificationStatus || 'VERIFIED',
              marketRatePerHa: 4500000,
              solatium100Percent: 4500000,
              totalCompensationAssessed: 9000000,
              isLive: true
            };
          });

          setParcels((prev) => {
            const liveKeys = new Set(adaptedParcels.map((p) => p.id));
            const retained = prev.filter((p) => !liveKeys.has(p.id));
            return [...adaptedParcels, ...retained];
          });
        }
      }

      // 4. Module 5: Notifications (/api/notifications)
      if (notificationsRes.status === 'fulfilled' && notificationsRes.value) {
        const liveNotifs = notificationsRes.value.content || notificationsRes.value || [];
        if (Array.isArray(liveNotifs) && liveNotifs.length > 0) {
          const adaptedNotifs = liveNotifs.map((n) => ({
            id: n.notificationNumber || `NOTIF-${n.id}`,
            numericId: n.id,
            projectId: n.projectCode || `PRJ-${n.projectId}`,
            projectName: n.projectName || 'Surat Bypass Corridor',
            type: n.notificationType ? n.notificationType.replace(/_/g, ' ') : 'Section 11 Preliminary',
            gazetteNo: n.gazetteNumber || `GZ/2026/${n.id}`,
            issueDate: n.issueDate || '2026-03-01',
            publicationDate: n.publicationDate || '2026-03-05',
            status: n.status || 'Active & Published',
            description: n.description || n.remarks || 'Statutory gazette notification published in official gazette',
            isLive: true
          }));

          setNotifications((prev) => {
            const liveKeys = new Set(adaptedNotifs.map((n) => n.id));
            const retained = prev.filter((n) => !liveKeys.has(n.id));
            return [...adaptedNotifs, ...retained];
          });
        }
      }

      // 5. Module 6: Awards (/api/awards)
      if (awardsRes.status === 'fulfilled' && awardsRes.value) {
        const liveAwards = awardsRes.value.content || awardsRes.value || [];
        if (Array.isArray(liveAwards) && liveAwards.length > 0) {
          const adaptedAwards = liveAwards.map((a) => ({
            id: a.awardNumber || `AWD-${a.id}`,
            numericId: a.id,
            projectId: a.projectCode || `PRJ-${a.projectId}`,
            projectName: a.projectName || 'Western Dedicated Freight Corridor',
            khasraNo: a.surveyNumber || '102/1A',
            beneficiaryName: a.ownerName || 'Ramesh Bhai Patel',
            beneficiaryId: `BEN-${a.parcelId || a.id}`,
            marketValueCr: a.marketValue ? +(Number(a.marketValue) / 10000000).toFixed(2) : 0.75,
            solatiumCr: a.solatium ? +(Number(a.solatium) / 10000000).toFixed(2) : 0.75,
            totalAwardCr: a.assessedAmount ? +(Number(a.assessedAmount) / 10000000).toFixed(2) : 1.50,
            status: a.status ? a.status.replace(/_/g, ' ') : 'Approved by Collector (Ready for DBT)',
            declarationDate: a.awardDate || '2026-05-15',
            isLive: true
          }));

          setAwards((prev) => {
            const liveKeys = new Set(adaptedAwards.map((a) => a.id));
            const retained = prev.filter((a) => !liveKeys.has(a.id));
            return [...adaptedAwards, ...retained];
          });
        }
      }

      // 6. Module 7: Compensation (/api/compensation)
      if (compensationRes.status === 'fulfilled' && compensationRes.value) {
        const liveComp = compensationRes.value.content || compensationRes.value || [];
        if (Array.isArray(liveComp) && liveComp.length > 0) {
          const adaptedDbts = liveComp.map((c) => ({
            id: c.transactionReference || `TXN-PFMS-${c.id}`,
            numericId: c.id,
            beneficiaryName: c.beneficiaryName,
            bankAccount: c.bankAccountNumberMasked || 'XXXXXXXX9876',
            ifsc: c.ifscCode || 'SBIN0001234',
            amount: c.paidAmount ? Number(c.paidAmount) : Number(c.assessedAmount || 0),
            amountLakh: +(Number(c.paidAmount || c.assessedAmount || 0) / 100000).toFixed(2),
            pfmsStatus: c.paymentStatus === 'PAID' ? 'Successful (NPCI Clearing Verified)' : 'Sanctioned (Ready for Disbursal)',
            bankUtr: c.transactionReference || 'UTR-PENDING',
            date: c.paymentDate || '2026-06-01',
            isLive: true
          }));

          setDbtTransactions((prev) => {
            const liveKeys = new Set(adaptedDbts.map((d) => d.id));
            const retained = prev.filter((d) => !liveKeys.has(d.id));
            return [...adaptedDbts, ...retained];
          });
        }
      }

      // 7. Module 8: Possession (/api/possession)
      if (possessionRes.status === 'fulfilled' && possessionRes.value) {
        const livePoss = possessionRes.value.content || possessionRes.value || [];
        if (Array.isArray(livePoss) && livePoss.length > 0) {
          const adaptedPossessions = livePoss.map((pos) => ({
            id: `POS-${pos.id}`,
            numericId: pos.id,
            projectId: pos.projectCode || `PRJ-${pos.projectId}`,
            projectName: pos.projectName || 'Surat Bypass Corridor',
            khasraNo: pos.surveyNumber || '102/1A',
            village: pos.village || 'Bhestan',
            district: 'Surat',
            state: 'Gujarat',
            vestedAreaHa: 2.5,
            panchnamaDate: pos.possessionDate || '2026-06-20',
            status: pos.possessionStatus === 'POSSESSION_TAKEN' ? 'Physical Possession Complete' : 'Scheduled Handover',
            executingAuthority: pos.possessionOfficer || 'Tehsildar Choryasi',
            lawAndOrderSupportRequired: false,
            signedPanchnamaUploaded: pos.possessionStatus === 'POSSESSION_TAKEN',
            isLive: true
          }));

          setPossessions((prev) => {
            const liveKeys = new Set(adaptedPossessions.map((p) => p.id));
            const retained = prev.filter((p) => !liveKeys.has(p.id));
            return [...adaptedPossessions, ...retained];
          });
        }
      }

      // 8. Module 9: R&R Families (/api/rr/families)
      if (rrFamiliesRes.status === 'fulfilled' && rrFamiliesRes.value) {
        const liveFamilies = rrFamiliesRes.value.content || rrFamiliesRes.value || [];
        if (Array.isArray(liveFamilies) && liveFamilies.length > 0) {
          const adaptedFamilies = liveFamilies.map((f) => ({
            id: `FAM-${f.id}`,
            numericId: f.id,
            headName: f.familyHeadName,
            membersCount: f.familyMemberCount || 5,
            category: f.category || 'Displaced',
            socialCategory: f.socialCategory || 'General',
            village: f.village || 'Bhestan',
            district: f.district || 'Surat',
            state: f.state || 'Gujarat',
            entitlement: f.entitlementDetails || 'Resettlement Plot #12 + INR 5,00,000 grant',
            assistanceAmountCr: +(Number(f.assistanceAmount || 0) / 10000000).toFixed(2),
            rehabStatus: f.rehabilitationStatus ? f.rehabilitationStatus.replace(/_/g, ' ') : 'Allotted & Resettled',
            isLive: true
          }));

          setRrFamilies((prev) => {
            const liveKeys = new Set(adaptedFamilies.map((f) => f.id));
            const retained = prev.filter((f) => !liveKeys.has(f.id));
            return [...adaptedFamilies, ...retained];
          });
        }
      }

      // 9. Module 14: Audit Trail (/api/audit)
      if (auditRes.status === 'fulfilled' && auditRes.value) {
        const liveAudits = auditRes.value.content || auditRes.value || [];
        if (Array.isArray(liveAudits) && liveAudits.length > 0) {
          const adaptedAudits = liveAudits.map((a) => ({
            id: `AUD-LIVE-${a.id}`,
            numericId: a.id,
            timestamp: a.performedAt ? a.performedAt.replace('T', ' ').slice(0, 19) + ' IST' : '2026-10-03 14:00:00 IST',
            actorName: a.performedBy || 'System Administrator',
            actorRole: a.performedRole || 'Competent Authority',
            module: a.entityName ? a.entityName.replace(/_/g, ' ') : 'Statutory Registry',
            entity: `${a.entityName || 'Entity'} #${a.entityId}`,
            action: a.action,
            details: a.remarks || `${a.action} performed on ${a.entityName} #${a.entityId}`,
            hash: '0x' + (a.id * 892347).toString(16).padEnd(8, '0') + 'c91e',
            isLive: true
          }));

          setAuditLogs((prev) => {
            const liveKeys = new Set(adaptedAudits.map((a) => a.id));
            const retained = prev.filter((a) => !liveKeys.has(a.id));
            return [...adaptedAudits, ...retained];
          });
        }
      }

      // 10. Module 11: National Dashboard Analytics (/api/dashboard/national)
      if (nationalDashboardRes.status === 'fulfilled' && nationalDashboardRes.value) {
        setNationalAnalytics(nationalDashboardRes.value);
      }

      setLiveSyncTime(new Date().toLocaleTimeString('en-IN', { hour12: true }));
      showToast('Live backend synchronized with 14 statutory modules', 'success');
    } catch (err) {
      console.error('[NLAMS] Hydration error:', err);
      setIsLiveBackend(false);
    } finally {
      setIsHydrating(false);
    }
  }, [showToast]);

  useEffect(() => {
    hydrateFromLiveBackend();
  }, [hydrateFromLiveBackend]);

  // ==================== LIVE ACTION HANDLERS ====================

  // 1. Create Project (POST /api/projects)
  const createProject = async (projectData) => {
    try {
      const res = await ApiService.createProject(projectData);
      showToast(`Project ${projectData.projectCode} registered successfully!`, 'success');
      logAuditEvent('PROJECT_REGISTERED', 'Projects', projectData.projectCode, projectData.projectName);
      await hydrateFromLiveBackend();
      return res;
    } catch (err) {
      showToast(`Creation error: ${err.message}`, 'error');
      throw err;
    }
  };

  // 2. Approve Award (Sec 23 RFCTLARR)
  const approveAward = async (awardId) => {
    setAwards((prev) =>
      prev.map((awd) =>
        awd.id === awardId ? { ...awd, status: 'Approved by Collector (Ready for DBT)' } : awd
      )
    );
    logAuditEvent('AWARD_SANCTION_APPROVED', 'Award & Compensation', awardId, 'Sanction approved under Sec 23 RFCTLARR Act');
    showToast(`Award ${awardId} approved and staged for PFMS Treasury disbursal`, 'success');
  };

  // 3. Execute DBT Disbursal (POST /api/compensation/{id}/mark-paid)
  const executeDbt = async (transactionId) => {
    try {
      const target = dbtTransactions.find((t) => t.id === transactionId);
      if (target?.numericId) {
        await ApiService.markCompensationPaid(target.numericId, {
          paidAmount: target.amount || 15000000,
          transactionReference: `UTR-RTGS-${Date.now().toString().slice(-10)}`,
          paymentMode: 'RTGS',
          remarks: 'Host-to-host direct benefit credit verified'
        });
      }
      setDbtTransactions((prev) =>
        prev.map((txn) =>
          txn.id === transactionId
            ? {
                ...txn,
                pfmsStatus: 'Successful (NPCI Clearing Verified)',
                completionDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
                bankUtr: `UTR-PFMS-${Date.now().toString().slice(-8)}`
              }
            : txn
        )
      );
      logAuditEvent('PFMS_DBT_DISBURSED', 'Compensation', transactionId, 'Executed host-to-host bank transfer');
      showToast(`PFMS Transaction ${transactionId} cleared and credited to beneficiary`, 'success');
    } catch (err) {
      showToast(`Failed live payment: ${err.message}`, 'error');
    }
  };

  // 4. Execute Panchnama Possession (PATCH /api/possession/{id}/status)
  const executePanchnama = async (possessionId) => {
    try {
      const target = possessions.find((p) => p.id === possessionId);
      if (target?.numericId) {
        await ApiService.updatePossessionStatus(target.numericId, {
          status: 'POSSESSION_TAKEN',
          possessionDate: new Date().toISOString().slice(0, 10),
          remarks: 'Panchnama executed in the presence of 5 village panch witnesses'
        });
      }
      setPossessions((prev) =>
        prev.map((p) =>
          p.id === possessionId
            ? {
                ...p,
                status: 'Physical Possession Complete',
                signedPanchnamaUploaded: true
              }
            : p
        )
      );
      logAuditEvent('SECTION38_PANCHNAMA_EXECUTED', 'Possession', possessionId, 'Signed physical vesting panchnama memo under Section 38');
      showToast(`Physical Possession Panchnama executed for ${possessionId}. Land formally vested.`, 'success');
    } catch (err) {
      showToast(`Error executing panchnama: ${err.message}`, 'error');
    }
  };

  // 5. Approve Proposal (POST /api/proposals/{id}/approve)
  const approveProposal = async (proposalId) => {
    try {
      const target = proposals.find((p) => p.id === proposalId);
      if (target?.numericId) {
        await ApiService.approveProposal(target.numericId, {
          decision: 'APPROVED',
          remarks: 'Verified and approved by District Collector Committee',
          approvedBy: currentRole.name,
          approvalLevel: 'DISTRICT'
        });
      }
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status: 'Approved' } : p))
      );
      logAuditEvent('DPR_SCRUTINY_APPROVED', 'Proposals', proposalId, 'Approved proposal and cleared for Sec 11 gazette notification');
      showToast(`Proposal ${proposalId} successfully approved and transitioned to Cadastral Survey!`, 'success');
    } catch (err) {
      showToast(`Proposal approval error: ${err.message}`, 'error');
    }
  };

  // 6. Submit Proposal (POST /api/proposals/{id}/submit)
  const submitProposal = async (proposalId) => {
    try {
      const target = proposals.find((p) => p.id === proposalId);
      if (target?.numericId) {
        await ApiService.submitProposal(target.numericId);
      }
      setProposals((prev) =>
        prev.map((p) => (p.id === proposalId ? { ...p, status: 'Submitted' } : p))
      );
      logAuditEvent('PROPOSAL_SUBMITTED', 'Proposals', proposalId, 'Submitted for statutory committee review');
      showToast(`Proposal ${proposalId} submitted for administrative scrutiny`, 'success');
    } catch (err) {
      showToast(`Submission error: ${err.message}`, 'error');
    }
  };

  // 7. Field Verification of Parcel (PATCH /api/land-parcels/{id}/verify)
  const verifyParcel = async (parcelId, remarks = 'Field survey verified on ground with Patwari') => {
    try {
      const target = parcels.find((p) => p.id === parcelId);
      if (target?.numericId) {
        await ApiService.verifyLandParcel(target.numericId, {
          verificationStatus: 'VERIFIED',
          verifiedBy: currentRole.name,
          remarks
        });
      }
      setParcels((prev) =>
        prev.map((pcl) =>
          pcl.id === parcelId ? { ...pcl, verificationStatus: 'VERIFIED' } : pcl
        )
      );
      logAuditEvent('PARCEL_FIELD_VERIFIED', 'Land Parcels', parcelId, remarks);
      showToast(`Parcel ${parcelId} field boundaries verified!`, 'success');
    } catch (err) {
      showToast(`Verification error: ${err.message}`, 'error');
    }
  };

  // 8. Section 19(7) Extension Invocation (Module 5: Notifications)
  const requestSec19Extension = (projectCode) => {
    logAuditEvent('SEC19_EXTENSION_INVOKED', 'Notifications', projectCode, 'Invoked Section 19(7) proviso extension to prevent lapse');
    showToast(`Statutory Section 19(7) extension notice published for ${projectCode}`, 'success');
  };

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchState = selectedStateFilter === 'ALL' || (p.state && p.state.includes(selectedStateFilter));
      const matchAgency = selectedAgencyFilter === 'ALL' || p.agency === selectedAgencyFilter;
      return matchState && matchAgency;
    });
  }, [projects, selectedStateFilter, selectedAgencyFilter]);

  const value = {
    currentRole,
    setCurrentRole,
    projects,
    setProjects,
    filteredProjects,
    proposals,
    setProposals,
    parcels,
    setParcels,
    notifications,
    setNotifications,
    awards,
    setAwards,
    dbtTransactions,
    setDbtTransactions,
    rrFamilies,
    setRrFamilies,
    possessions,
    setPossessions,
    auditLogs,
    setAuditLogs,
    selectedStateFilter,
    setSelectedStateFilter,
    selectedAgencyFilter,
    setSelectedAgencyFilter,
    isSearchModalOpen,
    setIsSearchModalOpen,
    toastMessage,
    showToast,
    backendHealth,
    isLiveBackend,
    isHydrating,
    liveSyncTime,
    nationalAnalytics,
    refreshAllData: hydrateFromLiveBackend,
    logAuditEvent,
    createProject,
    approveAward,
    executeDbt,
    executePanchnama,
    approveProposal,
    submitProposal,
    verifyParcel,
    requestSec19Extension
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
