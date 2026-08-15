"use client";

import { ReactNode, useState } from "react";
import { CurrentStage, jmlContext } from "./JMLContext";
import { subSections } from "../components/JMLView";

export default function JMLProvider({ children }: { children: ReactNode }) {
  const [currentStage, setCurrentStage] =
    useState<CurrentStage>("Search Keycloak");
  const [activeSection, setActiveSection] =
    useState<(typeof subSections)[number]>("Joiner");

  return (
    <jmlContext.Provider
      value={{ currentStage, setCurrentStage, activeSection, setActiveSection }}
    >
      {children}
    </jmlContext.Provider>
  );
}
