"use client";

import { SectionTitle } from "@/global-components/ui/Title";
import DashboardCards from "./DashboardCards";
import ActionQueue from "./ActionQueue";
import Changes from "./Changes";

import { PAGE_META_DATA } from "../constants/PageMetaData";
import QuickActions from "./QuickActions";
import useDashboard from "../hooks/useDashboard";

export default function DashboardView() {
  const dashboard = useDashboard();

  return (
    <main className="uniform-page-display">
      <SectionTitle
        title={PAGE_META_DATA.title}
        subtitle={PAGE_META_DATA.subtitle}
      />

      <DashboardCards data={dashboard.data} isLoading={dashboard.isLoading} />

      <ActionQueue {...dashboard} />

      <Changes {...dashboard} />

      <QuickActions />
    </main>
  );
}
