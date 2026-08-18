import { identityApiRequest } from "@/lib/api/identityApiRequest";

export type KeycloakGroup = { id: string; name: string; path?: string };
export type KeycloakRole = { id: string; name: string; description?: string };
export type KeycloakClientRoleGroup = {
  clientId: string;
  roles: KeycloakRole[];
};
export type KeycloakClient = {
  id: string;
  clientId: string;
  name?: string;
  description?: string;
  enabled?: boolean;
};
export type KeycloakUserAccess = {
  groups: KeycloakGroup[];
  realmRoles: KeycloakRole[];
  clientRoles: KeycloakClientRoleGroup[];
};

export const getEmployeeKeycloakAccess = (
  keycloakUserId: string,
): Promise<KeycloakUserAccess> =>
  identityApiRequest({
    method: "GET",
    url: `/admin/keycloak/users/${keycloakUserId}/access`,
  });

export async function getKeycloakGroups(): Promise<KeycloakGroup[]> {
  const response = await identityApiRequest<{ groups: KeycloakGroup[] }>({
    method: "GET",
    url: "/admin/keycloak/groups",
  });
  return response.groups;
}

export async function getKeycloakRealmRoles(): Promise<KeycloakRole[]> {
  const response = await identityApiRequest<{ roles: KeycloakRole[] }>({
    method: "GET",
    url: "/admin/keycloak/realm-roles",
  });
  return response.roles;
}

export async function getKeycloakClients(): Promise<KeycloakClient[]> {
  const response = await identityApiRequest<{ clients: KeycloakClient[] }>({
    method: "GET",
    url: "/admin/keycloak/clients",
  });
  return response.clients;
}

export async function getKeycloakClientRoles(
  clientId: string,
): Promise<KeycloakRole[]> {
  const response = await identityApiRequest<{ roles: KeycloakRole[] }>({
    method: "GET",
    url: `/admin/keycloak/clients/${clientId}/roles`,
  });
  return response.roles;
}

export const addEmployeeKeycloakGroup = (
  keycloakUserId: string,
  groupId: string,
) =>
  identityApiRequest<{ revokedSessionCount: number }>({
    method: "POST",
    url: `/admin/keycloak/users/${keycloakUserId}/groups/${groupId}`,
  });

export const removeEmployeeKeycloakGroup = (
  keycloakUserId: string,
  groupId: string,
) =>
  identityApiRequest<{ revokedSessionCount: number }>({
    method: "DELETE",
    url: `/admin/keycloak/users/${keycloakUserId}/groups/${groupId}`,
  });

type KeycloakRoleInput = {
  scope: "realm" | "client";
  roleName: string;
  clientId?: string;
};

export const addEmployeeKeycloakRole = (
  keycloakUserId: string,
  input: KeycloakRoleInput,
) =>
  identityApiRequest<{ revokedSessionCount: number }>({
    method: "POST",
    url: `/admin/keycloak/users/${keycloakUserId}/roles`,
    data: input,
  });

export const removeEmployeeKeycloakRole = (
  keycloakUserId: string,
  input: KeycloakRoleInput,
) =>
  identityApiRequest<{ revokedSessionCount: number }>({
    method: "DELETE",
    url: `/admin/keycloak/users/${keycloakUserId}/roles`,
    data: input,
  });
