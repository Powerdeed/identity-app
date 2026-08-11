"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import { EmployeeTableRow } from "../types/employeesTypes";

type EmployeesContextValue = {
  employees: EmployeeTableRow[];
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  selectedEmployee: string | null;
  setSelectedEmployee: Dispatch<SetStateAction<string | null>>;
};

export const employeesContext = createContext<EmployeesContextValue | null>(
  null,
);
