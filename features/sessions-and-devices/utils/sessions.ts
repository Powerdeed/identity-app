import { getDateTimeFormatted } from "@/globals";

import type { WorkforceSession } from "../types/sessions.types";
import type { SessionDeviceRow, SessionRow } from "../types/sessions.types";
import type { UserSession } from "@/globals/types/user.type";

export function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatTimestamp(value?: string) {
  return getDateTimeFormatted(value) || "-";
}

export function toSessionRow(session: WorkforceSession): SessionRow {
  const sessionRow = toSessionDeviceRow(session, Date.now());

  return {
    ...sessionRow,
    userId: session.user.id,
    person: session.user,
  };
}

export function toSessionDeviceRow(
  session: UserSession,
  currentTime: number,
): SessionDeviceRow {
  const expiresAt = session.expiresAt
    ? new Date(session.expiresAt).getTime()
    : null;
  const isExpired = expiresAt !== null && expiresAt <= currentTime;

  return {
    id: session.id ?? session._id ?? "",
    device: session.userAgent || "Unknown device",
    ipAddress: session.ip || "Unknown IP",
    createdAt: session.createdAt,
    expiresAt: session.expiresAt,
    status: session.isRevoked ? "Revoked" : isExpired ? "Expired" : "Active",
  };
}
