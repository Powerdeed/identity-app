"use client";

import { createContext, Dispatch } from "react";
import type { JMLAction, JMLState } from "../state/jml.reducer";

export type JMLContextValue = {
  state: JMLState;
  dispatch: Dispatch<JMLAction>;
};

export const jmlContext = createContext<JMLContextValue | null>(null);
