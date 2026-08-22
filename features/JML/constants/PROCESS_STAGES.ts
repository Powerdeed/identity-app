export const joinerStages = {
  "Search Keycloak": "Search Unprovisioned Keycloak Users",
  "Verify Identity": "Verify Identity",
  "Create Profile": "Create Powerdeed Profile",
  Employment: "Employment Details",
  "Assign Access": "Assign Baseline Access",
  "Review & Activate": "Review & Activate",
} as const;

export type CurrentStage = keyof typeof joinerStages;

export const joinerStageOrder = Object.keys(joinerStages) as CurrentStage[];

export const moverStages = [
  "Select Person",
  "Specify Change",
  "Preview Impact",
  "Confirm Move",
] as const;

export type CurrentMoverStage = (typeof moverStages)[number];

export const moverStageOrder: readonly CurrentMoverStage[] = moverStages;

export const leaverStages = [
  "Select Person",
  "Specify Exit",
  "Preview Impact",
  "Confirm Offboarding",
] as const;

export type CurrentLeaverStage = (typeof leaverStages)[number];

export const leaverStageOrder: readonly CurrentLeaverStage[] = leaverStages;
