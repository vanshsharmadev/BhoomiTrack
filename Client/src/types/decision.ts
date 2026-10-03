import { z } from 'zod';

// ==================== ENUMS & LITERALS ====================
export const DecisionTypeEnum = z.enum([
  'LAND_ALTERNATIVE',
  'ALIGNMENT_ALTERNATIVE',
  'ACQUISITION_STRATEGY',
  'RISK_MITIGATION',
  'COMPENSATION_SCENARIO',
  'RR_SCENARIO',
  'PROJECT_PLANNING',
  'OTHER'
]);
export type DecisionType = z.infer<typeof DecisionTypeEnum>;

export const CriterionDirectionEnum = z.enum(['MINIMIZE', 'MAXIMIZE']);
export type CriterionDirection = z.infer<typeof CriterionDirectionEnum>;

export const ConstraintOperatorEnum = z.enum([
  'LESS_THAN',
  'LESS_THAN_OR_EQUAL',
  'GREATER_THAN',
  'GREATER_THAN_OR_EQUAL',
  'EQUALS',
  'NOT_EQUALS',
  'BOOLEAN_TRUE'
]);
export type ConstraintOperator = z.infer<typeof ConstraintOperatorEnum>;

export const HumanDecisionTypeEnum = z.enum([
  'APPROVE',
  'REJECT',
  'SEND_BACK',
  'REQUEST_MORE_EVIDENCE'
]);
export type HumanDecisionType = z.infer<typeof HumanDecisionTypeEnum>;

export const ConfidenceLevelEnum = z.enum(['HIGH', 'MEDIUM', 'LOW']);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelEnum>;

// ==================== SCHEMAS ====================

export const EvidenceReferenceSchema = z.object({
  id: z.string(),
  source: z.string(),
  sourceType: z.enum([
    'PROJECT',
    'PARCEL',
    'NOTIFICATION',
    'AWARD',
    'COMPENSATION',
    'POSSESSION',
    'RR',
    'GIS',
    'RISK',
    'DOCUMENT',
    'OTHER'
  ]),
  sourceId: z.string(),
  timestamp: z.string(),
  originatingModule: z.string(),
  confidenceQuality: ConfidenceLevelEnum.default('HIGH'),
  notes: z.string().optional()
});
export type EvidenceReference = z.infer<typeof EvidenceReferenceSchema>;

export const DecisionCriterionSchema = z.object({
  id: z.string(),
  label: z.string(),
  weight: z.number().min(0).max(100), // Percent weight e.g. 25
  direction: CriterionDirectionEnum,
  unit: z.string().optional(),
  required: z.boolean().default(false),
  description: z.string().optional()
});
export type DecisionCriterion = z.infer<typeof DecisionCriterionSchema>;

export const DecisionConstraintSchema = z.object({
  id: z.string(),
  label: z.string(),
  field: z.string(),
  operator: ConstraintOperatorEnum,
  value: z.union([z.number(), z.string(), z.boolean()]),
  description: z.string().optional(),
  mandatory: z.boolean().default(true)
});
export type DecisionConstraint = z.infer<typeof DecisionConstraintSchema>;

export const DecisionOptionSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  metrics: z.record(z.union([z.number(), z.string(), z.boolean(), z.null()])),
  evidence: z.array(EvidenceReferenceSchema).default([])
});
export type DecisionOption = z.infer<typeof DecisionOptionSchema>;

export const ConstraintResultSchema = z.object({
  optionId: z.string(),
  constraintId: z.string(),
  constraintLabel: z.string(),
  satisfied: z.boolean(),
  reason: z.string(),
  metricValue: z.union([z.number(), z.string(), z.boolean(), z.null()]).optional(),
  thresholdValue: z.union([z.number(), z.string(), z.boolean()]).optional()
});
export type ConstraintResult = z.infer<typeof ConstraintResultSchema>;

export const DecisionFactorSchema = z.object({
  factorId: z.string(),
  label: z.string(),
  impact: z.enum(['POSITIVE', 'NEGATIVE', 'NEUTRAL']),
  weight: z.number(),
  rawScore: z.number(),
  normalizedScore: z.number(),
  description: z.string(),
  evidenceReferences: z.array(EvidenceReferenceSchema).default([])
});
export type DecisionFactor = z.infer<typeof DecisionFactorSchema>;

export const DecisionTradeoffSchema = z.object({
  advantage: z.string(),
  sacrifice: z.string(),
  relativeSeverity: ConfidenceLevelEnum,
  notes: z.string().optional()
});
export type DecisionTradeoff = z.infer<typeof DecisionTradeoffSchema>;

export const RankedOptionSchema = z.object({
  optionId: z.string(),
  label: z.string(),
  rank: z.number(),
  score: z.number(),
  eligible: z.boolean(),
  status: z.enum(['RECOMMENDED', 'ALTERNATIVE', 'INELIGIBLE']),
  ineligibilityReason: z.string().optional(),
  factors: z.array(DecisionFactorSchema),
  tradeoffs: z.array(DecisionTradeoffSchema),
  constraintResults: z.array(ConstraintResultSchema)
});
export type RankedOption = z.infer<typeof RankedOptionSchema>;

export const HumanDecisionSchema = z.object({
  decision: HumanDecisionTypeEnum,
  officerName: z.string(),
  officerRole: z.string(),
  officerComment: z.string().min(5, 'Officer comment is required with statutory rationale'),
  supportingDocumentRef: z.string().optional(),
  recordedAt: z.string()
});
export type HumanDecision = z.infer<typeof HumanDecisionSchema>;

export const DecisionAnalysisRequestSchema = z.object({
  decisionId: z.string().optional(),
  projectId: z.union([z.number(), z.string()]),
  decisionType: DecisionTypeEnum,
  title: z.string().min(3),
  description: z.string().optional(),
  state: z.string().optional(),
  district: z.string().optional(),
  options: z.array(DecisionOptionSchema).min(2).max(5),
  criteria: z.array(DecisionCriterionSchema).min(1),
  constraints: z.array(DecisionConstraintSchema).default([])
});
export type DecisionAnalysisRequest = z.infer<typeof DecisionAnalysisRequestSchema>;

export const DecisionAnalysisResultSchema = z.object({
  analysisId: z.string(),
  version: z.number().default(1),
  projectId: z.union([z.number(), z.string()]),
  decisionType: DecisionTypeEnum,
  title: z.string(),
  description: z.string().optional(),
  recommendedOptionId: z.string(),
  recommendedOptionLabel: z.string(),
  confidenceLevel: ConfidenceLevelEnum,
  confidenceScore: z.number(),
  confidenceRationale: z.string(),
  dataFreshnessWarning: z.string().nullable().optional(),
  ranking: z.array(RankedOptionSchema),
  executiveSummary: z.string(),
  whyThisOption: z.array(z.string()),
  tradeoffs: z.array(DecisionTradeoffSchema),
  constraintsSummary: z.array(ConstraintResultSchema),
  requiresHumanDecision: z.literal(true),
  humanDecision: HumanDecisionSchema.nullable().optional(),
  runTimestamp: z.string(),
  engineVersion: z.string().default('JEV-v2.4-DETERMINISTIC'),
  modelVersion: z.string().default('AI-EXPLANATION-GROUNDED-v1')
});
export type DecisionAnalysisResult = z.infer<typeof DecisionAnalysisResultSchema>;

export const ScenarioSimulationRequestSchema = z.object({
  updatedCriteria: z.array(DecisionCriterionSchema)
});
export type ScenarioSimulationRequest = z.infer<typeof ScenarioSimulationRequestSchema>;

export const ScenarioSimulationResultSchema = z.object({
  originalRecommendedOptionId: z.string(),
  simulatedRecommendedOptionId: z.string(),
  recommendationChanged: z.boolean(),
  primaryFactorsResponsible: z.array(z.string()),
  simulatedRanking: z.array(RankedOptionSchema)
});
export type ScenarioSimulationResult = z.infer<typeof ScenarioSimulationResultSchema>;
