import { identityApiRequest } from "@/lib/api/identityApiRequest";
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
  identityApiRequest<AuditData>({
    method: "GET",
    url: "/admin/audit-events",
    params,
  });
