"use client";

import { useContext } from "react";
import { employeesContext } from "../context/EmployeesContext";
import { employeeContext } from "../context/EmployeeContext";

export default function useEmployeesApi() {
  const employeesStates = useContext(employeesContext);
  const employeeStates = useContext(employeeContext);

  if (!employeesStates || !employeeStates)
    throw new Error("Employee states must be within an EmployeesProvider.");

  const {} = employeesStates;
  const {} = employeeStates;

  return {};
}
