"use client";

import { faPlus, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";

interface PermissionExceptionRow {
  id: string;
  permission: string;
  domain: string;
  source: string;
}

// TODO: Create a function to get this data
const permissionExceptions: PermissionExceptionRow[] = [
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

const exceptionColumns: DataTableColumn<PermissionExceptionRow>[] = [
  {
    id: "permission",
    header: "Permission",
    cell: (exception) => (
      <span className="inline-flex rounded-[10px] border border-(--primary-red)/30 bg-(--primary-red)/10 px-2 py-1 text-(--primary-red)">
        {exception.permission}
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
  {
    id: "actions",
    header: <span className="sr-only">Actions</span>,
    headerClassName: "w-12 px-2",
    cellClassName: "px-2",
    cell: (exception) => (
      <button
        type="button"
        title={`Remove ${exception.permission} exception`}
        aria-label={`Remove ${exception.permission} exception`}
        className="grid h-8 w-8 place-items-center rounded-[10px] text-(--primary-grey) duration-150 hover:bg-(--primary-red)/10 hover:text-(--primary-red)"
      >
        <FontAwesomeIcon icon={faXmark} />
      </button>
    ),
  },
];

export default function UserPermissionExceptions() {
  return (
    <DataTable
      title="Direct Permission Exceptions"
      description={`${permissionExceptions.length} direct ${permissionExceptions.length === 1 ? "exception" : "exceptions"}`}
      headerAside={
        <Button
          buttonText="Add Exception"
          icon={<FontAwesomeIcon icon={faPlus} />}
        />
      }
      columns={exceptionColumns}
      data={permissionExceptions}
      getRowId={(exception) => exception.id}
      minWidthClassName="min-w-160"
      emptyState={
        <div className="grid min-h-40 place-items-center px-5 py-10 text-center">
          <div>
            <div className="text-style__body--bold text-(--primary-blue)">
              No direct permission exceptions
            </div>
            <p className="mt-1 text-style__small-text text-(--primary-grey)">
              Direct grants or restrictions will appear here.
            </p>
          </div>
        </div>
      }
    />
  );
}
