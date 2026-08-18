"use client";

import { ReactNode, useState } from "react";
import { employeesContext } from "./EmployeesContext";
import { employeeContext } from "./EmployeeContext";
import type { EmployeeMenu } from "../constants/EMPLOYEE_NAV_MENU";
import {
  User,
  UserSession,
  UserPermission,
} from "@/app/auth";
import { AuditEvent } from "../types/audit.types";
import type { EmploymentDetails } from "../types/employeesTypes";

export default function EmployeesProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [employees, setEmployees] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null);
  const [currentMenu, setCurrentMenu] = useState<EmployeeMenu>("Overview");
  const [fetchingEmployees, setFetchingEmployees] = useState(false);
  const [fetchingEmployeesError, setFetchingEmployeesError] = useState("");
  const [employeeSessions, setEmployeeSessions] = useState<UserSession[]>([]);
  const [fetchingEmployeeData, setFetchingEmployeeData] = useState(false);
  const [fetchingEmployeeDataError, setFetchingEmployeeDataError] =
    useState("");
  const [employeeActivities, setEmployeeActivities] = useState<AuditEvent[]>(
    [],
  );
  const [employeeLastActivity, setEmployeeLastActivity] =
    useState<AuditEvent | null>(null);

  const [employmentDetails, setEmploymentDetails] =
    useState<EmploymentDetails | null>(null);
  const [isEmployeeDetailsOpen, setIsEmployeeDetailsOpen] = useState(false);
  const [isPermissionsRegistryOpen, setIsPermissionsRegistryOpen] =
    useState(false);

  // Permissions
  const [permissions, setPermissions] = useState<UserPermission[]>([]);
  const [fetchingPermissions, setFetchingPermissions] = useState(false);
  const [fetchingPermissionsError, setFetchingPermissionsError] = useState("");

  return (
    <employeesContext.Provider
      value={{
        employees,
        setEmployees,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        fetchingEmployees,
        setFetchingEmployees,
        fetchingEmployeesError,
        setFetchingEmployeesError,
      }}
    >
      <employeeContext.Provider
        value={{
          currentMenu,
          setCurrentMenu,
          selectedEmployee,
          setSelectedEmployee,
          employeeSessions,
          setEmployeeSessions,
          fetchingEmployeeData,
          setFetchingEmployeeData,
          fetchingEmployeeDataError,
          setFetchingEmployeeDataError,
          employeeActivities,
          setEmployeeActivities,
          employeeLastActivity,
          setEmployeeLastActivity,
          employmentDetails,
          setEmploymentDetails,
          isEmployeeDetailsOpen,
          setIsEmployeeDetailsOpen,
          isPermissionsRegistryOpen,
          setIsPermissionsRegistryOpen,
          permissions,
          setPermissions,
          fetchingPermissions,
          setFetchingPermissions,
          fetchingPermissionsError,
          setFetchingPermissionsError,
        }}
      >
        {children}
      </employeeContext.Provider>
    </employeesContext.Provider>
  );
}
