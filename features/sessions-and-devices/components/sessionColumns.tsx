import type { DataTableColumn } from "@/global-components/ui/DataTable";
import StatusChip from "@/global-components/ui/StatusChip";

import { sessionStatusTone } from "../constants/sessions";
import type { SessionRow } from "../types/sessions.types";
import { formatTimestamp, initials } from "../utils/sessions";

export function createSessionColumns({
  canManageSessions,
  isMutating,
  onRevoke,
}: {
  canManageSessions: boolean;
  isMutating: boolean;
  onRevoke: (row: SessionRow) => Promise<void> | void;
}): DataTableColumn<SessionRow>[] {
  return [
    {
      id: "person",
      header: "PERSON",
      cell: (row) => (
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-(--secondary-blue)/10 text-style__small-text--bold text-(--secondary-blue)">
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
      cell: (row) => (
        <time dateTime={row.createdAt}>{formatTimestamp(row.createdAt)}</time>
      ),
    },
    {
      id: "expires",
      header: "EXPIRES",
      cell: (row) => (
        <time dateTime={row.expiresAt}>{formatTimestamp(row.expiresAt)}</time>
      ),
    },
    {
      id: "status",
      header: "STATUS",
      cell: (row) => (
        <StatusChip tone={sessionStatusTone[row.status]}>
          {row.status}
        </StatusChip>
      ),
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
            onClick={() => onRevoke(row)}
          >
            Revoke
          </button>
        ) : canManageSessions ? (
          "-"
        ) : null,
    },
  ];
}
