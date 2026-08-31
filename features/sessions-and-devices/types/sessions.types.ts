import type { User, UserSession } from "@/globals/types/user.type";

export type SessionFilter = "all" | "active" | "revoked" | "expired";

export type SessionStatus = "Active" | "Expired" | "Revoked";

export type SessionRow = {
  id: string;
  userId: string;
  person: Pick<User, "id" | "name" | "email" | "status">;
  device: string;
  ipAddress: string;
  createdAt?: string;
  expiresAt?: string;
  status: SessionStatus;
};

export interface SessionDeviceRow {
  id: string;
  device: string;
  ipAddress: string;
  createdAt?: string;
  expiresAt?: string;
  status: SessionStatus;
}

export type WorkforceSession = UserSession & {
  user: Pick<User, "id" | "name" | "email" | "username" | "status">;
};

export type WorkforceSessionPage = {
  sessions: WorkforceSession[];
  total: number;
  page: number;
  pageSize: number;
};
