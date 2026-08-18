import type { UserSession } from "@/app/auth";

export type SessionStatus = "Active" | "Expired" | "Revoked";

export interface SessionDeviceRow {
  id: string;
  device: string;
  ipAddress: string;
  createdAt?: string;
  expiresAt?: string;
  status: SessionStatus;
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
