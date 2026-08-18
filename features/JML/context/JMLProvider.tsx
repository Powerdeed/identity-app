"use client";

import { ReactNode, useReducer } from "react";
import { jmlContext } from "./JMLContext";
import { initialJMLState, jmlReducer } from "../state/jml.reducer";

export default function JMLProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(jmlReducer, initialJMLState);

  return (
    <jmlContext.Provider value={{ state, dispatch }}>
      {children}
    </jmlContext.Provider>
  );
}
