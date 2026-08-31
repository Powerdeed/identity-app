import type { DataTableColumn } from "@/global-components/ui/DataTable";
import StatusChip from "@/global-components/ui/StatusChip";

import type {
  ApplicationRow,
  GroupRow,
  KeycloakRoleRow,
  PermissionRow,
  RoleRow,
} from "../types/governance";
import { riskTone } from "./governance";

export function createRoleColumns(): DataTableColumn<RoleRow>[] {
  return [
    {
      id: "role",
      header: "ROLE",
      cell: (role) => <StatusChip tone="blue">{role.roleId}</StatusChip>,
    },
    { id: "scope", header: "SCOPE", accessorKey: "scope" },
    {
      id: "risk",
      header: "RISK",
      cell: (role) => (
        <StatusChip tone={riskTone[role.risk]}>{role.risk}</StatusChip>
      ),
    },
    { id: "permissions", header: "PERMISSIONS", accessorKey: "permissionCount" },
    {
      id: "assignedUsers",
      header: "ASSIGNED USERS",
      accessorKey: "assignedUsers",
    },
    { id: "description", header: "DESCRIPTION", accessorKey: "description" },
  ];
}

export function createPermissionColumns(): DataTableColumn<PermissionRow>[] {
  return [
    {
      id: "permission",
      header: "PERMISSION",
      cell: (permission) => (
        <StatusChip tone="blue">{permission.permissionId}</StatusChip>
      ),
    },
    { id: "domain", header: "DOMAIN", accessorKey: "domain" },
    {
      id: "action",
      header: "ACTION",
      cell: (permission) => (
        <StatusChip tone="grey">{permission.action}</StatusChip>
      ),
    },
    {
      id: "directAssignments",
      header: "DIRECT ASSIGNMENTS",
      accessorKey: "directAssignments",
    },
    {
      id: "roles",
      header: "INCLUDED IN ROLES",
      cell: (permission) => (
        <div className="flex flex-wrap gap-1.5">
          {permission.includedInRoles.length
            ? permission.includedInRoles.slice(0, 4).map((role) => (
                <StatusChip key={role} tone="blue">
                  {role}
                </StatusChip>
              ))
            : "-"}
          {permission.includedInRoles.length > 4 ? (
            <StatusChip tone="grey">
              +{permission.includedInRoles.length - 4}
            </StatusChip>
          ) : null}
        </div>
      ),
    },
  ];
}

export function createKeycloakRoleColumns(): DataTableColumn<KeycloakRoleRow>[] {
  return [
    {
      id: "role",
      header: "ROLE",
      cell: (role) => <StatusChip tone="blue">{role.name}</StatusChip>,
    },
    { id: "scope", header: "SCOPE", accessorKey: "scope" },
    { id: "description", header: "DESCRIPTION", accessorKey: "description" },
  ];
}

export function createGroupColumns(): DataTableColumn<GroupRow>[] {
  return [
    {
      id: "group",
      header: "GROUP",
      cell: (group) => <StatusChip tone="green">{group.name}</StatusChip>,
    },
    { id: "path", header: "PATH", accessorKey: "path" },
    {
      id: "type",
      header: "TYPE",
      cell: (group) => <StatusChip tone="green">{group.type}</StatusChip>,
    },
  ];
}

export function createApplicationColumns(): DataTableColumn<ApplicationRow>[] {
  return [
    { id: "name", header: "APPLICATION", accessorKey: "name" },
    { id: "id", header: "APP ID", accessorKey: "id" },
    {
      id: "assignedUsers",
      header: "ASSIGNED USERS",
      accessorKey: "assignedUsers",
    },
    { id: "roleCount", header: "ROLES", accessorKey: "roleCount" },
    {
      id: "permissionCount",
      header: "PERMISSIONS",
      accessorKey: "permissionCount",
    },
  ];
}
