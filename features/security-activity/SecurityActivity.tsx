"use client";

import { useEffect, useMemo, useState } from "react";

import type { AuditEvent } from "@/features/employees/types/audit.types";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import EmptyState from "@/global-components/ui/EmptyState";
import MetricCard from "@/global-components/ui/MetricCard";
import Notice from "@/global-components/ui/Notice";
import StatusChip from "@/global-components/ui/StatusChip";
import { SectionTitle } from "@/global-components/ui/Title";
import { getDateTimeFormatted } from "@/globals";
import { getAuditEvents } from "./services/auditEvents";

type ActivityCategory =
  | "All categories"
  | "Lifecycle"
  | "Access"
  | "Session"
  | "Keycloak";

type ActivityRow = {
  id: string;
  event: string;
  category: Exclude<ActivityCategory, "All categories">;
  actor: string;
  target: string;
  ip: string;
  occurredAt: string;
  reason: string;
};

const categories: ActivityCategory[] = [
  "All categories",
  "Lifecycle",
  "Access",
  "Session",
  "Keycloak",
];

const categoryQueryValue: Record<
  Exclude<ActivityCategory, "All categories">,
  "lifecycle" | "access" | "session" | "keycloak"
> = {
  Lifecycle: "lifecycle",
  Access: "access",
  Session: "session",
  Keycloak: "keycloak",
};

const categoryTone = {
  Lifecycle: "blue",
  Access: "yellow",
  Session: "green",
  Keycloak: "purple",
} as const;

function getCategory(eventType: string): ActivityRow["category"] {
  if (eventType.includes("keycloak")) return "Keycloak";
  if (eventType.includes("session")) return "Session";
  if (
    eventType.includes("role") ||
    eventType.includes("permission") ||
    eventType.includes("access_review") ||
    eventType.includes("access")
  ) {
    return "Access";
  }
  return "Lifecycle";
}

function actorName(event: AuditEvent) {
  return event.actor?.username || event.actor?.name || event.actorUserId || "system";
}

function targetName(event: AuditEvent) {
  return event.target?.username || event.target?.name || event.targetUserId || "-";
}

function isWithinLastThirtyDays(event: AuditEvent) {
  const time = new Date(event.occurredAt).getTime();
  if (Number.isNaN(time)) return false;
  return Date.now() - time <= 30 * 24 * 60 * 60 * 1000;
}

export default function SecurityActivity() {
  const [events, setEvents] = useState<AuditEvent[]>([]);
  const [category, setCategory] = useState<ActivityCategory>("All categories");
  const [actorFilter, setActorFilter] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [occurredFrom, setOccurredFrom] = useState("");
  const [occurredTo, setOccurredTo] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(actorFilter.trim());
      setPage(1);
    }, 250);
    return () => window.clearTimeout(timeout);
  }, [actorFilter]);

  useEffect(() => {
    let isMounted = true;

    async function loadAuditEvents() {
      setIsLoading(true);
      setError(undefined);
      try {
        const response = await getAuditEvents({
          search: debouncedSearch || undefined,
          category:
            category === "All categories"
              ? undefined
              : categoryQueryValue[category],
          occurredFrom: occurredFrom || undefined,
          occurredTo: occurredTo || undefined,
          page,
          pageSize,
        });
        if (!isMounted) return;
        setEvents(response.events);
        setTotal(response.total);
      } catch (loadError) {
        if (!isMounted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load audit events.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadAuditEvents();

    return () => {
      isMounted = false;
    };
  }, [category, debouncedSearch, occurredFrom, occurredTo, page, pageSize]);

  const rows = useMemo<ActivityRow[]>(
    () =>
      events.map((event) => ({
        id: event.id,
        event: event.eventType,
        category: getCategory(event.eventType),
        actor: actorName(event),
        target: targetName(event),
        ip: event.ip || "-",
        occurredAt: event.occurredAt,
        reason: event.reason || "-",
      })),
    [events],
  );

  const recentEvents = events.filter(isWithinLastThirtyDays);
  const metricCounts = {
    lifecycle: recentEvents.filter(
      (event) => getCategory(event.eventType) === "Lifecycle",
    ).length,
    access: recentEvents.filter((event) => getCategory(event.eventType) === "Access").length,
    sessions: recentEvents.filter((event) => getCategory(event.eventType) === "Session").length,
    keycloak: recentEvents.filter((event) => getCategory(event.eventType) === "Keycloak").length,
  };

  const columns: DataTableColumn<ActivityRow>[] = [
    {
      id: "event",
      header: "EVENT",
      cell: (row) => <StatusChip tone="blue">{row.event}</StatusChip>,
    },
    {
      id: "category",
      header: "CATEGORY",
      cell: (row) => (
        <StatusChip tone={categoryTone[row.category]}>{row.category}</StatusChip>
      ),
    },
    { id: "actor", header: "ACTOR", accessorKey: "actor" },
    { id: "target", header: "TARGET", accessorKey: "target" },
    { id: "ip", header: "IP", accessorKey: "ip" },
    {
      id: "timestamp",
      header: "TIMESTAMP",
      cell: (row) => (
        <time dateTime={row.occurredAt}>
          {getDateTimeFormatted(row.occurredAt) || "-"}
        </time>
      ),
    },
    { id: "reason", header: "REASON", accessorKey: "reason" },
  ];

  return (
    <div className="uniform-page-display min-w-0 text-style__body">
      <SectionTitle
        title="Security Activity"
        subtitle="Identity and access event log from immutable audit records"
      />

      <div className="grid gap-2.5 md:grid-cols-4">
        <MetricCard
          label="Lifecycle changes"
          value={metricCounts.lifecycle}
          description="Loaded page, last 30 days"
        />
        <MetricCard
          label="Access changes"
          value={metricCounts.access}
          description="Loaded page, last 30 days"
          tone="blue"
        />
        <MetricCard
          label="Session events"
          value={metricCounts.sessions}
          description="Loaded page, last 30 days"
          tone="green"
        />
        <MetricCard
          label="Keycloak changes"
          value={metricCounts.keycloak}
          description="Loaded page, last 30 days"
          tone="yellow"
        />
      </div>

      {error ? <Notice tone="danger">{error}</Notice> : null}

      <DataTable
        title="Activity History"
        description={
          isLoading
            ? "Loading audit events..."
            : `${rows.length} visible on this page, ${total} total event${total === 1 ? "" : "s"}`
        }
        headerAside={
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={category}
              onChange={(event) => {
                setCategory(event.target.value as ActivityCategory);
                setPage(1);
              }}
              className="rounded-[8px] border border-(--terciary-grey) bg-white px-3 py-2 text-style__small-text"
            >
              {categories.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={occurredFrom}
              onChange={(event) => {
                setOccurredFrom(event.target.value);
                setPage(1);
              }}
              className="rounded-[8px] border border-(--terciary-grey) bg-white px-3 py-2 text-style__small-text"
              aria-label="Audit events from date"
            />
            <input
              type="date"
              value={occurredTo}
              onChange={(event) => {
                setOccurredTo(event.target.value);
                setPage(1);
              }}
              className="rounded-[8px] border border-(--terciary-grey) bg-white px-3 py-2 text-style__small-text"
              aria-label="Audit events to date"
            />
          </div>
        }
        search={{
          value: actorFilter,
          onChange: setActorFilter,
          placeholder: "Search event, actor, target, reason, or IP",
        }}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        minWidthClassName="min-w-260"
        emptyState={
          <EmptyState
            icon="file-lines"
            title="No audit events found"
            description="Identity lifecycle, session, Keycloak, and access events will appear here."
          />
        }
        pagination={{
          totalItems: total,
          currentPage: page,
          pageSize,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          dataType: "events",
        }}
      />
    </div>
  );
}
