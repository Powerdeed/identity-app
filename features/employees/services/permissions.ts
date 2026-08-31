import type { UserPermission } from "@/globals/types/user.type";
import { apiRequest } from "@lib";

export type AccessRegistry = {
  groups: {
    [x: string]: { [x: string]: UserPermission };
  };
  permissions: {
    [x: string]: UserPermission;
  };
  roles: {
    [x: string]: UserPermission;
  };
  rolePermissions: {
    [x: string]: UserPermission[];
  };
  keycloakCoarseRoles: UserPermission[];
};

export type AccessGovernanceSummary = {
  totalUsers: number;
  roleAssignments: Record<string, number>;
  appAssignments: Record<string, number>;
  directPermissionAssignments: Record<string, number>;
};

export const getAccessRegistry = async (): Promise<AccessRegistry> =>
  await apiRequest<AccessRegistry>({
    method: "GET",
    url: `/permissions/registry`,
  });

export const getAccessGovernanceSummary =
  async (): Promise<AccessGovernanceSummary> =>
    await apiRequest<AccessGovernanceSummary>({
      method: "GET",
      url: `/admin/access-governance/summary`,
    });
