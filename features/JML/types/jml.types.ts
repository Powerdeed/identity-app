import type { AppId, RoleId, User, UserStatus } from "@/app/auth";

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
