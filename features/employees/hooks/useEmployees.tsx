"use client";

import { useContext } from "react";
import { employeesContext } from "../context/EmployeesContext";
import { employeeContext } from "../context/EmployeeContext";

export default function useEmployees() {
  const employeesState = useContext(employeesContext);
  const employeeState = useContext(employeeContext);

  if (!employeesState || !employeeState) {
    throw new Error("useEmployees must be used within EmployeesProvider.");
  }

  return { state: { ...employeesState, ...employeeState } };
}
