"use client";

import { SectionTitle } from "@/global components/ui/Title";
import DashboardCards from "./DashboardCards";
import ActionQueue from "./ActionQueue";
import Changes from "./Changes";

import { PAGE_META_DATA } from "../constants/PageMetaData";
import QuickActions from "./QuickActions";

export default function DashboardView() {
  return (
    <main className="uniform-page-display">
      <SectionTitle
        title={PAGE_META_DATA.title}
        subtitle={PAGE_META_DATA.subtitle}
      />

      <DashboardCards />

      <ActionQueue />

      <Changes />

      <QuickActions />
    </main>
  );
}
