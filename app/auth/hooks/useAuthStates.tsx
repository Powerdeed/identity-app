"use client";

import { useContext } from "react";
import { userContext } from "../context/userContext";

export default function UseAuthStates() {
  const authStates = useContext(userContext);

  if (!authStates) throw new Error("Auth states must be within a provider");

  return { ...authStates };
}
