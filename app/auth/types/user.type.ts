export type UserRole = "viewer" | "sales" | "editor" | "admin";

export type AppId =
  | "command_center"
  | "cms"
  | "auth"
  | "engineering"
  | "sales"
  | "finance"
  | "hr"
  | "operations"
  | "analytics";

export type RoleId =
  | "platform.staff"
  | "platform.super_admin"
  | "platform.security_admin"
  | "command_center.user"
  | "command_center.user_manager"
  | "command_center.app_manager"
  | "command_center.admin"
  | "cms.viewer"
  | "cms.editor"
  | "cms.publisher"
  | "cms.asset_manager"
  | "cms.admin"
  | "engineering.technician"
  | "engineering.engineer"
  | "engineering.lead"
  | "sales.agent"
  | "sales.manager"
  | "finance.accountant"
  | "finance.manager"
  | "finance.approver"
  | "hr.officer"
  | "executive.viewer";

export type RoleScopeType = "global" | "app" | "department" | "project" | "site";

export interface RoleAssignment {
  roleId: RoleId;
  scopeType: RoleScopeType;
  scopeId?: string;
  assignedBy?: string;
  assignedAt?: string;
  expiresAt?: string;
  reason?: string;
}

export type DepartmentId =
  | "executive"
  | "engineering"
  | "operations"
  | "sales"
  | "finance"
  | "hr"
  | "it"
  | "marketing"
  | "administration";

export type SeniorityLevel =
  | "intern"
  | "junior"
  | "mid"
  | "senior"
  | "lead"
  | "manager"
  | "director"
  | "executive";

export type EmploymentType = "full_time" | "part_time" | "contractor" | "intern" | "temporary";

export interface EmploymentProfile {
  employeeNumber?: string;
  departmentId?: DepartmentId;
  teamIds?: string[];
  managerId?: string;
  jobTitle?: string;
  positionCode?: string;
  seniorityLevel?: SeniorityLevel;
  employmentType?: EmploymentType;
  workLocation?: string;
  startDate?: string;
  endDate?: string;
}

export interface AccessProfile {
  appAccess: AppId[];
  roles: RoleAssignment[];
  directPermissions?: UserPermission[];
}

export interface UserTest {
  _id: string;
  name: string;
  email: string;
  roles: UserRole[];
  keycloakUserId?: string;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  roles?: UserRole[];
  keycloakUserId?: string;
  keycloakRoles?: string[];
  keycloakGroups?: string[];
  permissions?: UserPermission[];
  employment?: EmploymentProfile;
  access?: AccessProfile;
  profile?: UserProfile;
  preferences?: UserPreferences;
  security?: UserSecurity;
  activitySummary?: UserActivitySummary;
  roleGovernance?: UserRoleGovernance;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserCredentials {
  email: string;
  password: string;
}

export type UserPermission = string;

export type UserThemePreference = "system" | "light" | "dark";
export type DashboardDensity = "compact" | "comfortable";
export type AccountStatus = "active" | "suspended" | "pendingReview";

export interface UserProfile {
  preferredName?: string;
  avatarUrl?: string;
  phone?: string;
  department?: string;
  jobTitle?: string;
  bio?: string;
  location?: string;
  timezone?: string;
}

export interface UserNotificationPreferences {
  emailAlerts?: boolean;
  securityAlerts?: boolean;
  publishingSummaries?: boolean;
  uploadFailureReports?: boolean;
  weeklyActivityDigest?: boolean;
}

export interface UserWorkflowPreferences {
  draftBeforePublish?: boolean;
  requireAssetMetadata?: boolean;
  warnBeforeReplacingLiveMedia?: boolean;
  markStalePagesForReview?: boolean;
}

export interface UserPreferences {
  theme?: UserThemePreference;
  dashboardDensity?: DashboardDensity;
  defaultLandingPage?: string;
  preservePanelFilters?: boolean;
  showAdvancedAssetMetadata?: boolean;
  publishConfirmations?: boolean;
  notifications?: UserNotificationPreferences;
  workflow?: UserWorkflowPreferences;
}

export interface UserSecurity {
  accountStatus?: AccountStatus;
  recoveryEmail?: string;
  recoveryEmailVerifiedAt?: string | null;
  twoFactorEnabled?: boolean;
  passwordChangedAt?: string | null;
  lastLoginAt?: string | null;
  lastLoginIp?: string;
  sessionTimeoutMinutes?: number;
}

export interface UserActivitySummary {
  editsThisWeek?: number;
  pendingReviews?: number;
  uploadsChecked?: number;
  publishingStreakDays?: number;
  lastActiveAt?: string | null;
}

export interface UserRoleGovernance {
  grantedBy?: string | null;
  grantedAt?: string | null;
  lastReviewedAt?: string | null;
  reviewNotes?: string;
}

export type UserUpdatePayload = Partial<
  Pick<User, "name" | "email" | "role" | "permissions"> & {
    employment: EmploymentProfile;
    access: AccessProfile;
    profile: UserProfile;
    preferences: UserPreferences;
    security: UserSecurity;
    activitySummary: UserActivitySummary;
    roleGovernance: UserRoleGovernance;
  }
>;

export type ModifyUserPayload = UserUpdatePayload;

export interface UserSession {
  _id: string;
  user: string;
  userAgent?: string;
  ip?: string;
  isRevoked: boolean;
  expiresAt?: string;
  createdAt?: string;
  updatedAt?: string;
}
