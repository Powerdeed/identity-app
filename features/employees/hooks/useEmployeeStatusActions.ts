"use client";

import { execute } from "@/lib";
import {
  activateEmployee,
  archiveEmployee,
  suspendEmployee,
} from "../services/employeeLifecycle";
import useEmployees from "./useEmployees";

type StatusAction = "activate" | "suspend" | "archive";

const statusOperations = {
  activate: activateEmployee,
  suspend: suspendEmployee,
  archive: archiveEmployee,
};

export default function useEmployeeStatusActions() {
  const { state } = useEmployees();

  const changeStatus = (action: StatusAction, reason: string) => {
    const employee = state.selectedEmployee;
    if (!employee) return;

    execute(() => statusOperations[action](employee.id, reason), {
      setLoading: state.setFetchingEmployeeData,
      setError: state.setFetchingEmployeeDataError,
      onSuccess: (updatedEmployee) => {
        state.setSelectedEmployee(updatedEmployee);
        state.setEmployees((employees) =>
          employees.map((listedEmployee) =>
            listedEmployee.id === updatedEmployee.id
              ? updatedEmployee
              : listedEmployee,
          ),
        );
      },
    });
  };

  return { changeStatus };
}
