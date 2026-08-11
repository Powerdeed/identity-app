"use client";

import { getDateTimeFormatted } from "@/globals";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";

export type UserActivityCategory =
  | "Lifecycle"
  | "Access"
  | "Session"
  | "Keycloak";

export interface UserActivityRow {
  id: string;
  event: string;
  category: UserActivityCategory;
  actor: string;
  ipAddress: string;
  timestamp: string;
  reason?: string | null;
}

const activityColumns: DataTableColumn<UserActivityRow>[] = [
  {
    id: "event",
    header: "Event",
    cell: (activity) => (
      <span className="inline-flex rounded-[10px] border border-(--secondary-blue) bg-(--secondary-blue)/10 px-2 py-1 text-(--secondary-blue)">
        {activity.event}
      </span>
    ),
  },
  {
    id: "category",
    header: "Category",
    cell: (activity) => (
      <span className="inline-flex rounded-[10px] border border-(--terciary-grey) bg-(--terciary-grey)/20 px-2 py-1 text-(--primary-blue)">
        {activity.category}
      </span>
    ),
  },
  {
    id: "actor",
    header: "Actor",
    accessorKey: "actor",
    cellClassName: "text-(--primary-blue)",
  },
  {
    id: "ipAddress",
    header: "IP",
    accessorKey: "ipAddress",
    cellClassName: "whitespace-nowrap text-(--primary-grey)",
  },
  {
    id: "timestamp",
    header: "Timestamp",
    cellClassName: "whitespace-nowrap text-(--primary-grey)",
    cell: (activity) => (
      <time dateTime={activity.timestamp}>
        {getDateTimeFormatted(activity.timestamp) || "-"}
      </time>
    ),
  },
  {
    id: "reason",
    header: "Reason",
    accessorKey: "reason",
    cellClassName: "max-w-70 text-(--primary-grey)",
  },
];

export default function UserActivities({
  activities,
  representative = false,
}: {
  activities: UserActivityRow[];
  representative?: boolean;
}) {
  return (
    <DataTable
      title="Activity history"
      description={`${activities.length} ${activities.length === 1 ? "event" : "events"}`}
      headerAside={
        representative ? (
          <div className="flex items-center gap-2 text-style__small-text text-(--primary-grey)">
            <span className="h-2 w-2 rounded-full bg-(--primary-yellow)" />
            Representative data
          </div>
        ) : null
      }
      columns={activityColumns}
      data={activities}
      getRowId={(activity) => activity.id}
      minWidthClassName="min-w-240"
      emptyState={
        <div className="grid min-h-40 place-items-center px-5 py-10 text-center">
          <div>
            <div className="text-style__body--bold text-(--primary-blue)">
              No activity found
            </div>
            <p className="mt-1 text-style__small-text text-(--primary-grey)">
              Adjust the category or date range to view more events.
            </p>
          </div>
        </div>
      }
    />
  );
}
