"use client";

import EmployeesView from "./components/EmployeesView";
import EmployeesProvider from "./context/EmployeesProvider";

export default function Employees() {
  return (
    <EmployeesProvider>
      <EmployeesView />
    </EmployeesProvider>
  );
}
