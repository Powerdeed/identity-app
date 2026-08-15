"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import DataTableFilters from "@/global-components/ui/DataTableFilters";
import type { AccessRegistry } from "../../services/permissions";

interface RolePickerRow {
  id: string;
  role: string;
  domain: string;
  permissionCount: number;
  alreadyAssigned: boolean;
}

const STATUS_FILTERS = ["All statuses", "Available", "Assigned"] as const;
const SORT_OPTIONS = [
  "Role A-Z",
  "Role Z-A",
  "Domain A-Z",
  "Available first",
  "Assigned first",
  "Most permissions",
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number];
type SortOption = (typeof SORT_OPTIONS)[number];

const getRoleDomain = (role: string) => role.split(/[.:]/)[0] || "general";

export default function RolePicker({
  registry,
  assignedRoles,
  onSelectRole,
  isSaving,
}: {
  registry: AccessRegistry;
  assignedRoles: string[];
  onSelectRole: (role: string) => void;
  isSaving?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All statuses");
  const [domainFilter, setDomainFilter] = useState("All domains");
  const [sortOption, setSortOption] = useState<SortOption>("Role A-Z");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const assignedRoleSet = new Set(assignedRoles);
  const roleRows: RolePickerRow[] = [...new Set(Object.values(registry.roles))]
    .sort((first, second) => first.localeCompare(second))
    .map((role) => ({
      id: role,
      role,
      domain: getRoleDomain(role),
      permissionCount: registry.rolePermissions[role]?.length ?? 0,
      alreadyAssigned: assignedRoleSet.has(role),
    }));
  const domainOptions = [
    "All domains",
    ...[...new Set(roleRows.map((row) => row.domain))].sort((first, second) =>
      first.localeCompare(second),
    ),
  ] as const;
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredRows = roleRows
    .filter((row) =>
      normalizedQuery
        ? [row.role, row.domain, String(row.permissionCount)].some((value) =>
            value.toLocaleLowerCase().includes(normalizedQuery),
          )
        : true,
    )
    .filter((row) => {
      if (statusFilter === "Available") return !row.alreadyAssigned;
      if (statusFilter === "Assigned") return row.alreadyAssigned;
      return true;
    })
    .filter((row) =>
      domainFilter === "All domains" ? true : row.domain === domainFilter,
    )
    .sort((first, second) => {
      if (sortOption === "Role Z-A") return second.role.localeCompare(first.role);
      if (sortOption === "Domain A-Z") {
        return (
          first.domain.localeCompare(second.domain) ||
          first.role.localeCompare(second.role)
        );
      }
      if (sortOption === "Available first") {
        return (
          Number(first.alreadyAssigned) - Number(second.alreadyAssigned) ||
          first.role.localeCompare(second.role)
        );
      }
      if (sortOption === "Assigned first") {
        return (
          Number(second.alreadyAssigned) - Number(first.alreadyAssigned) ||
          first.role.localeCompare(second.role)
        );
      }
      if (sortOption === "Most permissions") {
        return (
          second.permissionCount - first.permissionCount ||
          first.role.localeCompare(second.role)
        );
      }

      return first.role.localeCompare(second.role);
    });
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleRows = filteredRows.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  const columns: DataTableColumn<RolePickerRow>[] = [
    {
      id: "role",
      header: "Role",
      cell: (row) => (
        <span className="inline-flex rounded-[10px] border border-(--secondary-blue) bg-(--secondary-blue)/10 px-2 py-1 text-(--secondary-blue)">
          {row.role}
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
      id: "permissionCount",
      header: "Permissions",
      cell: (row) => `${row.permissionCount} permissions`,
      cellClassName: "text-(--primary-grey)",
    },
    {
      id: "status",
      header: "Status",
      cell: (row) => (
        <span
          className={`inline-flex rounded-[10px] border px-2 py-1 ${
            row.alreadyAssigned
              ? "border-(--primary-green)/40 bg-(--primary-green)/10 text-(--primary-green)"
              : "border-(--terciary-grey) bg-(--terciary-grey)/20 text-(--primary-grey)"
          }`}
        >
          {row.alreadyAssigned ? "Assigned" : "Available"}
        </span>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      headerClassName: "w-20 px-2",
      cellClassName: "px-2",
      cell: (row) => (
        <Button
          buttonText={row.alreadyAssigned ? "Added" : "Add"}
          icon={
            row.alreadyAssigned ? (
              <FontAwesomeIcon icon={["fas", "check"]} />
            ) : (
              <FontAwesomeIcon icon={["fas", "plus"]} />
            )
          }
          disabled={row.alreadyAssigned || isSaving}
          clickAction={() => onSelectRole(row.role)}
        />
      ),
    },
  ];

  return (
    <DataTable
      title="Role Picker"
      description={
        normalizedQuery
          ? `${filteredRows.length} of ${roleRows.length} roles`
          : `${roleRows.length} available roles`
      }
      search={{
        value: searchQuery,
        onChange: (value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        },
        placeholder: "Search role or domain",
      }}
      headerAside={
        <DataTableFilters
          filters={[
            {
              id: "status",
              options: STATUS_FILTERS,
              value: statusFilter,
              placeholder: "Status",
              dropdownSelectorDirection: "downwards",
              onChange: (value) => {
                setStatusFilter(value as StatusFilter);
                setCurrentPage(1);
              },
            },
            {
              id: "domain",
              options: domainOptions,
              value: domainFilter,
              placeholder: "Domain",
              dropdownSelectorDirection: "downwards",
              onChange: (value) => {
                setDomainFilter(String(value));
                setCurrentPage(1);
              },
            },
            {
              id: "sort",
              options: SORT_OPTIONS,
              value: sortOption,
              placeholder: "Sort",
              dropdownSelectorDirection: "downwards",
              onChange: (value) => {
                setSortOption(value as SortOption);
                setCurrentPage(1);
              },
            },
          ]}
        />
      }
      columns={columns}
      data={visibleRows}
      getRowId={(row) => row.id}
      minWidthClassName="min-w-200"
      pagination={{
        totalItems: filteredRows.length,
        currentPage,
        pageSize,
        onPageChange: setCurrentPage,
        onPageSizeChange: setPageSize,
        dataType: "roles",
      }}
      emptyState={
        <div className="grid min-h-40 place-items-center px-5 py-10 text-center">
          <div>
            <div className="text-style__body--bold text-(--primary-blue)">
              No roles found
            </div>
            <p className="mt-1 text-style__small-text text-(--primary-grey)">
              Try another role, domain, or status.
            </p>
          </div>
        </div>
      }
    />
  );
}
