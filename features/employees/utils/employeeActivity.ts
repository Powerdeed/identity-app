import type { AuditEvent } from "../types/audit.types";
import type {
  UserActivityCategory,
  UserActivityRow,
} from "../components/tables/UserActivities";

export function toActivityCategory(
  eventType: string,
): UserActivityCategory {
  if (eventType.includes("status")) return "Lifecycle";
  if (eventType.includes("session")) return "Session";
  if (eventType.includes("keycloak")) return "Keycloak";
  return "Access";
}

export function toActivityRow(activity: AuditEvent): UserActivityRow {
  return {
    id: activity.id,
    event: activity.eventType,
    category: toActivityCategory(activity.eventType),
    actor: activity.actor?.username ?? activity.actor?.email ?? "System",
    ipAddress: activity.ip ?? "-",
    timestamp: activity.occurredAt,
    reason: activity.reason,
  };
}

export function isActivityWithinRange(
  activity: UserActivityRow,
  startDate: Date | null,
  endDate: Date | null,
) {
  const eventDate = new Date(activity.timestamp);
  const endOfSelectedDay = endDate
    ? new Date(
        endDate.getFullYear(),
        endDate.getMonth(),
        endDate.getDate(),
        23,
        59,
        59,
        999,
      )
    : null;

  return (
    (!startDate || eventDate >= startDate) &&
    (!endOfSelectedDay || eventDate <= endOfSelectedDay)
  );
}
