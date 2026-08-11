"use client";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import { getDateTimeFormatted } from "@/globals";
import Dotindicator from "@/global-components/ui/Dotindicator";

type SessionStatus = "Active" | "Expired" | "Revoked";

interface SessionDeviceRow {
  id: string;
  device: string;
  ipAddress: string;
  createdAt: string;
  expiresAt: string;
  status: SessionStatus;
}

// TODO: Create a function to get this data
const sessionsAndDevices: SessionDeviceRow[] = [
  {
    id: "chrome-windows-41-90-64-5",
    device: "Chrome 124 / Windows 11",
    ipAddress: "41.90.64.5",
    createdAt: "2024-05-28T08:00:00+03:00",
    expiresAt: "2024-05-28T20:00:00+03:00",
    status: "Active",
  },
];

const formatTimestamp = (value: string) =>
  getDateTimeFormatted(value) || "Unknown";

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
      <time dateTime={session.createdAt}>
        {formatTimestamp(session.createdAt)}
      </time>
    ),
  },
  {
    id: "expiresAt",
    header: "Expires",
    cellClassName: "whitespace-nowrap text-(--primary-grey)",
    cell: (session) => (
      <time dateTime={session.expiresAt}>
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
        disabled={session.status !== "Active"}
        className="grid h-8 w-8 place-items-center rounded-[10px] text-(--primary-grey) duration-150 enabled:hover:bg-(--primary-red)/10 enabled:hover:text-(--primary-red) disabled:cursor-not-allowed disabled:opacity-40"
      >
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    ),
  },
];

export default function SessionsAndDevices() {
  return (
    <DataTable
      title="Sessions & Devices"
      description={`${sessionsAndDevices.length} ${sessionsAndDevices.length === 1 ? "session" : "sessions"}`}
      headerAside={
        <Button
          buttonText="Revoke All Sessions"
          icon={<FontAwesomeIcon icon={faTrashCan} />}
          buttonType="red"
          disabled={
            !sessionsAndDevices.some((session) => session.status === "Active")
          }
          clickAction={() => {}} // TODO Add functionality
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
