"use client";

import useEmployees from "@/features/employees/hooks/useEmployees";
import {
  getEmployeeLastActivity,
  getEmployeeSessions,
} from "@/features/employees/services/employee";
import ContainerTitle from "@/global-components/ui/ContainerTitle";
import { getDateFormatted, getDateTimeFormatted } from "@/globals";
import { execute } from "@/lib";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { formatLabel } from "../../../utils/formatLabel";

export default function Overview() {
  const { state } = useEmployees();
  const [currentTime, setCurrentTime] = useState<number | null>(null);

  const employee = state.selectedEmployee;
  const employeeId = employee?.id;
  const {
    setEmployeeSessions,
    setEmployeeLastActivity,
    setFetchingEmployeeData,
    setFetchingEmployeeDataError,
  } = state;

  useEffect(() => {
    const getTime = () => setCurrentTime(Date.now());
    getTime();
  }, []);

  useEffect(() => {
    if (!employeeId) {
      setEmployeeSessions([]);
      setEmployeeLastActivity(null);
      return;
    }

    const fetchEmployeeSessions = async () =>
      execute(() => getEmployeeSessions(employeeId), {
        setLoading: setFetchingEmployeeData,
        setError: setFetchingEmployeeDataError,
        onSuccess: setEmployeeSessions,
      });

    const fetchEmployeeLastActivity = async () =>
      execute(() => getEmployeeLastActivity(employeeId), {
        setLoading: setFetchingEmployeeData,
        setError: setFetchingEmployeeDataError,
        onSuccess: setEmployeeLastActivity,
      });

    fetchEmployeeSessions();
    fetchEmployeeLastActivity();
  }, [
    employeeId,
    setEmployeeSessions,
    setEmployeeLastActivity,
    setFetchingEmployeeData,
    setFetchingEmployeeDataError,
  ]);

  if (!employee) return null;

  const AccessSummary: Record<
    "Keycloak Groups" | "Powerdeed Roles" | "Direct Permission Exceptions",
    { access: string[]; color: string }
  > = {
    "Keycloak Groups": {
      access: employee.keycloakGroups || [],
      color:
        "border-(--primary-green)/50 bg-(--primary-green)/10 text-(--primary-green)",
    },
    "Powerdeed Roles": {
      access: employee.roles || [],
      color:
        "border-(--secondary-blue) bg-(--secondary-blue)/15 text-(--secondary-blue)",
    },
    "Direct Permission Exceptions": {
      access: employee.access?.directPermissions || [],
      color:
        "border-(--primary-red)/30 bg-(--primary-red)/10 text-(--primary-red)",
    },
  };

  const activeSessionCount = state.employeeSessions.filter((session) => {
    if (session.isRevoked) return false;
    if (!session.expiresAt) return true;
    if (currentTime === null) return false;

    return new Date(session.expiresAt).getTime() > currentTime;
  }).length;

  const userOverview = {
    "Employee Number": employee.employment?.employeeNumber,
    Manager: employee.employment?.managerId,
    "Active Sessions":
      state.fetchingEmployeeData && state.employeeSessions.length === 0
        ? "Loading..."
        : String(activeSessionCount),
    "Last Activity": state.fetchingEmployeeData
      ? "Loading..."
      : getDateTimeFormatted(state.employeeLastActivity?.occurredAt) ||
        "No activity recorded",
    "Start Date": employee.employment?.startDate
      ? getDateFormatted(employee.employment.startDate)
      : undefined,
  };

  return (
    <div className="vertical-layout__outer">
      <div className="feature-container-vertical">
        <div className="vertical-layout__inner text-style__body">
          <ContainerTitle title="Effective Access Summary" />

          {Object.entries(AccessSummary).map(([accessType, accessVals], i) => (
            <div key={accessType} className="vertical-layout__inner">
              <div className="horizontal-layout">
                {accessType === "Direct Permission Exceptions" && (
                  <FontAwesomeIcon
                    icon={["fas", "exclamation-triangle"]}
                    className="text-(--secondary-red)"
                  />
                )}
                <div>{accessType.toUpperCase()}</div>
              </div>
              <div className="horizontal-layout flex-wrap text-style__small-text">
                {accessVals.access.length ? (
                  accessVals.access.map((accessDetails, idx) => (
                    <div
                      key={idx}
                      className={`w-fit rounded-[10px] border px-2 ${accessVals.color}`}
                    >
                      {accessDetails}
                    </div>
                  ))
                ) : (
                  <div className="text-(--primary-grey)">
                    No {accessType} assigned
                  </div>
                )}
              </div>
              {i !== Object.keys(AccessSummary).length - 1 && (
                <hr className="text-(--terciary-grey)" />
              )}
            </div>
          ))}
        </div>
      </div>

      {Object.entries(userOverview).map(([overviewTitle, overviewDesc]) => (
        <div key={overviewTitle} className="vertical-layout__inner">
          <div className="horizontal-layout text-style__small-text justify-between">
            <div className="text-(--primary-grey)">{overviewTitle}</div>
            <div className="text-right text-(--primary-blue)">
              {formatLabel(overviewDesc)}
            </div>
          </div>

          <hr className="text-(--terciary-grey)" />
        </div>
      ))}
    </div>
  );
}
