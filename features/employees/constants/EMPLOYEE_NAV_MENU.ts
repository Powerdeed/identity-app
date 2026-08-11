export const navMenu = [
  "Overview",
  "Employment",
  "Powerdeed Access",
  "Keycloak Access",
  "Sessions & Devices",
  "Lifecycle",
  "Activity",
] as const;

export type EmployeeMenu = (typeof navMenu)[number];
