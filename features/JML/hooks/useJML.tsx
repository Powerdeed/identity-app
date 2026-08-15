"use client";

import useJMLStates from "./useJMLStates";

export default function useJML() {
  const state = useJMLStates();

  return { state };
}
