"use client";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import useEmployees from "@/features/employees/hooks/useEmployees";
import {
  getEmployeeSessions,
  revokeAllEmployeeSessions,
  revokeEmployeeSession,
} from "@/features/employees/services/employee";
import Button from "@/global-components/ui/Button";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import { getDateTimeFormatted } from "@/globals";
import Dotindicator from "@/global-components/ui/Dotindicator";
import { execute } from "@/lib";
import { useEffect, useState } from "react";

type SessionStatus = "Active" | "Expired" | "Revoked";

interface SessionDeviceRow {
  id: string;
  device: string;
  ipAddress: string;
  createdAt?: string;
  expiresAt?: string;
  status: SessionStatus;
}

const formatTimestamp = (value?: string) =>
  getDateTimeFormatted(value) || "Unknown";

export default function SessionsAndDevices() {
  const { state } = useEmployees();
  const [currentTime, setCurrentTime] = useState<number | null>(null);
  const employee = state.selectedEmployee;
  const employeeId = employee?.id;
  const activeSessions = state.employeeSessions;
  const isMutating = state.fetchingEmployeeData;

  useEffect(() => {
    setCurrentTime(Date.now());
  }, []);

  const refreshSessions = async () => {
    if (!employeeId) return;

    await execute(() => getEmployeeSessions(employeeId), {
      setLoading: state.setFetchingEmployeeData,
      setError: state.setFetchingEmployeeDataError,
      onSuccess: state.setEmployeeSessions,
    });
  };

  const revokeSession = (sessionId: string) => {
    if (!employeeId) return;

    execute(() => revokeEmployeeSession(employeeId, sessionId), {
      setLoading: state.setFetchingEmployeeData,
      setError: state.setFetchingEmployeeDataError,
      onSuccess: refreshSessions,
    });
  };

  const sessionsAndDevices: SessionDeviceRow[] = activeSessions.map(
    (session) => {
      const expiresAtMs = session.expiresAt
        ? new Date(session.expiresAt).getTime()
        : null;
      const isExpired =
        currentTime !== null && expiresAtMs !== null && expiresAtMs <= currentTime;

      return {
        id: session.id ?? session._id ?? "",
        device: session.userAgent || "Unknown device",
        ipAddress: session.ip || "Unknown IP",
        createdAt: session.createdAt,
        expiresAt: session.expiresAt,
        status: session.isRevoked ? "Revoked" : isExpired ? "Expired" : "Active",
      };
    },
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
      cell: (session) => (
        <button
          type="button"
          title={`Revoke session on ${session.device}`}
          aria-label={`Revoke session on ${session.device}`}
          disabled={session.status !== "Active" || isMutating}
          className="grid h-8 w-8 place-items-center rounded-[10px] text-(--primary-grey) duration-150 enabled:hover:bg-(--primary-red)/10 enabled:hover:text-(--primary-red) disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => revokeSession(session.id)}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </button>
      ),
    },
  ];

  return (
    <DataTable
      title="Sessions & Devices"
      description={`${sessionsAndDevices.length} ${sessionsAndDevices.length === 1 ? "session" : "sessions"}`}
      headerAside={
        <Button
          buttonText="Revoke All Sessions"
          icon={<FontAwesomeIcon icon={faTrashCan} />}
          buttonType="red"
          clickAction={() => {
            if (!employeeId) return;

            execute(() => revokeAllEmployeeSessions(employeeId), {
              setLoading: state.setFetchingEmployeeData,
              setError: state.setFetchingEmployeeDataError,
              onSuccess: refreshSessions,
            });
          }}
          disabled={
            isMutating ||
            !sessionsAndDevices.some((session) => session.status === "Active")
          }
        />
      }
      columns={sessionColumns}
      data={sessionsAndDevices}
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
