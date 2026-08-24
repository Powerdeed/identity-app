"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import { User } from "@app/auth";
import {
  DepartmentFilter,
  EmployeeSortOption,
  StatusFilter,
} from "../constants/EMPLOYEE_DIRECTORY";

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
  searchValue: string;
  setSearchValue: Dispatch<SetStateAction<string>>;
  showProvisionNotice: boolean;
  setShowProvisionNotice: Dispatch<SetStateAction<boolean>>;
  statusFilter: StatusFilter;
  setStatusFilter: Dispatch<SetStateAction<StatusFilter>>;
  departmentFilter: DepartmentFilter;
  setDepartmentFilter: Dispatch<SetStateAction<DepartmentFilter>>;
  sortOption: EmployeeSortOption;
  setSortOption: Dispatch<SetStateAction<EmployeeSortOption>>;
};

export const employeesContext = createContext<EmployeesContextValue | null>(
  null,
);
