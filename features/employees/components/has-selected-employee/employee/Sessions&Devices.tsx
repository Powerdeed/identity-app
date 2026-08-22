"use client";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { hasPermission, PERMISSIONS } from "@/app/auth";
import useEmployees from "@/features/employees/hooks/useEmployees";
import useEmployeeSessions from "@/features/employees/hooks/useEmployeeSessions";
import Button from "@/global-components/ui/Button";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import { getDateTimeFormatted, useGlobals } from "@/globals";
import Dotindicator from "@/global-components/ui/Dotindicator";
import type { SessionDeviceRow } from "@/features/employees/utils/sessions";

const formatTimestamp = (value?: string) =>
  getDateTimeFormatted(value) || "Unknown";

export default function SessionsAndDevices() {
  const { globalStates } = useGlobals();
  const { state } = useEmployees();
  const sessions = useEmployeeSessions();
  const employee = state.selectedEmployee;
  const canManageSessions = hasPermission(
    globalStates.user,
    PERMISSIONS.IDENTITY_SESSIONS_MANAGE,
  );

  if (!employee) return null;

  const sessionColumns: DataTableColumn<SessionDeviceRow>[] = [
    {
      id: "device",
      header: "Device / Browser",
      accessorKey: "device",
      cellClassName: "text-style__body--bold text-(--primary-blue)",
    },
    {
      id: "ipAddress",
      header: "IP Address",
      accessorKey: "ipAddress",
      cellClassName: "whitespace-nowrap text-(--primary-grey)",
    },
    {
      id: "createdAt",
      header: "Created",
      cellClassName: "whitespace-nowrap text-(--primary-grey)",
      cell: (session) => (
        <time dateTime={session.createdAt ?? undefined}>
          {formatTimestamp(session.createdAt)}
        </time>
      ),
    },
    {
      id: "expiresAt",
      header: "Expires",
      cellClassName: "whitespace-nowrap text-(--primary-grey)",
      cell: (session) => (
        <time dateTime={session.expiresAt ?? undefined}>
          {formatTimestamp(session.expiresAt)}
        </time>
      ),
    },
    {
      id: "status",
      header: "Status",
      cell: (session) => (
        <div className="flex items-center gap-1 ">
          <Dotindicator
            color={
              session.status === "Active"
                ? "bg-(--primary-green)"
                : "bg-(--primary-grey)"
            }
          />
          <div>{session.status}</div>
        </div>
      ),
    },
    {
      id: "actions",
      header: <span className="sr-only">Actions</span>,
      headerClassName: "w-12 px-2",
      cellClassName: "px-2",
      cell: (session) =>
        canManageSessions ? (
          <button
            type="button"
            title={`Revoke session on ${session.device}`}
            aria-label={`Revoke session on ${session.device}`}
            disabled={session.status !== "Active" || sessions.isMutating}
            className="grid h-8 w-8 place-items-center rounded-[10px] text-(--primary-grey) duration-150 enabled:hover:bg-(--primary-red)/10 enabled:hover:text-(--primary-red) disabled:cursor-not-allowed disabled:opacity-40"
            onClick={() => sessions.revoke(session.id)}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </button>
        ) : null,
    },
  ];

  return (
    <DataTable
      title="Sessions & Devices"
      description={`${sessions.rows.length} ${sessions.rows.length === 1 ? "session" : "sessions"}`}
      headerAside={
        canManageSessions ? (
          <Button
            buttonText="Revoke All Sessions"
            icon={<FontAwesomeIcon icon={faTrashCan} />}
            buttonType="red"
            clickAction={sessions.revokeAll}
            disabled={
              sessions.isMutating ||
              !sessions.rows.some((session) => session.status === "Active")
            }
          />
        ) : null
      }
      columns={sessionColumns}
      data={sessions.rows}
      getRowId={(session) => session.id}
      minWidthClassName="min-w-180"
      emptyState={
        <div className="grid min-h-40 place-items-center px-5 py-10 text-center">
          <div>
            <div className="text-style__body--bold text-(--primary-blue)">
              No sessions or devices
            </div>
            <p className="mt-1 text-style__small-text text-(--primary-grey)">
              Active login sessions will appear here.
            </p>
          </div>
        </div>
      }
    />
  );
}
