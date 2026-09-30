export type UserRole =
  | 'super_admin'
  | 'firm_admin'
  | 'manager'
  | 'trainer'
  | 'tax_preparer'
  | 'student'
  | 'read_only';

export type TaxYear = '2026' | '2025' | '2024' | '2023' | '2022' | 'prior';

export type KnowledgeStatus =
  | 'Draft'
  | 'Under Review'
  | 'Verified'
  | 'Published'
  | 'Needs Update'
  | 'Archived';

export type ResourceAudience =
  | 'New Tax Preparer'
  | 'Experienced Tax Preparer'
  | 'ERO / Firm Owner'
  | 'Trainer'
  | 'Client'
  | 'General Public';

export type ResourceType =
  | 'cheat_sheet'
  | 'one_pager'
  | 'client_handout'
  | 'preparer_checklist'
  | 'client_doc_checklist'
  | 'due_diligence_checklist'
  | 'client_questionnaire'
  | 'training_guide'
  | 'study_guide'
  | 'comparison_chart'
  | 'tax_topic_summary'
  | 'step_by_step_guide'
  | 'faq_sheet';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  firmId: string;
  avatar?: string;
  ptin?: string;
}

export interface FirmProfile {
  id: string;
  name: string;
  eroName: string;
  brandColor: string;
  logoText: string;
  customInstructions: string;
  clientDisclaimer: string;
  proDisclaimer: string;
  approvedSourcesOnly: boolean;
  defaultTaxYear: TaxYear;
}

export interface IRSSource {
  id: string;
  title: string;
  agency: string;
  pubOrForm: string;
  taxYear: string;
  lastUpdated: string;
  url: string;
  guidanceType:
    | 'Official IRS Guidance'
    | 'Statutory Authority'
    | 'Treasury Regulation'
    | 'IRS Form/Instructions'
    | 'IRS FAQ'
    | 'Revenue Procedure';
  summary: string;
  keyTopics: string[];
  fullGuidance?: string;
  keyProvisions?: string[];
  preparerActionPoints?: string[];
  dueDiligenceCheck?: string;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  category: string;
  taxYear: TaxYear;
  status: KnowledgeStatus;
  overview: string;
  quickReference: string;
  detailedExplanation: string;
  eligibility: string[];
  requirements: string[];
  limits: string;
  exceptions: string[];
  examples: string[];
  documentation: string[];
  forms: string[];
  dueDiligence: string;
  commonMistakes: string[];
  irsSources: IRSSource[];
  lastUpdated: string;
  author: string;
  reviewer: string;
  version: string;
  isRequiredTraining?: boolean;
}

export interface ResearchAuditTrail {
  taxYearVerified: TaxYear;
  searchQueries: string[];
  statutesConsulted: string[];
  authoritiesChecked: string[];
  dueDiligenceRiskLevel: 'Low' | 'Moderate' | 'High';
  verificationTimestamp: string;
  sourceConfidence: number; // 0 to 100
  researchSteps: string[];
}

export interface StructuredAgentResponse {
  quickAnswer: string;
  whatThisMeans?: string;
  why?: string;
  taxYearNote?: string;
  whatToAskClient?: string[];
  documentsToRequest?: string[];
  formsThatMayApply?: string[];
  dueDiligenceConsiderations?: string;
  example?: string;
  watchOutFor?: string[];
  irsSources: IRSSource[];
  nextSteps?: string;
  officialIrsGuidance?: string;
  platformExplanation?: string;
  firmGuidance?: string;
  auditTrail?: ResearchAuditTrail;
}

export interface AgentChatMessage {
  id: string;
  sender: 'user' | 'agent';
  timestamp: string;
  taxYear: TaxYear;
  question?: string;
  content: string;
  structured?: StructuredAgentResponse;
  sources?: IRSSource[];
  auditTrail?: ResearchAuditTrail;
}

export interface SavedResearch {
  id: string;
  title: string;
  question: string;
  taxYear: TaxYear;
  content: string;
  structured?: StructuredAgentResponse;
  sources: IRSSource[];
  date: string;
  folder: string;
  tags: string[];
  notes?: string;
}

export interface GeneratedResource {
  id: string;
  title: string;
  type: ResourceType;
  audience: ResourceAudience;
  taxYear: TaxYear;
  content: string;
  dateCreated: string;
  createdBy: string;
  tags: string[];
  isFavorite: boolean;
  folder?: string;
  firmBranding: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  irsSourceRef: string;
}

export interface TrainingLesson {
  id: string;
  courseId: string;
  title: string;
  taxYear: TaxYear;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedMinutes: number;
  learningObjectives: string[];
  content: string;
  redFlags: string[];
  dueDiligenceFocus: string;
  quiz: QuizQuestion[];
  completedByUsers?: string[];
}

export interface TrainingCourse {
  id: string;
  title: string;
  category: string;
  description: string;
  lessons: TrainingLesson[];
  targetAudience: ResourceAudience;
}

export interface Scenario {
  id: string;
  title: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  taxYear: TaxYear;
  clientName: string;
  backgroundStory: string;
  taxpayerDetails: {
    maritalStatus: string;
    dependents: string[];
    w2Wages?: string;
    selfEmploymentIncome?: string;
    otherIncome?: string;
    specialCircumstances: string;
  };
  keyQuestionsToDetermine: string[];
  authoritativeAnswer: {
    correctFilingStatus: string;
    eligibleDependents: string[];
    eligibleCredits: string[];
    requiredForms: string[];
    dueDiligenceRedFlags: string[];
    statutoryCitations: string[];
  };
}

export interface TaxFormInfo {
  formNumber: string;
  title: string;
  purpose: string;
  whenUsed: string;
  relatedTopics: string[];
  currentTaxYear: string;
  officialSourceUrl: string;
  instructionsUrl: string;
  category: 'Individual' | 'Business' | 'Due Diligence' | 'Credits' | 'Informational';
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  targetType: 'article' | 'resource' | 'agent_setting' | 'training' | 'source';
  targetId: string;
  details: string;
}
