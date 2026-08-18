import type { UserSession } from "@/app/auth";
import { identityApiRequest } from "@/lib/api/identityApiRequest";

export async function getEmployeeSessions(
  employeeId: string,
): Promise<UserSession[]> {
  const response = await identityApiRequest<{ sessions: UserSession[] }>({
    method: "GET",
    url: `/admin/users/${employeeId}/sessions`,
  });
  return response.sessions;
}

export const revokeEmployeeSession = (employeeId: string, sessionId: string) =>
  identityApiRequest<{ message: string }>({
    method: "POST",
    url: `/admin/users/${employeeId}/sessions/${sessionId}/revoke`,
  });

export const revokeAllEmployeeSessions = (employeeId: string) =>
  identityApiRequest<{ message: string; revokedSessionCount: number }>({
    method: "POST",
    url: `/admin/users/${employeeId}/sessions/revoke-all`,
  });
