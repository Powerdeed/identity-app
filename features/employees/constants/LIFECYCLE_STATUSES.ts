export const LIFECYCLE_STATUSES = [
  "Pending",
  "Active",
  "Suspended",
  "Archived",
] as const;

export type LifecycleStatus = (typeof LIFECYCLE_STATUSES)[number];
