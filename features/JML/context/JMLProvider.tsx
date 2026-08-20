"use client";

import { ReactNode, useReducer, useState } from "react";
import { jmlContext } from "./JMLContext";
import { initialJMLState, jmlReducer } from "../state/jml.reducer";
import { moverStages } from "../constants/PROCESS_STAGES";

export default function JMLProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(jmlReducer, initialJMLState);

  const [currentMoverStage, setCurrentMoverStage] =
    useState<(typeof moverStages)[number]>("Select Person");
  const currentMoverStageIndex = moverStages.indexOf(currentMoverStage);
  const firstMoverStage = moverStages[0];
  const lastMoverStage = moverStages[moverStages.length - 1];

  return (
    <jmlContext.Provider
      value={{
        state,
        dispatch,
        currentMoverStage,
        setCurrentMoverStage,
        currentMoverStageIndex,
        firstMoverStage,
        lastMoverStage,
      }}
    >
      {children}
    </jmlContext.Provider>
  );
}
