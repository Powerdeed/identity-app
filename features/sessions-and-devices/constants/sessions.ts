import type { SessionFilter } from "../types/sessions.types";

export const sessionFilters: Array<{ value: SessionFilter; label: string }> = [
  { value: "all", label: "All statuses" },
  { value: "active", label: "Active" },
  { value: "revoked", label: "Revoked" },
  { value: "expired", label: "Expired" },
];

export const sessionStatusTone = {
  Active: "green",
  Expired: "grey",
  Revoked: "red",
} as const;
