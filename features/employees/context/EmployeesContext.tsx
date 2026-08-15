"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import { User } from "@/app/auth";

type EmployeesContextValue = {
  employees: User[];
  setEmployees: Dispatch<SetStateAction<User[]>>;
  currentPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
  pageSize: number;
  setPageSize: Dispatch<SetStateAction<number>>;
  fetchingEmployees: boolean;
  setFetchingEmployees: Dispatch<SetStateAction<boolean>>;
  fetchingEmployeesError: string;
  setFetchingEmployeesError: Dispatch<SetStateAction<string>>;
};

export const employeesContext = createContext<EmployeesContextValue | null>(
  null,
);
