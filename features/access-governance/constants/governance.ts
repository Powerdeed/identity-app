import type { PageTab } from "@/global-components/ui/PageTabs";

import type { GovernanceTab } from "../types/governance";

export const governanceTabs: PageTab<GovernanceTab>[] = [
  { id: "powerdeedRoles", label: "Powerdeed Roles" },
  { id: "permissionRegistry", label: "Permission Registry" },
  { id: "keycloakRoles", label: "Keycloak Roles" },
  { id: "keycloakGroups", label: "Keycloak Groups" },
  { id: "applicationCatalog", label: "Application Catalog" },
];

export const appLabels: Record<string, string> = {
  command_center: "Command Center",
  cms: "CMS",
  identity: "Workforce Identity",
  engineering: "Engineering",
  sales: "Sales",
  finance: "Finance",
  hr: "HR",
  operations: "Operations",
  analytics: "Analytics",
};

export const riskTone = {
  low: "green",
  medium: "yellow",
  high: "yellow",
  critical: "red",
} as const;
