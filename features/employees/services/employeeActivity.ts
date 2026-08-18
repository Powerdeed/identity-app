import { identityApiRequest } from "@/lib/api/identityApiRequest";
import type { AuditData, AuditEvent } from "../types/audit.types";

export async function getEmployeeLastActivity(
  employeeId: string,
): Promise<AuditEvent | null> {
  const response = await identityApiRequest<AuditData>({
    method: "GET",
    url: `/admin/audit-events?targetUserId=${employeeId}&pageSize=1`,
  });
  return response.events[0] ?? null;
}

export async function getEmployeeActivities(
  employeeId: string,
): Promise<AuditEvent[]> {
  const response = await identityApiRequest<AuditData>({
    method: "GET",
    url: `/admin/audit-events?targetUserId=${employeeId}&pageSize=100`,
  });
  return response.events;
}
