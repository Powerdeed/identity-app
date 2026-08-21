import type {
  AccessProfile,
  AppId,
  EmploymentProfile,
  RoleId,
  User,
  UserStatus,
} from "@/app/auth";
import type { MoveReasonCode } from "../constants/MOVE_REASONS";

export const JML_SECTIONS = ["Joiner", "Mover", "Leaver"] as const;

export type JMLSection = (typeof JML_SECTIONS)[number];

export type KeycloakUser = {
  id: string;
  username: string;
  email: string;
  name: string;
  firstName: string;
  lastName: string;
  enabled: boolean;
  emailVerified: boolean;
  createdAt?: string;
  powerdeedUserId?: string;
  powerdeedStatus?: UserStatus;
};

export type JMLEmploymentForm = {
  departmentId: string;
  teamIds: string;
  jobTitle: string;
  positionCode: string;
  seniorityLevel: string;
  employmentType: string;
  workLocation: string;
  managerId: string;
  startDate: string;
};

export type KeycloakGroup = {
  id: string;
  name: string;
  path?: string;
};

export type KeycloakUserAccess = {
  groups: KeycloakGroup[];
};

export type AccessRegistry = {
  roles: Record<string, RoleId>;
};

export type JMLProvisionedUser = User & {
  id: string;
  keycloakUserId: string;
  status: UserStatus;
};

export type JMLAccessAssignment = {
  appAccess: AppId[];
  roles: Array<{
    roleId: RoleId;
    scopeType: "global";
    assignedAt: string;
    reason: string;
  }>;
};

export type MoverChangeForm = {
  departmentId: string;
  departmentCode: string;
  departmentName: string;
  jobProfileId: string;
  jobTitle: string;
  managerId: string;
  managerName: string;
  reasonCode: MoveReasonCode | "";
  reasonDetails: string;
  effectiveDate: string;
};

export type MoveEmployeeInput = {
  employment: {
    departmentId?: string;
    jobProfileId?: string;
    managerId?: string;
  };
  reasonCode: MoveReasonCode;
  reasonDetails?: string;
  effectiveDate: string;
};

export type MoveEmployeeResult = {
  user: JMLProvisionedUser;
  revokedSessionCount: number;
  changedFields: string[];
  reasonCode: MoveReasonCode;
  effectiveDate: string;
  assignmentHistoryId: string;
};

export type AssignmentHistorySource =
  | "baseline"
  | "jml_move"
  | "manual_correction"
  | "import";

export type AccessReviewStatus =
  | "not_required"
  | "pending"
  | "in_review"
  | "completed"
  | "waived";

export type EmploymentAssignmentHistory = {
  id: string;
  userId: string;
  effectiveDate: string;
  reasonCode: MoveReasonCode | "history_baseline";
  reasonDetails?: string | null;
  source: AssignmentHistorySource;
  changedFields: string[];
  previousAssignment: EmploymentProfile;
  assignment: EmploymentProfile;
  accessSnapshot: {
    role?: string;
    permissions?: string[];
    access?: AccessProfile;
  };
  accessReview?: {
    id: string;
    status: AccessReviewStatus;
    roleConsequences: Record<string, unknown>;
    keycloakGroupConsequences: Record<string, unknown>;
    reviewedByUserId?: string | null;
    reviewedAt?: string | null;
    notes?: string | null;
    createdAt: string;
    updatedAt: string;
  } | null;
  appliedAt: string;
  createdAt: string;
  department?: { id: string; code: string; name: string } | null;
  jobProfile?: { id: string; code: string; title: string } | null;
  manager?: { id: string; name: string; email: string } | null;
  actor?: { id: string; name: string; email: string } | null;
};

export type AssignmentHistoryPage = {
  history: EmploymentAssignmentHistory[];
  total: number;
  page: number;
  pageSize: number;
};
