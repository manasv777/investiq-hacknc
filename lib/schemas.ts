import { z } from "zod";

export const OnboardingStepSchema = z.enum([
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
]);

export type OnboardingStep = z.infer<typeof OnboardingStepSchema>;

export const AccountTypeSchema = z.enum([
  "stocks-funds",
  "stocks-funds-crypto",
]);

export const MilitaryStatusSchema = z.enum([
  "currently-serving",
  "transitioning",
  "post-service",
]);

export const MilitaryServiceSchema = z.enum([
  "army",
  "marine-corps",
  "navy",
  "air-force",
  "space-force",
  "coast-guard",
]);

export const EmploymentStatusSchema = z.enum([
  "employed",
  "self-employed",
  "student",
  "retired",
  "unemployed",
]);

export const RiskToleranceSchema = z.enum(["low", "moderate", "high"]);

export const ExperienceLevelSchema = z.enum([
  "beginner",
  "intermediate",
  "advanced",
]);

export interface OnboardingData {
  sessionId: string;
  userId?: string;
  
  // Step A
  accountType?: string;
  
  // Step B
  firstName?: string;
  middleName?: string;
  lastName?: string;
  preferredName?: string;
  email?: string;
  mobile?: string;
  hasMilitaryExperience?: boolean;
  militaryStatus?: string;
  militaryService?: string;
  militaryRank?: string;
  
  // Step C
  dob?: string;
  isUsCitizen?: boolean;
  ssn?: string;
  
  // Step D
  street?: string;
  city?: string;
  state?: string;
  zip?: string;
  
  // Step E
  employmentStatus?: string;
  jobTitle?: string;
  employerName?: string;
  financialInstitutionEmployment?: boolean;
  financialInstitutionName?: string;
  isRestrictedPerson?: boolean;
  backupWithholding?: boolean;
  
  // Step F
  trustedContactName?: string;
  trustedContactEmail?: string;
  trustedContactPhone?: string;
  
  // Step G
  acknowledgedTerms?: boolean;
  acknowledgedRisks?: boolean;
  acknowledgedAccuracy?: boolean;
  acknowledgedPrivacy?: boolean;
  
  // Risk Assessment
  riskTolerance?: string;
  experienceLevel?: string;

  // KYC / Verification
  kycProvider?: "veriff";
  kycSessionId?: string;
  kycStatus?: "pending" | "approved" | "rejected" | "resubmission_requested";
  kycUrl?: string; // link to continue verification
  kycUpdatedAt?: string;
  applicationStatus?: "draft" | "submitted" | "approved" | "rejected";
  approvedAt?: string;
  
  // Metadata
  currentStep?: OnboardingStep;
  completedSteps?: OnboardingStep[];
  startedAt?: string;
  completedAt?: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface AuditLog {
  eventId: string;
  sessionId: string;
  eventType: string;
  details: string;
  timestamp: string;
}

