"use client";

import useEmployeesApi from "./useEmployeesApi";
import useEmployeesStates from "./useEmployeesStates";

export default function useEmployees() {
  const state = useEmployeesStates();
  const api = useEmployeesApi();

  return { state, actions: { ...api } };
}
