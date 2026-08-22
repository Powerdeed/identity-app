import { UserPermission } from "@app/auth";
import { identityApiRequest } from "@lib/api/identityApiRequest";

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
  await identityApiRequest<AccessRegistry>({
    method: "GET",
    url: `/permissions/registry`,
  });

export const getAccessGovernanceSummary =
  async (): Promise<AccessGovernanceSummary> =>
    await identityApiRequest<AccessGovernanceSummary>({
      method: "GET",
      url: `/admin/access-governance/summary`,
    });
