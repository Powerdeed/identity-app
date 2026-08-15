export type AuditEventType =
  | "user.status_changed"
  | "user.keycloak_profile_synced";

export interface UserSummary {
  id: string;
  name: string;
  email: string;
  username: string | null;
  keycloakUserId: string;
}

export interface StatusChangedMetadata {
  nextStatus: string;
  previousStatus: string;
  revokedSessionCount: number;
}

export interface KeycloakProfile {
  name: string;
  email: string;
}

export interface KeycloakProfileSyncedMetadata {
  nextProfile: KeycloakProfile;
  previousProfile: KeycloakProfile;
  keycloakUserId: string;
}

export type AuditEventMetadata =
  | StatusChangedMetadata
  | KeycloakProfileSyncedMetadata;

export interface AuditEvent {
  id: string;
  occurredAt: string; // ISO timestamp
  eventType: AuditEventType | string;
  actorUserId: string | null;
  targetUserId: string | null;
  sessionId: string | null;
  ip?: string | null;
  userAgent?: string | null;
  reason?: string | null;
  metadata?: AuditEventMetadata;
  actor?: UserSummary | null;
  target?: UserSummary | null;
}

export interface AuditData {
  events: AuditEvent[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AuditResponse {
  success: boolean;
  data: AuditData;
}

export const AuditEventTypes: Record<AuditEventType, AuditEventType> = {
  "user.status_changed": "user.status_changed",
  "user.keycloak_profile_synced": "user.keycloak_profile_synced",
};
