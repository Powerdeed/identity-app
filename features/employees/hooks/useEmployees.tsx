"use client";

import useEmployeesStates from "./useEmployeesStates";

export default function useEmployees() {
  const states = useEmployeesStates();

  return { states };
}
