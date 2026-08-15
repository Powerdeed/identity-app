"use client";

import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import DataTableFilters from "@/global-components/ui/DataTableFilters";
import type { AccessRegistry } from "../../services/permissions";

interface PermissionPickerRow {
  id: string;
  permission: string;
  domain: string;
  sourceRoles: string[];
  alreadyAssigned: boolean;
}

const getPermissionDomain = (permission: string) =>
  permission.split(/[.:]/)[0] || "general";

const STATUS_FILTERS = ["All statuses", "Available", "Assigned"] as const;
const SOURCE_FILTERS = [
  "All sources",
  "Has source role",
  "Direct permission only",
] as const;
const SORT_OPTIONS = [
  "Permission A-Z",
  "Permission Z-A",
  "Domain A-Z",
  "Available first",
  "Assigned first",
  "Most source roles",
] as const;

type StatusFilter = (typeof STATUS_FILTERS)[number];
type SourceFilter = (typeof SOURCE_FILTERS)[number];
type SortOption = (typeof SORT_OPTIONS)[number];

const buildPermissionRows = (
  registry: AccessRegistry,
  assignedPermissions: string[],
): PermissionPickerRow[] => {
  const assignedPermissionSet = new Set(assignedPermissions);
  const permissionToRoles = Object.entries(registry.rolePermissions).reduce<
    Record<string, string[]>
  >((sources, [role, permissions]) => {
    permissions.forEach((permission) => {
      sources[permission] = [...new Set([...(sources[permission] ?? []), role])];
    });

    return sources;
  }, {});

  return [...new Set(Object.values(registry.permissions))]
    .sort((first, second) => first.localeCompare(second))
    .map((permission) => ({
      id: permission,
      permission,
      domain: getPermissionDomain(permission),
      sourceRoles: permissionToRoles[permission] ?? [],
      alreadyAssigned: assignedPermissionSet.has(permission),
    }));
};

export default function PermissionPicker({
  registry,
  assignedPermissions,
  effectivePermissions = [],
  onSelectPermission,
  isSaving,
}: {
  registry: AccessRegistry;
  assignedPermissions: string[];
  effectivePermissions?: string[];
  onSelectPermission: (permission: string) => void;
  isSaving?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All statuses");
  const [domainFilter, setDomainFilter] = useState("All domains");
  const [sourceFilter, setSourceFilter] =
    useState<SourceFilter>("All sources");
  const [sortOption, setSortOption] = useState<SortOption>("Permission A-Z");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const permissionRows = buildPermissionRows(registry, [
    ...assignedPermissions,
    ...effectivePermissions,
  ]);
  const domainOptions = [
    "All domains",
    ...[...new Set(permissionRows.map((row) => row.domain))].sort((first, second) =>
      first.localeCompare(second),
    ),
  ] as const;
  const normalizedQuery = searchQuery.trim().toLocaleLowerCase();
  const filteredRows = permissionRows
    .filter((row) =>
      normalizedQuery
        ? [
            row.permission,
            row.domain,
            row.sourceRoles.join(" "),
            row.alreadyAssigned ? "assigned" : "available",
          ].some((value) => value.toLocaleLowerCase().includes(normalizedQuery))
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
    .filter((row) => {
      if (sourceFilter === "Has source role") return row.sourceRoles.length > 0;
      if (sourceFilter === "Direct permission only") {
        return row.sourceRoles.length === 0;
      }
      return true;
    })
    .sort((first, second) => {
      if (sortOption === "Permission Z-A") {
        return second.permission.localeCompare(first.permission);
      }
      if (sortOption === "Domain A-Z") {
        return (
          first.domain.localeCompare(second.domain) ||
          first.permission.localeCompare(second.permission)
        );
      }
      if (sortOption === "Available first") {
        return (
          Number(first.alreadyAssigned) - Number(second.alreadyAssigned) ||
          first.permission.localeCompare(second.permission)
        );
      }
      if (sortOption === "Assigned first") {
        return (
          Number(second.alreadyAssigned) - Number(first.alreadyAssigned) ||
          first.permission.localeCompare(second.permission)
        );
      }
      if (sortOption === "Most source roles") {
        return (
          second.sourceRoles.length - first.sourceRoles.length ||
          first.permission.localeCompare(second.permission)
        );
      }

      return first.permission.localeCompare(second.permission);
    });
  const totalPages = Math.ceil(filteredRows.length / pageSize) || 1;
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const visibleRows = filteredRows.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize,
  );

  const columns: DataTableColumn<PermissionPickerRow>[] = [
    {
      id: "permission",
      header: "Permission",
      cell: (row) => (
        <span className="inline-flex rounded-[10px] border border-(--secondary-blue) bg-(--secondary-blue)/10 px-2 py-1 text-(--secondary-blue)">
          {row.permission}
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
      id: "sourceRoles",
      header: "Source roles",
      cellClassName: "max-w-110 text-(--primary-grey)",
      cell: (row) =>
        row.sourceRoles.length ? (
          <div className="flex flex-wrap gap-1.5">
            {row.sourceRoles.slice(0, 4).map((role) => (
              <span
                key={role}
                className="rounded-[10px] border border-(--terciary-grey) bg-(--terciary-grey)/20 px-2 py-1"
              >
                {role}
              </span>
            ))}
            {row.sourceRoles.length > 4 ? (
              <span className="rounded-[10px] px-2 py-1 text-(--primary-grey)">
                +{row.sourceRoles.length - 4} more
              </span>
            ) : null}
          </div>
        ) : (
          "Direct permission only"
        ),
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
          clickAction={() => onSelectPermission(row.permission)}
        />
      ),
    },
  ];

  return (
    <DataTable
      title="Permission Picker"
      description={
        normalizedQuery
          ? `${filteredRows.length} of ${permissionRows.length} permissions`
          : `${permissionRows.length} available permissions`
      }
      search={{
        value: searchQuery,
        onChange: (value) => {
          setSearchQuery(value);
          setCurrentPage(1);
        },
        placeholder: "Search permission, domain, or source role",
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
              id: "source",
              options: SOURCE_FILTERS,
              value: sourceFilter,
              placeholder: "Source",
              dropdownSelectorDirection: "downwards",
              onChange: (value) => {
                setSourceFilter(value as SourceFilter);
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
      minWidthClassName="min-w-240"
      pagination={{
        totalItems: filteredRows.length,
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
              No permissions found
            </div>
            <p className="mt-1 text-style__small-text text-(--primary-grey)">
              Try another permission, role, or domain.
            </p>
          </div>
        </div>
      }
    />
  );
}
