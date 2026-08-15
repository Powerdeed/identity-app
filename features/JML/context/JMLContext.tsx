"use client";

import { createContext, Dispatch, SetStateAction } from "react";
import { subSections } from "../components/JMLView";

export type CurrentStage =
  | "Search Keycloak"
  | "Verify Identity"
  | "Create Profile"
  | "Employment"
  | "Assign Access"
  | "Review & Activate";

type JMLTypes = {
  currentStage: CurrentStage;
  setCurrentStage: Dispatch<SetStateAction<CurrentStage>>;
  activeSection: (typeof subSections)[number];
  setActiveSection: Dispatch<SetStateAction<(typeof subSections)[number]>>;
};

export const jmlContext = createContext<JMLTypes | null>(null);
