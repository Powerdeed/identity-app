"use client";

import { useEffect, useState } from "react";
import { execute } from "@/lib";
import { getEmployeeLastActivity } from "../services/employeeActivity";
import { getEmployeeSessions } from "../services/employeeSessions";
import useEmployees from "./useEmployees";

export default function useEmployeeOverviewData() {
  const { state } = useEmployees();
  const employeeId = state.selectedEmployee?.id;
  const [currentTime] = useState(Date.now);
  const {
    setEmployeeSessions,
    setEmployeeLastActivity,
    setFetchingEmployeeData,
    setFetchingEmployeeDataError,
  } = state;

  useEffect(() => {
    if (!employeeId) return;

    execute(
      async () => {
        const [sessions, lastActivity] = await Promise.all([
          getEmployeeSessions(employeeId),
          getEmployeeLastActivity(employeeId),
        ]);
        return { sessions, lastActivity };
      },
      {
        setLoading: setFetchingEmployeeData,
        setError: setFetchingEmployeeDataError,
        onSuccess: ({ sessions, lastActivity }) => {
          setEmployeeSessions(sessions);
          setEmployeeLastActivity(lastActivity);
        },
      },
    );
  }, [
    employeeId,
    setEmployeeLastActivity,
    setEmployeeSessions,
    setFetchingEmployeeData,
    setFetchingEmployeeDataError,
  ]);

  const activeSessionCount = state.employeeSessions.filter((session) => {
    if (session.isRevoked) return false;
    if (!session.expiresAt) return true;
    return new Date(session.expiresAt).getTime() > currentTime;
  }).length;

  return { activeSessionCount };
}
