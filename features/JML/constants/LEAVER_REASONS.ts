export const LEAVER_REASONS = [
  { value: "resignation", label: "Resignation" },
  { value: "termination", label: "Termination" },
  { value: "contract_end", label: "Contract end" },
  { value: "retirement", label: "Retirement" },
  { value: "redundancy", label: "Redundancy" },
  { value: "other", label: "Other" },
] as const;

export type LeaverReasonCode = (typeof LEAVER_REASONS)[number]["value"];

export const getLeaverReasonLabel = (reasonCode: LeaverReasonCode) =>
  LEAVER_REASONS.find((reason) => reason.value === reasonCode)?.label ??
  reasonCode;
