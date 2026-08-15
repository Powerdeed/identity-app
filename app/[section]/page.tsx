"use client";

// modules
import { use } from "react";

// utils
import { convertLinkToLabel, useGlobals } from "@globals";

// constants
import { MenuLabels } from "@lib/constants/NAV_MENU_AND_LABELS";

// features

// component
import Employees from "@/features/employees/Employees";
import Dashboard from "@/features/dashboard/Dashboard";
import JML from "@/features/JML/JML";
import AccessGovernance from "@/features/access-governance/AccessGovernance";
import SessionsAndDevices from "@/features/sessions-and-devices/SessionsAndDevices";
import SecurityActivity from "@/features/security-activity/SecurityActivity";
import AccessReviews from "@/features/access-reviews/AccessReviews";
import PoliciesAndConfiguration from "@/features/policies-and-configuration/PoliciesAndConfiguration";

export default function Section({
  params,
}: {
  params: Promise<{ section: MenuLabels }>;
}) {
  const { section } = use(params);
  const sectionLabel = convertLinkToLabel(decodeURIComponent(section));
  const { globalStates } = useGlobals();

  const sectionMap: Record<MenuLabels, React.ReactNode> = {
    Dashboard: <Dashboard />,
    Employees: <Employees />,
    "Joiners/Movers/Leavers": <JML />,
    "Access Governance": <AccessGovernance />,
    "Sessions & Devices": <SessionsAndDevices />,
    "Security Activity": <SecurityActivity />,
    "Access Reviews": <AccessReviews />,
    "Policies & Configuration": <PoliciesAndConfiguration />,
  };

  const content = sectionMap[sectionLabel];

  return (
    <div
      className={`page-with-panels min-w-0 max-w-full overflow-x-hidden pt-15 ${globalStates.sideBarOpen ? "pl-65" : "pl-15"}`}
    >
      {content}
    </div>
  );
}
