import { PERMISSIONS } from "@app/auth/constants/permissions";
import type { UserPermission } from "@/globals/types/user.type";

export const menuItems = [
  {
    label: "Dashboard",
    icon: "sliders",
    requiredPermission: PERMISSIONS.IDENTITY_USERS_READ,
  },
  {
    label: "Employees",
    icon: "user-group",
    requiredPermission: PERMISSIONS.IDENTITY_USERS_READ,
  },
  {
    label: "Joiners/Movers/Leavers",
    icon: "user-plus",
    requiredPermission: PERMISSIONS.IDENTITY_JML_READ,
  },
  {
    label: "Access Governance",
    icon: "shield-halved",
    requiredPermission: PERMISSIONS.IDENTITY_ACCESS_READ,
  },
  {
    label: "Sessions & Devices",
    icon: "tv",
    requiredPermission: PERMISSIONS.IDENTITY_SESSIONS_READ,
  },
  {
    label: "Security Activity",
    icon: "user-shield",
    requiredPermission: PERMISSIONS.IDENTITY_SECURITY_READ,
  },
  {
    label: "Access Reviews",
    icon: "clipboard-list",
    requiredPermission: PERMISSIONS.IDENTITY_ACCESS_REVIEWS_READ,
  },
  {
    label: "Policies & Configuration",
    icon: "gear",
    requiredPermission: PERMISSIONS.IDENTITY_POLICIES_READ,
  },
] satisfies {
  label: string;
  icon: string;
  requiredPermission: UserPermission;
}[];

export type MenuLabels = (typeof menuItems)[number]["label"];
