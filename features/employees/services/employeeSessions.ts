import type { UserSession } from "@/globals/types/user.type";
import { apiRequest } from "@lib";

export async function getEmployeeSessions(
  employeeId: string,
): Promise<UserSession[]> {
  const response = await apiRequest<{ sessions: UserSession[] }>({
    method: "GET",
    url: `/admin/users/${employeeId}/sessions`,
  });
  return response.sessions;
}

export const revokeEmployeeSession = (employeeId: string, sessionId: string) =>
  apiRequest<{ message: string }>({
    method: "POST",
    url: `/admin/users/${employeeId}/sessions/${sessionId}/revoke`,
  });

export const revokeAllEmployeeSessions = (employeeId: string) =>
  apiRequest<{ message: string; revokedSessionCount: number }>({
    method: "POST",
    url: `/admin/users/${employeeId}/sessions/revoke-all`,
  });
