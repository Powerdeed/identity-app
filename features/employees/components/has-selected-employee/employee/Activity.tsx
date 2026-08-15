"use client";

import useEmployees from "@/features/employees/hooks/useEmployees";
import { getEmployeeActivities } from "@/features/employees/services/employee";
import { DateRangePicker } from "@/global-components/layout/date";
import Filter from "@/global-components/ui/Filter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useState } from "react";
import UserActivities, {
  type UserActivityCategory,
  type UserActivityRow,
} from "../../tables/UserActivities";
import { execute } from "@/lib";

const activityCategories = [
  "All Categories",
  "Lifecycle",
  "Access",
  "Session",
  "Keycloak",
];

const getActivityCategory = (eventType: string): UserActivityCategory => {
  if (eventType.includes("status")) return "Lifecycle";
  if (eventType.includes("session")) return "Session";
  if (eventType.includes("keycloak")) return "Keycloak";

  return "Access";
};

export default function Activity() {
  const { state } = useEmployees();
  const employee = state.selectedEmployee;
  const employeeId = employee?.id;
  const [activityCategory, setActivityCategory] = useState<
    (typeof activityCategories)[number] | number
  >("All Categories");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    if (!employeeId) {
      state.setEmployeeActivities([]);
      return;
    }

    execute(() => getEmployeeActivities(employeeId), {
      setLoading: state.setFetchingEmployeeData,
      setError: state.setFetchingEmployeeDataError,
      onSuccess: state.setEmployeeActivities,
    });
  }, [
    employeeId,
    state.setEmployeeActivities,
    state.setFetchingEmployeeData,
    state.setFetchingEmployeeDataError,
  ]);

  const activities: UserActivityRow[] = useMemo(
    () =>
      state.employeeActivities.map((activity) => ({
        id: activity.id,
        event: activity.eventType,
        category: getActivityCategory(activity.eventType),
        actor: activity.actor?.username ?? activity.actor?.email ?? "System",
        ipAddress: activity.ip ?? "-",
        timestamp: activity.occurredAt,
        reason: activity.reason,
      })),
    [state.employeeActivities],
  );

  const filteredActivities = activities.filter((activity) => {
    const eventDate = new Date(activity.timestamp);
    const matchesCategory =
      activityCategory === "All Categories" ||
      activity.category === activityCategory;
    const startsOnOrAfter = !startDate || eventDate >= startDate;
    const endOfSelectedDay = endDate
      ? new Date(
          endDate.getFullYear(),
          endDate.getMonth(),
          endDate.getDate(),
          23,
          59,
          59,
          999,
        )
      : null;
    const endsOnOrBefore = !endOfSelectedDay || eventDate <= endOfSelectedDay;

    return matchesCategory && startsOnOrAfter && endsOnOrBefore;
  });

  if (!employee) return null;

  return (
    <div className="vertical-layout__outer text-style__body min-h-screen">
      <div className="horizontal-layout p-5 rounded-[10px] text-style__small-text border border-(--secondary-blue) bg-(--secondary-blue)/15 text-(--secondary-blue)">
        <FontAwesomeIcon
          icon={["fas", "info-circle"]}
          className="text-style__big-text"
        />
        <div>
          <span className="font-bold">Identity audit trail:</span> events are
          loaded from identity-service audit logs for the selected employee.
        </div>
      </div>

      <div className="feature-container-horizontal horizontal-layout text-style__small-text">
        <Filter
          placeholder="select category"
          selectFirstOption
          filterOptions={activityCategories}
          selectedOption={activityCategory}
          setSelectedOption={setActivityCategory}
          dropdownSelectorDirection="upwards"
        />
        <DateRangePicker
          startDate={startDate}
          endDate={endDate}
          onChange={(range) => {
            setStartDate(range.startDate);
            setEndDate(range.endDate);
          }}
        />
      </div>

      <UserActivities activities={filteredActivities} />
    </div>
  );
}
