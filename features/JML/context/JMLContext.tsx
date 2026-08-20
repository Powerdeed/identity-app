"use client";

import { createContext, Dispatch, SetStateAction } from "react";
import type { JMLAction, JMLState } from "../state/jml.reducer";
import { moverStages } from "../constants/PROCESS_STAGES";

export type JMLContextValue = {
  state: JMLState;
  dispatch: Dispatch<JMLAction>;
  currentMoverStage: (typeof moverStages)[number];
  setCurrentMoverStage: Dispatch<SetStateAction<(typeof moverStages)[number]>>;
  currentMoverStageIndex: number;
  firstMoverStage: string;
  lastMoverStage: string;
};

export const jmlContext = createContext<JMLContextValue | null>(null);
