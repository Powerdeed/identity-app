"use client";

import { useContext } from "react";
import { jmlContext } from "../context/JMLContext";

export default function useJML() {
  const state = useContext(jmlContext);

  if (!state) throw new Error("useJML must be used within JMLProvider.");

  return state;
}
