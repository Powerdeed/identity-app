"use client";

import SelectedEmployeeDetails from "./has-selected-employee/SelectedEmployeeDetails";

import DisplayEmployees from "./has-no-selected-employee/DisplayEmployees";
import useEmployees from "../hooks/useEmployees";

export default function EmployeesView() {
  const { state } = useEmployees();

  return (
    <div>
      {!state.selectedEmployee && <DisplayEmployees />}

      {state.selectedEmployee && <SelectedEmployeeDetails />}
    </div>
  );
}
