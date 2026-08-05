"use client";

import { SectionTitle } from "@/global components/ui/Title";
import { PAGE_META_DATA } from "../constants/PageMetaData";

export default function DashboardView() {
  return (
    <main className="uniform-page-display">
      <SectionTitle
        title={PAGE_META_DATA.title}
        subtitle={PAGE_META_DATA.subtitle}
      />
    </main>
  );
}
