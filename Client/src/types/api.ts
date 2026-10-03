// ==================== ENVELOPES ====================
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface PageResponse<T> {
  content: T[];
  page?: {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  };
  empty?: boolean;
  first?: boolean;
  last?: boolean;
  number?: number;
  numberOfElements?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

// ==================== ENUMS ====================
export type ProjectType =
  | 'HIGHWAY'
  | 'RAILWAY'
  | 'METRO'
  | 'AIRPORT'
  | 'PORT'
  | 'INDUSTRIAL_CORRIDOR'
  | 'SMART_CITY'
  | 'RENEWABLE_ENERGY'
  | 'IRRIGATION'
  | 'DEFENSE'
  | 'OTHER';

export type ProjectStatus =
  | 'DRAFT'
  | 'PROPOSAL_SUBMITTED'
  | 'PROPOSAL_APPROVED'
  | 'UNDER_REVIEW'
  | 'APPROVED'
  | 'IN_ACQUISITION'
  | 'SURVEY_IN_PROGRESS'
  | 'SECTION_11_ISSUED'
  | 'SECTION_19_ISSUED'
  | 'AWARD_DECLARED'
  | 'COMPENSATION_IN_PROGRESS'
  | 'POSSESSION_IN_PROGRESS'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED';

export type LandType = 'PRIVATE' | 'GOVERNMENT' | 'COMMUNITY' | 'FOREST' | 'TRIBAL' | 'AGRICULTURAL' | 'COMMERCIAL';

export type AcquisitionStatus =
  | 'IDENTIFIED'
  | 'FIELD_VERIFIED'
  | 'SECTION_11_NOTIFIED'
  | 'SECTION_19_DECLARED'
  | 'AWARD_DECLARED'
  | 'COMPENSATION_PAID'
  | 'POSSESSION_TAKEN'
  | 'ACQUIRED'
  | 'DISPUTED';

export type VerificationStatus = 'PENDING' | 'VERIFIED' | 'REJECTED' | 'DISPUTED';

export type NotificationType =
  | 'SECTION_11_PRELIMINARY'
  | 'SECTION_19_FINAL_DECLARATION'
  | 'SECTION_21_PUBLIC_NOTICE'
  | 'SECTION_40_URGENCY_CLAUSE'
  | 'PRELIMINARY_NOTIFICATION'
  | 'FINAL_NOTIFICATION';

export type AwardStatus = 'DRAFT' | 'DECLARED' | 'DISPUTED' | 'SETTLED' | 'APPROVED';

export type PaymentStatus = 'PENDING' | 'APPROVED' | 'DISBURSED' | 'FAILED' | 'PAID';

export type PossessionStatus = 'SCHEDULED' | 'INSPECTION_PENDING' | 'POSSESSION_TAKEN' | 'DISPUTED';

export type FamilyCategory = 'DISPLACED' | 'AFFECTED' | 'TITLE_HOLDER' | 'TENANT' | 'AGRICULTURAL_LABOURER';

export type RehabilitationStatus = 'IDENTIFIED' | 'ELIGIBLE' | 'ASSISTANCE_DISBURSED' | 'REHABILITATED' | 'COMPLETED';

// ==================== ENTITIES ====================
export interface Project {
  id: number;
  projectCode: string;
  projectName: string;
  projectType: ProjectType;
  description?: string;
  implementingAgency: string;
  ministryDepartment?: string;
  state: string;
  district: string;
  estimatedLandRequirement: number;
  requiredLandUnit: string;
  projectStartDate?: string;
  expectedCompletionDate?: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  createdBy?: string | null;
}

export interface Proposal {
  id: number;
  proposalNumber: string;
  projectId: number;
  projectCode?: string;
  projectName: string;
  landRequired: number;
  landUnit: string;
  villages: string;
  district: string;
  state: string;
  purpose: string;
  status: 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED' | 'RETURNED';
  proposedTimelineMonths?: number;
  affectedFamiliesCount?: number;
  estimatedCompensation?: number;
  remarks?: string;
  createdAt: string;
  updatedAt?: string;
  submittedAt?: string;
  reviewedAt?: string;
  submittedBy?: string;
}

export interface LandParcel {
  id: number;
  parcelNumber: string;
  surveyNumber: string;
  khasraNumber?: string;
  village: string;
  tehsil?: string;
  district: string;
  state: string;
  area: number;
  areaUnit: string;
  landType: LandType;
  ownerName: string;
  ownerContact?: string;
  ownerAadhaarMasked?: string;
  latitude?: number;
  longitude?: number;
  geometry?: any;
  acquisitionStatus: AcquisitionStatus;
  verificationStatus: VerificationStatus;
  verifiedBy?: string;
  verifiedAt?: string;
  projectId?: number;
  projectCode?: string;
  projectName?: string;
  remarks?: string;
}

export interface GeoJsonFeature {
  type: 'Feature';
  id: number;
  geometry: {
    type: string;
    coordinates: any;
  };
  properties: {
    parcelId: number;
    parcelNumber: string;
    surveyNumber: string;
    ownerName: string;
    area: number;
    status: AcquisitionStatus;
    color: string;
    [key: string]: any;
  };
}

export interface GeoJsonFeatureCollection {
  type: 'FeatureCollection';
  features: GeoJsonFeature[];
}

export interface Notification {
  id: number;
  projectId: number;
  projectCode?: string;
  projectName?: string;
  notificationType: NotificationType;
  notificationNumber: string;
  issueDate: string;
  publicationDate: string;
  gazetteNumber?: string;
  documentId?: number;
  status?: string;
  description?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Award {
  id: number;
  projectId: number;
  projectCode?: string;
  projectName?: string;
  parcelId: number;
  parcelNumber?: string;
  surveyNumber?: string;
  ownerName?: string;
  awardNumber: string;
  awardDate: string;
  assessedAmount: number;
  marketValue: number;
  solatium: number;
  additionalAmount?: number;
  competentAuthority?: string;
  documentId?: number;
  status?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CompensationRecord {
  id: number;
  projectId: number;
  projectCode?: string;
  projectName?: string;
  parcelId: number;
  parcelNumber?: string;
  surveyNumber?: string;
  beneficiaryName: string;
  beneficiaryType: string;
  bankAccountNumberMasked?: string;
  ifscCode?: string;
  assessedAmount: number;
  approvedAmount: number;
  paidAmount?: number;
  paymentDate?: string;
  paymentStatus?: PaymentStatus;
  transactionReference?: string;
  paymentMode?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PossessionRecord {
  id: number;
  projectId: number;
  projectCode?: string;
  projectName?: string;
  parcelId: number;
  parcelNumber?: string;
  surveyNumber?: string;
  village?: string;
  possessionDate: string;
  possessionStatus: PossessionStatus;
  possessionOfficer?: string;
  inspectionReference?: string;
  panchnamaDocumentId?: number;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface RrFamily {
  id: number;
  projectId: number;
  projectCode?: string;
  projectName?: string;
  familyHeadName: string;
  familyMemberCount: number;
  category: FamilyCategory;
  socialCategory: string;
  village: string;
  district: string;
  state: string;
  entitlementDetails: string;
  assistanceAmount: number;
  assistanceProvided?: number;
  alternativeSiteAllotted?: boolean;
  alternativeSiteDetails?: string;
  rehabilitationStatus: RehabilitationStatus;
  completionDate?: string;
  remarks?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuditRecord {
  id: number;
  entityName: string;
  entityId: number;
  action: string;
  oldValue?: string;
  newValue?: string;
  performedBy: string;
  performedRole: string;
  performedAt: string;
  ipAddress?: string;
  remarks?: string;
}

export interface Milestone {
  id: number;
  projectId: number;
  stageNumber: number;
  stageName: string;
  plannedDate?: string;
  actualDate?: string;
  delayDays: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' | 'DELAYED';
}

export interface NationalDashboard {
  totalProjects: number;
  totalLandProposed?: number;
  totalLandRequired?: number;
  totalLandAcquired: number;
  landAcquisitionPercentage: number;
  totalCompensationAssessed: number;
  totalCompensationPaid: number;
  compensationDisbursementPercentage: number;
  totalAffectedFamilies: number;
  totalDisplacedFamilies: number;
  possessionProgressPercentage: number;
  rrProgressPercentage: number;
  delayedProjectsCount: number;
  projectsByStatus: Record<string, number>;
  projectsByType: Record<string, number>;
}
