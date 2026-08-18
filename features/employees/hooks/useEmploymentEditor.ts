"use client";

import { execute } from "@/lib";
import { updateEmployeeEmployment } from "../services/employeeProfile";
import type { EmploymentDetails } from "../types/employeesTypes";
import { toDateInput, toEmploymentProfile } from "../utils/employment";
import useEmployees from "./useEmployees";

export default function useEmploymentEditor() {
  const { state } = useEmployees();

  const close = () => state.setIsEmployeeDetailsOpen(false);

  const updateField = (
    field: keyof EmploymentDetails,
    value: EmploymentDetails[keyof EmploymentDetails],
  ) => {
    state.setEmploymentDetails((current) =>
      current ? { ...current, [field]: value } : null,
    );
  };

  const updatePeriod = (startDate: Date, endDate: Date) => {
    state.setEmploymentDetails((current) =>
      current
        ? {
            ...current,
            "START DATE": toDateInput(startDate),
            "END DATE": toDateInput(endDate),
          }
        : null,
    );
  };

  const save = () => {
    const employee = state.selectedEmployee;
    const details = state.employmentDetails;
    if (!employee || !details) return;

    execute(
      () => updateEmployeeEmployment(employee.id, toEmploymentProfile(details)),
      {
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
          close();
        },
      },
    );
  };

  return { close, save, updateField, updatePeriod };
}
