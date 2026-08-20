"use client";

import { SectionTitle } from "@/global-components/ui/Title";

import useJML from "../hooks/useJML";
import { PAGE_META_DATA } from "../constants/PAGE_META_DATA";
import { JML_SECTIONS } from "../types/jml.types";
import Joiners from "./joiners/Joiners";
import Movers from "./movers/Movers";
import Leavers from "./leavers/Leavers";

export const subSections = JML_SECTIONS;

export default function JMLView() {
  const { state, dispatch } = useJML();

  return (
    <div className="uniform-page-display text-style__body">
      <div className="flex-1">
        <SectionTitle
          title={PAGE_META_DATA.title}
          subtitle={PAGE_META_DATA.subtitle}
        />
      </div>

      {/* Subsections */}
      <div className="w-fit flex bg-white rounded-[10px] text-style__small-text overflow-auto">
        {subSections.map((subSection) => (
          <div
            key={subSection}
            className={`buttonize p-2.5 ${state.activeSection === subSection ? "bg-(--secondary-blue) text-white" : "bg-white"}`}
            onClick={() =>
              dispatch({ type: "section/set", section: subSection })
            }
          >
            {subSection}
          </div>
        ))}
      </div>

      {state.activeSection === "Joiner" && <Joiners />}
      {state.activeSection === "Mover" && <Movers />}
      {state.activeSection === "Leaver" && <Leavers />}
    </div>
  );
}
