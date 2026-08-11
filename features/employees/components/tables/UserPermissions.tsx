"use client";

import { useState } from "react";

import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";

interface UserPermissionRow {
  id: string;
  permission: string;
  domain: string;
  source: string;
}

// TODO: Create a function to get this data
const userPermissions: UserPermissionRow[] = [
  {
    id: "identity-read-staff-profiles",
    permission: "read:staff-profiles",
    domain: "Identity",
    source: "role: platform:engineer",
  },
  {
    id: "platform-write-deployments",
    permission: "write:deployments",
    domain: "Platform",
    source: "role: ops:deployer",
  },
  {
    id: "security-ops-deployer-role",
    permission: "role: ops:deployer",
    domain: "Security",
    source: "group: eng-staff",
  },
  {
    id: "network-vpn-connect",
    permission: "vpn:connect",
    domain: "Network",
    source: "group: vpn-access",
  },
];

const permissionColumns: DataTableColumn<UserPermissionRow>[] = [
  {
    id: "permission",
    header: "Permission",
    cell: (permission) => (
      <span className="inline-flex rounded-[10px] border border-(--secondary-blue) bg-(--secondary-blue)/10 px-2 py-1 text-(--secondary-blue)">
        {permission.permission}
      </span>
    ),
  },
  {
    id: "domain",
    header: "Domain",
    accessorKey: "domain",
    cellClassName: "text-(--primary-blue)",
  },
  {
    id: "source",
    header: "Source",
    accessorKey: "source",
    cellClassName: "text-(--primary-grey)",
  },
];

export default function UserPermissions() {
  const [searchQuery, setSearchQuery] = useState("");
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredPermissions = normalizedQuery
    ? userPermissions.filter((permission) =>
        [permission.permission, permission.domain, permission.source].some(
          (value) => value.toLocaleLowerCase().includes(normalizedQuery),
        ),
      )
    : userPermissions;

  return (
    <DataTable
      title="Effective Permissions"
      description={
        normalizedQuery
          ? `${filteredPermissions.length} of ${userPermissions.length} permissions`
          : `${userPermissions.length} effective ${userPermissions.length === 1 ? "permission" : "permissions"}`
      }
      search={{
        value: searchQuery,
        onChange: setSearchQuery,
        placeholder: "Search permissions",
      }}
      columns={permissionColumns}
      data={filteredPermissions}
      getRowId={(permission) => permission.id}
      minWidthClassName="min-w-140"
      emptyState={
        <div className="grid min-h-40 place-items-center px-5 py-10 text-center">
          <div>
            <div className="text-style__body--bold text-(--primary-blue)">
              {normalizedQuery
                ? "No matching permissions"
                : "No effective permissions"}
            </div>
            <p className="mt-1 text-style__small-text text-(--primary-grey)">
              {normalizedQuery
                ? "Try a different permission, domain, or source."
                : "Permissions inherited from roles and groups will appear here."}
            </p>
          </div>
        </div>
      }
    />
  );
}
