import type { EmploymentProfile } from "@/app/auth";
import { identityApiRequest } from "@/lib/api/identityApiRequest";
import type {
  AccessRegistry,
  JMLAccessAssignment,
  JMLProvisionedUser,
  KeycloakGroup,
  KeycloakUser,
  KeycloakUserAccess,
} from "../types/jml.types";

export const searchKeycloakUsers = async (
  search: string,
): Promise<KeycloakUser[]> => {
  const data = await identityApiRequest<{ users: KeycloakUser[] }>({
    method: "GET",
    url: "/admin/keycloak/users",
    params: { search },
  });

  return data.users;
};

export const provisionFromKeycloak = async (
  keycloakUserId: string,
): Promise<JMLProvisionedUser> => {
  const data = await identityApiRequest<{ user: JMLProvisionedUser }>({
    method: "POST",
    url: "/admin/users/provision-from-keycloak",
    data: {
      keycloakUserId,
      reason: "JML joiner provisioning",
    },
  });

  return data.user;
};

export const updateJMLEmployment = async (
  userId: string,
  employment: EmploymentProfile,
): Promise<JMLProvisionedUser> => {
  const data = await identityApiRequest<{ user: JMLProvisionedUser }>({
    method: "PATCH",
    url: `/users/${userId}`,
    data: { employment },
  });

  return data.user;
};

export const getJMLAccessOptions = async () => {
  const [groupsData, registry] = await Promise.all([
    identityApiRequest<{ groups: KeycloakGroup[] }>({
      method: "GET",
      url: "/admin/keycloak/groups",
    }),
    identityApiRequest<AccessRegistry>({
      method: "GET",
      url: "/permissions/registry",
    }),
  ]);

  return {
    groups: groupsData.groups,
    roles: Object.values(registry.roles),
  };
};

export const getJMLKeycloakAccess = (keycloakUserId: string) =>
  identityApiRequest<KeycloakUserAccess>({
    method: "GET",
    url: `/admin/keycloak/users/${keycloakUserId}/access`,
  });

export const addJMLKeycloakGroup = (
  keycloakUserId: string,
  groupId: string,
) =>
  identityApiRequest<{ revokedSessionCount: number }>({
    method: "POST",
    url: `/admin/keycloak/users/${keycloakUserId}/groups/${groupId}`,
  });

export const updateJMLAccess = async (
  userId: string,
  access: JMLAccessAssignment,
): Promise<JMLProvisionedUser> => {
  const data = await identityApiRequest<{ user: JMLProvisionedUser }>({
    method: "PATCH",
    url: `/users/${userId}/access`,
    data: { access },
  });

  return data.user;
};

export const activateJMLUser = async (
  userId: string,
): Promise<JMLProvisionedUser> => {
  const data = await identityApiRequest<{ user: JMLProvisionedUser }>({
    method: "POST",
    url: `/users/${userId}/activate`,
    data: { reason: "JML joiner workflow completed" },
  });

  return data.user;
};
