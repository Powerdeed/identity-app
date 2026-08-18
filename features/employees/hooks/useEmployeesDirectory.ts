"use client";

import { useEffect } from "react";
import { execute } from "@/lib";
import { getEmployee } from "../services/employeeProfile";
import { getEmployees } from "../services/employees";
import type { EmployeeTableRow } from "../types/employeesTypes";
import useEmployees from "./useEmployees";

export default function useEmployeesDirectory() {
  const { state } = useEmployees();
  const {
    setEmployees,
    setFetchingEmployees,
    setFetchingEmployeesError,
    setSelectedEmployee,
  } = state;

  useEffect(() => {
    execute(getEmployees, {
      setLoading: setFetchingEmployees,
      setError: setFetchingEmployeesError,
      onSuccess: setEmployees,
    });
  }, [setEmployees, setFetchingEmployees, setFetchingEmployeesError]);

  const selectEmployee = (row: EmployeeTableRow) =>
    execute(() => getEmployee(row.id), {
      setLoading: setFetchingEmployees,
      setError: setFetchingEmployeesError,
      onSuccess: setSelectedEmployee,
    });

  return { selectEmployee };
}
