"use client";

import { useContext } from "react";
import { navContext } from "../context/navContext";

export default function useNav() {
  const navStates = useContext(navContext);

  if (!navStates) throw new Error("Nav states must be within a provider");

  return { navStates };
}
