export const MOVE_REASONS = [
  { value: "promotion", label: "Promotion" },
  { value: "lateral_transfer", label: "Lateral transfer" },
  { value: "department_transfer", label: "Department transfer" },
  { value: "manager_change", label: "Manager change" },
  { value: "role_change", label: "Role or job-profile change" },
  { value: "reorganization", label: "Organizational restructuring" },
  { value: "temporary_assignment", label: "Temporary assignment" },
  { value: "return_from_leave", label: "Return from leave" },
  { value: "data_correction", label: "Data correction" },
  { value: "other", label: "Other" },
] as const;

export type MoveReasonCode = (typeof MOVE_REASONS)[number]["value"];

export const getMoveReasonLabel = (reasonCode: MoveReasonCode) =>
  MOVE_REASONS.find((reason) => reason.value === reasonCode)?.label ??
  reasonCode;
