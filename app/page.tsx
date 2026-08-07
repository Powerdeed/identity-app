import { redirect } from "next/navigation";

import { menuItems } from "@lib/constants/NAV_MENU_AND_LABELS";
import { convertLabelToLink } from "@globals";

export default function Home() {
  redirect(convertLabelToLink(menuItems[0].label));
}
