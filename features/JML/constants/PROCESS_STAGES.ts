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

export const MoverStages = [
  "Select Person",
  "Specify Change",
  "Preview Impact",
  "Confirm Move",
];
