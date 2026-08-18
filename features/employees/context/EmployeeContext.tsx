"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import type { EmployeeMenu } from "../constants/EMPLOYEE_NAV_MENU";
import { User, UserPermission, UserSession } from "@/app/auth";
import { AuditEvent } from "../types/audit.types";
import type { EmploymentDetails } from "../types/employeesTypes";

export type EmployeeContextValue = {
  currentMenu: EmployeeMenu;
  setCurrentMenu: Dispatch<SetStateAction<EmployeeMenu>>;
  selectedEmployee: User | null;
  setSelectedEmployee: Dispatch<SetStateAction<User | null>>;
  employeeSessions: UserSession[];
  setEmployeeSessions: Dispatch<SetStateAction<UserSession[]>>;
  employeeLastActivity: AuditEvent | null;
  setEmployeeLastActivity: Dispatch<SetStateAction<AuditEvent | null>>;
  employeeActivities: AuditEvent[];
  setEmployeeActivities: Dispatch<SetStateAction<AuditEvent[]>>;
  fetchingEmployeeData: boolean;
  setFetchingEmployeeData: Dispatch<SetStateAction<boolean>>;
  fetchingEmployeeDataError: string;
  setFetchingEmployeeDataError: Dispatch<SetStateAction<string>>;
  employmentDetails: EmploymentDetails | null;
  setEmploymentDetails: Dispatch<SetStateAction<EmploymentDetails | null>>;
  isEmployeeDetailsOpen: boolean;
  setIsEmployeeDetailsOpen: Dispatch<SetStateAction<boolean>>;
  isPermissionsRegistryOpen: boolean;
  setIsPermissionsRegistryOpen: Dispatch<SetStateAction<boolean>>;
  fetchingPermissions: boolean;
  setFetchingPermissions: Dispatch<SetStateAction<boolean>>;
  fetchingPermissionsError: string;
  setFetchingPermissionsError: Dispatch<SetStateAction<string>>;
  permissions: UserPermission[];
  setPermissions: Dispatch<SetStateAction<UserPermission[]>>;
};

export const employeeContext = createContext<EmployeeContextValue | null>(null);
