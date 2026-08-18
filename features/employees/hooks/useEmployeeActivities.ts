"use client";

import { useEffect, useMemo, useState } from "react";
import { execute } from "@/lib";
import { getEmployeeActivities } from "../services/employeeActivity";
import {
  isActivityWithinRange,
  toActivityRow,
} from "../utils/employeeActivity";
import type { UserActivityCategory } from "../components/tables/UserActivities";
import useEmployees from "./useEmployees";

export const activityCategories = [
  "All Categories",
  "Lifecycle",
  "Access",
  "Session",
  "Keycloak",
] as const;

export default function useEmployeeActivities() {
  const { state } = useEmployees();
  const employeeId = state.selectedEmployee?.id;
  const [category, setCategory] = useState<
    (typeof activityCategories)[number] | number
  >("All Categories");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const {
    setEmployeeActivities,
    setFetchingEmployeeData,
    setFetchingEmployeeDataError,
  } = state;

  useEffect(() => {
    if (!employeeId) {
      setEmployeeActivities([]);
      return;
    }

    execute(() => getEmployeeActivities(employeeId), {
      setLoading: setFetchingEmployeeData,
      setError: setFetchingEmployeeDataError,
      onSuccess: setEmployeeActivities,
    });
  }, [
    employeeId,
    setEmployeeActivities,
    setFetchingEmployeeData,
    setFetchingEmployeeDataError,
  ]);

  const activities = useMemo(
    () =>
      state.employeeActivities
        .map(toActivityRow)
        .filter(
          (activity) =>
            (category === "All Categories" ||
              activity.category === (category as UserActivityCategory)) &&
            isActivityWithinRange(activity, startDate, endDate),
        ),
    [category, endDate, startDate, state.employeeActivities],
  );

  return {
    activities,
    category,
    setCategory,
    startDate,
    endDate,
    setDateRange: (range: { startDate: Date; endDate: Date }) => {
      setStartDate(range.startDate);
      setEndDate(range.endDate);
    },
  };
}
