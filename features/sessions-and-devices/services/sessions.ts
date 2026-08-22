import type { User, UserSession } from "@/app/auth";
import { identityApiRequest } from "@/lib/api/identityApiRequest";

export type WorkforceSession = UserSession & {
  user: Pick<User, "id" | "name" | "email" | "username" | "status">;
};

export type WorkforceSessionPage = {
  sessions: WorkforceSession[];
  total: number;
  page: number;
  pageSize: number;
};

export const getWorkforceSessions = (params: {
  search?: string;
  status?: "active" | "expired" | "revoked";
  page?: number;
  pageSize?: number;
}) =>
  identityApiRequest<WorkforceSessionPage>({
    method: "GET",
    url: "/admin/sessions",
    params,
  });

export const revokeWorkforceSession = (userId: string, sessionId: string) =>
  identityApiRequest<{ message: string }>({
    method: "POST",
    url: `/admin/users/${userId}/sessions/${sessionId}/revoke`,
  });
