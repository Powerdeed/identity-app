import type {
  KeycloakGroup,
  KeycloakRole,
} from "@/features/employees/services/keycloakAccess";

export type GovernanceTab =
  | "powerdeedRoles"
  | "permissionRegistry"
  | "keycloakRoles"
  | "keycloakGroups"
  | "applicationCatalog";

export type RoleRow = {
  roleId: string;
  scope: string;
  risk: "low" | "medium" | "high" | "critical";
  permissionCount: number;
  assignedUsers: number;
  description: string;
};

export type PermissionRow = {
  permissionId: string;
  domain: string;
  action: string;
  directAssignments: number;
  includedInRoles: string[];
};

export type KeycloakRoleRow = {
  id: string;
  name: string;
  scope: string;
  description?: string;
};

export type GroupRow = KeycloakGroup & {
  type: "baseline" | "access" | "role";
};

export type ApplicationRow = {
  id: string;
  name: string;
  assignedUsers: number;
  roleCount: number;
  permissionCount: number;
};

export type AccessGovernanceFilters = {
  roleSearch: string;
  permissionSearch: string;
  keycloakRoleSearch: string;
  groupSearch: string;
  applicationSearch: string;
};

export type GovernanceDataState = {
  registry?: import("@/features/employees/services/permissions").AccessRegistry;
  summary?: import("@/features/employees/services/permissions").AccessGovernanceSummary;
  groups: KeycloakGroup[];
  realmRoles: KeycloakRole[];
  clientRoles: KeycloakRoleRow[];
};
