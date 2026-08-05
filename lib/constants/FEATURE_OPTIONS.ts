import { menuItems } from "./NAV_MENU_AND_LABELS";

export const FEATURE_OPTIONS = menuItems.map((item) => ({
  label: item.label,
  IconPrefix: "fas",
  IconName: item.icon,
  description: "",
}));

export type FeatureOptions = (typeof FEATURE_OPTIONS)[number]["label"];
