import type {
  AccessGovernanceSummary,
  AccessRegistry,
} from "@/features/employees/services/permissions";

import type {
  ApplicationRow,
  GroupRow,
  KeycloakRoleRow,
  PermissionRow,
  RoleRow,
} from "../types/governance";

export function getPermissionDomain(permission: string) {
  return permission.split(".")[0]?.replaceAll("-", " ") || "platform";
}

export function getPermissionAction(permission: string) {
  const parts = permission.split(".");
  return parts[parts.length - 1] || "access";
}

export function getRoleRisk(
  roleId: string,
  permissions: string[],
): RoleRow["risk"] {
  if (roleId.includes("super_admin")) return "critical";
  if (
    roleId.includes("admin") ||
    permissions.some((permission) => permission.includes(".manage"))
  ) {
    return "high";
  }
  if (
    permissions.some((permission) =>
      [".write", ".delete", ".approve", ".export"].some((action) =>
        permission.includes(action),
      ),
    )
  ) {
    return "medium";
  }
  return "low";
}

export function describeRole(roleId: string) {
  if (roleId.includes("super_admin")) return "Emergency full-system access";
  if (roleId.includes("security_admin"))
    return "Security and access governance";
  if (roleId.startsWith("cms.")) return "CMS application access";
  if (roleId.startsWith("command_center.")) return "Command center access";
  if (roleId.startsWith("engineering.")) return "Engineering team access";
  if (roleId.startsWith("finance.")) return "Finance function access";
  if (roleId.startsWith("sales.")) return "Sales function access";
  if (roleId.startsWith("hr.")) return "HR people operations access";
  if (roleId.startsWith("executive.")) return "Executive reporting access";
  return "Platform access role";
}

export function getGroupType(groupName: string): GroupRow["type"] {
  if (groupName.endsWith("-staff") || groupName === "company") {
    return "baseline";
  }
  if (["managers", "executives"].includes(groupName)) return "role";
  return "access";
}

export function includesSearch(value: unknown, search: string) {
  if (!search) return true;
  return String(value ?? "")
    .toLocaleLowerCase()
    .includes(search);
}

export function buildRoleRows(
  registry: AccessRegistry,
  summary?: AccessGovernanceSummary,
): RoleRow[] {
  return Object.values(registry.roles)
    .sort()
    .map((roleId) => {
      const permissions = registry.rolePermissions[roleId] ?? [];
      return {
        roleId,
        scope: roleId.split(".")[0] || "global",
        risk: getRoleRisk(roleId, permissions),
        permissionCount: permissions.length,
        assignedUsers: summary?.roleAssignments[roleId] ?? 0,
        description: describeRole(roleId),
      };
    });
}

export function buildPermissionRows(
  registry: AccessRegistry,
  summary?: AccessGovernanceSummary,
): PermissionRow[] {
  return Object.values(registry.permissions)
    .sort()
    .map((permissionId) => ({
      permissionId,
      domain: getPermissionDomain(permissionId),
      action: getPermissionAction(permissionId),
      directAssignments:
        summary?.directPermissionAssignments[permissionId] ?? 0,
      includedInRoles: Object.entries(registry.rolePermissions)
        .filter(([, permissions]) => permissions.includes(permissionId))
        .map(([roleId]) => roleId),
    }));
}

export function buildKeycloakRoleRows(
  realmRoles: import("@/features/employees/services/keycloakAccess").KeycloakRole[],
  clientRoles: KeycloakRoleRow[],
): KeycloakRoleRow[] {
  return [
    ...realmRoles.map((role) => ({ ...role, scope: "realm" })),
    ...clientRoles,
  ];
}

export function buildGroupRows(
  groups: import("@/features/employees/services/keycloakAccess").KeycloakGroup[],
): GroupRow[] {
  return groups
    .map((group) => ({ ...group, type: getGroupType(group.name) }))
    .sort((first, second) => first.name.localeCompare(second.name));
}

export function buildApplicationRows(
  roleRows: RoleRow[],
  permissionRows: PermissionRow[],
  summary?: AccessGovernanceSummary,
  appLabels: Record<string, string> = {},
): ApplicationRow[] {
  const appIds = new Set<string>();

  Object.keys(summary?.appAssignments ?? {}).forEach((app) => appIds.add(app));
  roleRows.forEach((role) => appIds.add(role.scope));
  permissionRows.forEach((permission) => appIds.add(permission.domain));

  return [...appIds]
    .filter(Boolean)
    .sort()
    .map((id) => ({
      id,
      name: appLabels[id] ?? id.replaceAll("_", " "),
      assignedUsers: summary?.appAssignments[id] ?? 0,
      roleCount: roleRows.filter((role) => role.scope === id).length,
      permissionCount: permissionRows.filter(
        (permission) => permission.domain === id,
      ).length,
    }));
}
