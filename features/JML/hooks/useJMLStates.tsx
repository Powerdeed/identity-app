"use client";

import { useContext } from "react";
import { jmlContext } from "../context/JMLContext";

export default function useJMLStates() {
  const jmlStates = useContext(jmlContext);

  if (!jmlStates) throw new Error("jmlStates must be within a provider");

  return { ...jmlStates };
}
