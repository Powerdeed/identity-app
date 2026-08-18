"use client";

import { useContext } from "react";
import { jmlContext } from "../context/JMLContext";

export default function useJML() {
  const context = useContext(jmlContext);

  if (!context) throw new Error("useJML must be used within JMLProvider.");

  return context;
}
