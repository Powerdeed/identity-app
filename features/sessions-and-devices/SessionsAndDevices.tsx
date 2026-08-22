"use client";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";

import { hasPermission, PERMISSIONS, type User } from "@/app/auth";
import { toSessionDeviceRow } from "@/features/employees/utils/sessions";
import Button from "@/global-components/ui/Button";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import EmptyState from "@/global-components/ui/EmptyState";
import Notice from "@/global-components/ui/Notice";
import StatusChip from "@/global-components/ui/StatusChip";
import { SectionTitle } from "@/global-components/ui/Title";
import { getDateTimeFormatted, useGlobals } from "@/globals";
import {
  getWorkforceSessions,
  revokeWorkforceSession,
  type WorkforceSession,
} from "./services/sessions";

type SessionFilter = "all" | "active" | "revoked" | "expired";

type SessionRow = {
  id: string;
  userId: string;
  person: Pick<User, "id" | "name" | "email" | "status">;
  device: string;
  ipAddress: string;
  createdAt?: string;
  expiresAt?: string;
  status: "Active" | "Expired" | "Revoked";
};

const statusTone = {
  Active: "green",
  Expired: "grey",
  Revoked: "red",
} as const;

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatTimestamp(value?: string) {
  return getDateTimeFormatted(value) || "-";
}

function toRow(session: WorkforceSession): SessionRow {
  const sessionRow = toSessionDeviceRow(session, Date.now());
  return {
    ...sessionRow,
    userId: session.user.id,
    person: session.user,
  };
}

export default function SessionsAndDevices() {
  const { globalStates } = useGlobals();
  const [sessions, setSessions] = useState<WorkforceSession[]>([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<SessionFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isMutating, setIsMutating] = useState(false);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const timeout = window.setTimeout(() => setPage(1), 250);
    return () => window.clearTimeout(timeout);
  }, [search, status]);

  useEffect(() => {
    let isMounted = true;

    async function loadSessions() {
      setIsLoading(true);
      setError(undefined);
      try {
        const response = await getWorkforceSessions({
          search: search || undefined,
          status: status === "all" ? undefined : status,
          page,
          pageSize,
        });
        if (!isMounted) return;
        setSessions(response.sessions);
        setTotal(response.total);
      } catch (loadError) {
        if (!isMounted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load workforce sessions.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadSessions();

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, search, status]);

  const rows = useMemo(() => sessions.map(toRow), [sessions]);
  const canManageSessions = hasPermission(
    globalStates.user,
    PERMISSIONS.IDENTITY_SESSIONS_MANAGE,
  );

  const activeCount = rows.filter((row) => row.status === "Active").length;

  async function revoke(row: SessionRow) {
    setIsMutating(true);
    setError(undefined);
    try {
      await revokeWorkforceSession(row.userId, row.id);
      const response = await getWorkforceSessions({
        search: search || undefined,
        status: status === "all" ? undefined : status,
        page,
        pageSize,
      });
      setSessions(response.sessions);
      setTotal(response.total);
    } catch (mutationError) {
      setError(
        mutationError instanceof Error
          ? mutationError.message
          : "Unable to revoke session.",
      );
    } finally {
      setIsMutating(false);
    }
  }

  const columns: DataTableColumn<SessionRow>[] = [
    {
      id: "person",
      header: "PERSON",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-[8px] bg-(--secondary-blue)/10 text-style__small-text--bold text-(--secondary-blue)">
            {initials(row.person.name)}
          </div>
          <div>
            <div className="text-style__small-text--bold text-(--primary-blue)">
              {row.person.name}
            </div>
            <div className="text-(--primary-grey)">{row.person.email}</div>
          </div>
        </div>
      ),
    },
    {
      id: "device",
      header: "DEVICE / BROWSER",
      accessorKey: "device",
      cellClassName: "text-style__small-text--bold text-(--primary-blue)",
    },
    { id: "ip", header: "IP ADDRESS", accessorKey: "ipAddress" },
    {
      id: "created",
      header: "CREATED",
      cell: (row) => <time dateTime={row.createdAt}>{formatTimestamp(row.createdAt)}</time>,
    },
    {
      id: "expires",
      header: "EXPIRES",
      cell: (row) => <time dateTime={row.expiresAt}>{formatTimestamp(row.expiresAt)}</time>,
    },
    {
      id: "status",
      header: "STATUS",
      cell: (row) => <StatusChip tone={statusTone[row.status]}>{row.status}</StatusChip>,
    },
    {
      id: "actions",
      header: "",
      cellClassName: "w-20",
      cell: (row) =>
        row.status === "Active" && canManageSessions ? (
          <button
            type="button"
            title="Revoke session"
            aria-label={`Revoke session for ${row.person.name}`}
            disabled={isMutating}
            className="buttonize text-style__small-text--bold text-(--primary-red) disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => revoke(row)}
          >
            Revoke
          </button>
        ) : canManageSessions ? (
          "-"
        ) : null,
    },
  ];

  return (
    <div className="uniform-page-display min-w-0 text-style__body">
      <SectionTitle
        title="Sessions & Devices"
        subtitle="Active, revoked, and expired sessions across the workforce"
      />

      {error ? <Notice tone="danger">{error}</Notice> : null}

      <DataTable
        title="Workforce Sessions"
        description={
          isLoading
            ? "Loading sessions..."
            : `${total} session${total === 1 ? "" : "s"} found`
        }
        headerAside={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="text-style__small-text text-(--primary-grey)">
              <span className="text-(--primary-yellow)">●</span> Future signal:
              unfamiliar device and location risk can be added here.
            </div>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as SessionFilter)}
              className="rounded-[8px] border border-(--terciary-grey) bg-white px-3 py-2 text-style__small-text"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="revoked">Revoked</option>
              <option value="expired">Expired</option>
            </select>
          </div>
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search person, email, or IP",
        }}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        minWidthClassName="min-w-260"
        emptyState={
          <EmptyState
            icon="tv"
            title="No sessions found"
            description="Sessions will appear after users sign in through Keycloak and identity-service creates session records."
          />
        }
        pagination={{
          totalItems: total,
          currentPage: page,
          pageSize,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          dataType: "sessions",
        }}
      />

      {canManageSessions && activeCount > 0 ? (
        <div className="flex justify-end">
          <Button
            buttonText={`${activeCount} active on this page`}
            buttonType="light"
            disabled
            icon={<FontAwesomeIcon icon={faTrashCan} />}
          />
        </div>
      ) : null}
    </div>
  );
}
