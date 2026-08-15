import { AccessProfile, EmploymentProfile, User, UserSession } from "@/app/auth";
import { identityApiRequest } from "@/lib/api/identityApiRequest";
import { AuditData, AuditEvent } from "../types/audit.types";

type rawUserData = {
  success: boolean;
  user: User;
};

export const getEmployee = async (employeeId: string): Promise<User> => {
  const userData = await identityApiRequest<rawUserData>({
    method: "GET",
    url: `/users/${employeeId}`,
  });

  return userData.user;
};

export const updateEmployeeEmployment = async (
  employeeId: string,
  employment: EmploymentProfile,
): Promise<User> => {
  const userData = await identityApiRequest<rawUserData>({
    method: "PATCH",
    url: `/users/${employeeId}`,
    data: { employment },
  });

  return userData.user;
};

export const updateEmployeeAccess = async (
  employeeId: string,
  input: {
    access?: AccessProfile;
    permissions?: string[];
  },
): Promise<User> => {
  const userData = await identityApiRequest<rawUserData>({
    method: "PATCH",
    url: `/users/${employeeId}/access`,
    data: input,
  });

  return userData.user;
};

export const getEmployeeSessions = async (
  employeeId: string,
): Promise<UserSession[]> => {
  const sessionData = await identityApiRequest<{ sessions: UserSession[] }>({
    method: "GET",
    url: `/admin/users/${employeeId}/sessions`,
  });

  return sessionData.sessions;
};

export const getEmployeeLastActivity = async (
  employeeId: string,
): Promise<AuditEvent | null> => {
  const sessionData = await identityApiRequest<AuditData>({
    method: "GET",
    url: `/admin/audit-events?targetUserId=${employeeId}&pageSize=1`,
  });

  return sessionData.events[0] ?? null;
};

export const getEmployeeActivities = async (
  employeeId: string,
): Promise<AuditEvent[]> => {
  const activityData = await identityApiRequest<AuditData>({
    method: "GET",
    url: `/admin/audit-events?targetUserId=${employeeId}&pageSize=100`,
  });

  return activityData.events;
};

export type KeycloakGroup = {
  id: string;
  name: string;
  path?: string;
};

export type KeycloakRole = {
  id: string;
  name: string;
  description?: string;
};

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

export const getEmployeeKeycloakAccess = async (
  keycloakUserId: string,
): Promise<KeycloakUserAccess> =>
  identityApiRequest<KeycloakUserAccess>({
    method: "GET",
    url: `/admin/keycloak/users/${keycloakUserId}/access`,
  });

export const getKeycloakGroups = async (): Promise<KeycloakGroup[]> => {
  const data = await identityApiRequest<{ groups: KeycloakGroup[] }>({
    method: "GET",
    url: "/admin/keycloak/groups",
  });

  return data.groups;
};

export const getKeycloakRealmRoles = async (): Promise<KeycloakRole[]> => {
  const data = await identityApiRequest<{ roles: KeycloakRole[] }>({
    method: "GET",
    url: "/admin/keycloak/realm-roles",
  });

  return data.roles;
};

export const getKeycloakClients = async (): Promise<KeycloakClient[]> => {
  const data = await identityApiRequest<{ clients: KeycloakClient[] }>({
    method: "GET",
    url: "/admin/keycloak/clients",
  });

  return data.clients;
};

export const getKeycloakClientRoles = async (
  clientId: string,
): Promise<KeycloakRole[]> => {
  const data = await identityApiRequest<{ roles: KeycloakRole[] }>({
    method: "GET",
    url: `/admin/keycloak/clients/${clientId}/roles`,
  });

  return data.roles;
};

export const addEmployeeKeycloakGroup = async (
  keycloakUserId: string,
  groupId: string,
) =>
  identityApiRequest<{ revokedSessionCount: number }>({
    method: "POST",
    url: `/admin/keycloak/users/${keycloakUserId}/groups/${groupId}`,
  });

export const removeEmployeeKeycloakGroup = async (
  keycloakUserId: string,
  groupId: string,
) =>
  identityApiRequest<{ revokedSessionCount: number }>({
    method: "DELETE",
    url: `/admin/keycloak/users/${keycloakUserId}/groups/${groupId}`,
  });

export const addEmployeeKeycloakRole = async (
  keycloakUserId: string,
  input: { scope: "realm" | "client"; roleName: string; clientId?: string },
) =>
  identityApiRequest<{ revokedSessionCount: number }>({
    method: "POST",
    url: `/admin/keycloak/users/${keycloakUserId}/roles`,
    data: input,
  });

export const removeEmployeeKeycloakRole = async (
  keycloakUserId: string,
  input: { scope: "realm" | "client"; roleName: string; clientId?: string },
) =>
  identityApiRequest<{ revokedSessionCount: number }>({
    method: "DELETE",
    url: `/admin/keycloak/users/${keycloakUserId}/roles`,
    data: input,
  });

export const revokeEmployeeSession = async (
  employeeId: string,
  sessionId: string,
) =>
  identityApiRequest<{ message: string }>({
    method: "POST",
    url: `/admin/users/${employeeId}/sessions/${sessionId}/revoke`,
  });

export const revokeAllEmployeeSessions = async (employeeId: string) =>
  identityApiRequest<{ message: string; revokedSessionCount: number }>({
    method: "POST",
    url: `/admin/users/${employeeId}/sessions/revoke-all`,
  });

export const activateEmployee = async (
  employeeId: string,
  reason?: string,
): Promise<User> => {
  const userData = await identityApiRequest<rawUserData>({
    method: "POST",
    url: `/users/${employeeId}/activate`,
    data: { reason },
  });

  return userData.user;
};

export const suspendEmployee = async (
  employeeId: string,
  reason?: string,
): Promise<User> => {
  const userData = await identityApiRequest<rawUserData>({
    method: "POST",
    url: `/users/${employeeId}/suspend`,
    data: { reason },
  });

  return userData.user;
};

export const archiveEmployee = async (
  employeeId: string,
  reason?: string,
): Promise<User> => {
  const userData = await identityApiRequest<rawUserData>({
    method: "POST",
    url: `/users/${employeeId}/archive`,
    data: { reason },
  });

  return userData.user;
};
