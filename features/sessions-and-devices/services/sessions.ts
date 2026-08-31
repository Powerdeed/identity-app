import { apiRequest } from "@lib";
import { WorkforceSessionPage } from "../types/sessions.types";

export const getWorkforceSessions = (params: {
  search?: string;
  status?: "active" | "expired" | "revoked";
  page?: number;
  pageSize?: number;
}) =>
  apiRequest<WorkforceSessionPage>({
    method: "GET",
    url: "/admin/sessions",
    params,
  });

export const revokeWorkforceSession = (userId: string, sessionId: string) =>
  apiRequest<{ message: string }>({
    method: "POST",
    url: `/admin/users/${userId}/sessions/${sessionId}/revoke`,
  });
