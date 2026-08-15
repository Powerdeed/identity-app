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

const getPermissionDomain = (permission: string) =>
  permission.split(/[.:]/)[0] || "general";

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

export default function UserPermissions({
  permissions,
}: {
  permissions: string[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const userPermissions: UserPermissionRow[] = permissions.map(
    (permission, index) => ({
      id: `${permission}-${index}`,
      permission,
      domain: getPermissionDomain(permission),
      source: "effective access",
    }),
  );
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredPermissions = normalizedQuery
    ? userPermissions.filter((permission) =>
        [permission.permission, permission.domain, permission.source].some(
          (value) => value.toLocaleLowerCase().includes(normalizedQuery),
        ),
      )
    : userPermissions;
  const totalPages = Math.ceil(filteredPermissions.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visiblePermissions = filteredPermissions.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

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
        onChange: (value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        },
        placeholder: "Search permissions",
      }}
      columns={permissionColumns}
      data={visiblePermissions}
      getRowId={(permission) => permission.id}
      minWidthClassName="min-w-140"
      pagination={{
        totalItems: filteredPermissions.length,
        currentPage,
        pageSize,
        onPageChange: setCurrentPage,
        onPageSizeChange: setPageSize,
        dataType: "permissions",
      }}
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
