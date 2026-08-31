import { apiRequest } from "@lib";
import type { AuditData } from "@/features/employees/types/audit.types";

export const getAuditEvents = (params: {
  search?: string;
  category?: "lifecycle" | "access" | "session" | "keycloak";
  eventType?: string;
  occurredFrom?: string;
  occurredTo?: string;
  page?: number;
  pageSize?: number;
}) =>
  apiRequest<AuditData>({
    method: "GET",
    url: "/admin/audit-events",
    params,
  });
