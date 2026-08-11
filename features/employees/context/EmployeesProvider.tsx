"use client";

import { ReactNode, useEffect, useState } from "react";
import { employeesContext } from "./EmployeesContext";
import { employeeContext } from "./EmployeeContext";
import { useGlobals } from "@/globals";
import { EmployeeTableRow } from "../types/employeesTypes";
import type { EmployeeMenu } from "../constants/EMPLOYEE_NAV_MENU";

export default function EmployeesProvider({ children }: { children: ReactNode }) {
  const {
    globalStates: { user },
  } = useGlobals();

  const [employees, setEmployees] = useState<EmployeeTableRow[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);
  const [currentMenu, setCurrentMenu] = useState<EmployeeMenu>("Overview");

  useEffect(() => {
    const fetchEmployees = () =>
      setEmployees(() =>
        user
          ? [
              {
                id: user._id,
                name: user.profile?.preferredName || user.name,
                email: user.email,
                department:
                  user.profile?.department || user.employment?.departmentId,
                title: user.profile?.jobTitle || user.employment?.jobTitle,
                manager: user.employment?.managerId,
                status:
                  user.security?.accountStatus === "pendingReview"
                    ? "pending"
                    : user.security?.accountStatus || "active",
                appCount: user.access?.appAccess?.length || 0,
                roleCount: user.access?.roles?.length || 0,
                sessions: 2,
                lastActivity: user.activitySummary?.lastActiveAt,
              },
            ]
          : [],
      );

    fetchEmployees();
  }, [user]);

  return (
    <employeesContext.Provider
      value={{
        employees,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
        selectedEmployee,
        setSelectedEmployee,
      }}
    >
      <employeeContext.Provider value={{ currentMenu, setCurrentMenu }}>
        {children}
      </employeeContext.Provider>
    </employeesContext.Provider>
  );
}
