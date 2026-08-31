"use client";

import { useCallback, useEffect, useState } from "react";
import { execute } from "@/lib";
import {
  getEmployeeSessions,
  revokeAllEmployeeSessions,
  revokeEmployeeSession,
} from "../services/employeeSessions";
import { toSessionDeviceRow } from "@/features/sessions-and-devices/utils/sessions";
import useEmployees from "./useEmployees";

export default function useEmployeeSessions() {
  const { state } = useEmployees();
  const employeeId = state.selectedEmployee?.id;
  const [currentTime] = useState(Date.now);
  const {
    employeeSessions,
    fetchingEmployeeData,
    setEmployeeSessions,
    setFetchingEmployeeData,
    setFetchingEmployeeDataError,
  } = state;

  const refresh = useCallback(async () => {
    if (!employeeId) return;

    await execute(() => getEmployeeSessions(employeeId), {
      setLoading: setFetchingEmployeeData,
      setError: setFetchingEmployeeDataError,
      onSuccess: setEmployeeSessions,
    });
  }, [
    employeeId,
    setEmployeeSessions,
    setFetchingEmployeeData,
    setFetchingEmployeeDataError,
  ]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const revoke = (sessionId: string) => {
    if (!employeeId) return;

    execute(() => revokeEmployeeSession(employeeId, sessionId), {
      setLoading: setFetchingEmployeeData,
      setError: setFetchingEmployeeDataError,
      onSuccess: refresh,
    });
  };

  const revokeAll = () => {
    if (!employeeId) return;

    execute(() => revokeAllEmployeeSessions(employeeId), {
      setLoading: setFetchingEmployeeData,
      setError: setFetchingEmployeeDataError,
      onSuccess: refresh,
    });
  };

  return {
    rows: employeeSessions.map((session) =>
      toSessionDeviceRow(session, currentTime),
    ),
    isMutating: fetchingEmployeeData,
    revoke,
    revokeAll,
  };
}
