import { User, UserPermission } from "../types/user.type";

export const PERMISSIONS = {
  IDENTITY_DASHBOARD_MANAGE: "identity.dashboard.manage",
  IDENTITY_USERS_READ: "identity.users.read",
  IDENTITY_USERS_MANAGE: "identity.users.manage",
  IDENTITY_JML_READ: "identity.jml.read",
  IDENTITY_JML_MANAGE: "identity.jml.manage",
  IDENTITY_ACCESS_READ: "identity.access.read",
  IDENTITY_ACCESS_MANAGE: "identity.access.manage",
  IDENTITY_SESSIONS_READ: "identity.sessions.read",
  IDENTITY_SESSIONS_MANAGE: "identity.sessions.manage",
  IDENTITY_SECURITY_READ: "identity.security.read",
  IDENTITY_SECURITY_MANAGE: "identity.security.manage",
  IDENTITY_ACCESS_REVIEWS_READ: "identity.access-reviews.read",
  IDENTITY_POLICIES_READ: "identity.policies.read",
  IDENTITY_POLICIES_MANAGE: "identity.policies.manage",
  IDENTITY_SETTINGS_READ: "identity.settings.read",
  IDENTITY_SETTINGS_MANAGE: "identity.settings.manage",
} as const satisfies Record<string, UserPermission>;

export function getEffectivePermissions(user?: User | null): UserPermission[] {
  return [...new Set(user?.permissions ?? [])];
}

export function hasPermission(
  user: User | null | undefined,
  permission: UserPermission,
): boolean {
  return getEffectivePermissions(user).includes(permission);
}
