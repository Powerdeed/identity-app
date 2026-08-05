"use client";

import { useAuthStates } from "@app/auth";

import useClipboard from "./useClipboard";
import useGlobalStates from "./useGlobalStates";
import useUnsavedChangesGuard from "./useUnsavedChangesGuard";

export default function useGlobals() {
  // states
  const states = useGlobalStates();
  const userStates = useAuthStates();

  // actions
  const clipboard = useClipboard();
  const changes = useUnsavedChangesGuard();

  return {
    globalStates: { ...states, ...userStates },
    globalActions: { ...changes, ...clipboard },
  };
}
