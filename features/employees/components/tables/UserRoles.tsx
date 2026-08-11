"use client";

import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import { getDateFormatted } from "@/globals";

interface PowerdeedRoleRow {
  id: string;
  role: string;
  scope: string;
  assignedAt: string;
  expiresAt?: string | null;
}

// TODO: Create a function to get this data
const roles: PowerdeedRoleRow[] = [
  {
    id: "finance-analyst-global",
    role: "finance:analyst",
    scope: "global",
    assignedAt: "2024-01-15",
    expiresAt: null,
  },
];

const formatDate = (value?: string | null) =>
  value ? getDateFormatted(value) || "-" : "-";

const roleColumns: DataTableColumn<PowerdeedRoleRow>[] = [
  {
    id: "role",
    header: "Role",
    cell: (role) => (
      <span className="inline-flex rounded-[10px] border border-(--secondary-blue) bg-(--secondary-blue)/10 px-2 py-1 text-(--secondary-blue)">
        {role.role}
      </span>
    ),
  },
  {
    id: "scope",
    header: "Scope",
    accessorKey: "scope",
    cellClassName: "text-(--primary-blue)",
  },
  {
    id: "assignedAt",
    header: "Assigned",
    cellClassName: "whitespace-nowrap text-(--primary-grey)",
    cell: (role) => formatDate(role.assignedAt),
  },
  {
    id: "expiresAt",
    header: "Expiry",
    cellClassName: "whitespace-nowrap text-(--primary-grey)",
    cell: (role) => formatDate(role.expiresAt),
  },
  {
    id: "actions",
    header: <span className="sr-only">Actions</span>,
    headerClassName: "w-12 px-2",
    cellClassName: "px-2",
    cell: (role) => (
      <button
        type="button"
        title={`Remove ${role.role}`}
        aria-label={`Remove ${role.role}`}
        className="grid h-8 w-8 place-items-center rounded-[10px] text-(--primary-grey) duration-150 hover:bg-(--primary-red)/10 hover:text-(--primary-red)"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    ),
  },
];

export default function Roles() {
  return (
    <DataTable
      title="Powerdeed Roles"
      description={`${roles.length} assigned ${roles.length === 1 ? "role" : "roles"}`}
      headerAside={
        <Button
          buttonText="Assign Role"
          icon={<FontAwesomeIcon icon={faPlus} />}
        />
      }
      columns={roleColumns}
      data={roles}
      getRowId={(role) => role.id}
      minWidthClassName="min-w-180"
      emptyState={
        <div className="grid min-h-40 place-items-center px-5 py-10 text-center">
          <div>
            <div className="text-style__body--bold text-(--primary-blue)">
              No Powerdeed roles assigned
            </div>
            <p className="mt-1 text-style__small-text text-(--primary-grey)">
              Assign a role to grant application access.
            </p>
          </div>
        </div>
      }
    />
  );
}
