"use client";

import { SectionTitle } from "@/global-components/ui/Title";
import { PAGE_META_DATA } from "../constants/PAGE_META_DATA";
import useJML from "../hooks/useJML";

export const subSections = ["Joiner", "Mover", "Leaver"];

export default function JMLView() {
  const { state } = useJML();

  return (
    <div className="uniform-page-display">
      <div className="flex-1">
        <SectionTitle
          title={PAGE_META_DATA.title}
          subtitle={PAGE_META_DATA.subtitle}
        />
      </div>

      {/* Subsections */}
      <div className="buttonize containerize flex border border-(--terciary-grey)">
        {subSections.map((subSection) => (
          <div
            key={subSection}
            className={`p-2.5 rounded-[10px] ${state.activeSection === subSection ? "bg-(--primary-blue) text-white" : "bg-white"}`}
            onClick={() => state.setActiveSection(subSection)}
          >
            {subSection}
          </div>
        ))}
      </div>

      {/*  */}
    </div>
  );
}
