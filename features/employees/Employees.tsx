"use client";

import { useSectionParams } from "@/app/[section]/SectionParamsContext";
import EmployeesView from "./components/EmployeesView";
import EmployeesProvider from "./context/EmployeesProvider";

export default function Employees() {
  const { search } = useSectionParams();

  return (
    <EmployeesProvider defaultSearch={search}>
      <EmployeesView />
    </EmployeesProvider>
  );
}
