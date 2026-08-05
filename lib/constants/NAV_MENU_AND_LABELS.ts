import { PERMISSIONS } from "@app/auth/constants/permissions";
import type { UserPermission } from "@app/auth/types/user.type";

export const menuItems = [
  {
    label: "Dashboard",
    icon: "sliders",
    requiredPermission: PERMISSIONS.IDENTITY_DASHBOARD_MANAGE,
  },
  {
    label: "People",
    icon: "user-tie",
    requiredPermission: PERMISSIONS.IDENTITY_USERS_READ,
  },
  {
    label: "Joiners/Movers/Leavers",
    icon: "list-check",
    requiredPermission: PERMISSIONS.IDENTITY_JML_READ,
  },
  {
    label: "Access Governance",
    icon: "folder",
    requiredPermission: PERMISSIONS.IDENTITY_ACCESS_READ,
  },
  {
    label: "Sessions & Devices",
    icon: "file-lines",
    requiredPermission: PERMISSIONS.IDENTITY_SESSIONS_READ,
  },
  {
    label: "Security Activity",
    icon: "newspaper",
    requiredPermission: PERMISSIONS.IDENTITY_SECURITY_READ,
  },
  {
    label: "Access Reviews",
    icon: "images",
    requiredPermission: PERMISSIONS.IDENTITY_ACCESS_REVIEWS_READ,
  },
  {
    label: "Policies & Configuration",
    icon: "calendar",
    requiredPermission: PERMISSIONS.IDENTITY_POLICIES_READ,
  },
] satisfies {
  label: string;
  icon: string;
  requiredPermission: UserPermission;
}[];

export type MenuLabels = (typeof menuItems)[number]["label"];
