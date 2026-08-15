"use client";

import {
  LIFECYCLE_STATUSES,
  LifecycleStatus,
} from "@/features/employees/constants/LIFECYCLE_STATUSES";
import useEmployees from "@/features/employees/hooks/useEmployees";
import {
  activateEmployee,
  archiveEmployee,
  suspendEmployee,
} from "@/features/employees/services/employee";
import Button from "@/global-components/ui/Button";
import ContainerTitle from "@/global-components/ui/ContainerTitle";
import { execute } from "@/lib";
import { useEffect, useState } from "react";
import type { User } from "@/app/auth";

const toLifecycleStatus = (status?: string): LifecycleStatus => {
  switch (status) {
    case "pending":
      return "Pending";
    case "suspended":
      return "Suspended";
    case "archived":
      return "Archived";
    case "active":
    default:
      return "Active";
  }
};

export default function Lifecycle() {
  const { state } = useEmployees();
  const employee = state.selectedEmployee;
  const employeeStatus = toLifecycleStatus(employee?.status);
  const [currentStatus, setCurrentStatus] = useState<LifecycleStatus | null>(
    null,
  );

  useEffect(() => {
    const setStatus = () => {
      if (employeeStatus) setCurrentStatus(employeeStatus);
    };
    setStatus();
  }, [employeeStatus]);

  if (!employee) return null;

  const changeStatus = (action: () => Promise<User>) => {
    execute(action, {
      setLoading: state.setFetchingEmployeeData,
      setError: state.setFetchingEmployeeDataError,
      onSuccess: (updatedEmployee) => {
        state.setSelectedEmployee(updatedEmployee);
        state.setEmployees((employees) =>
          employees.map((listedEmployee) =>
            listedEmployee.id === updatedEmployee.id
              ? updatedEmployee
              : listedEmployee,
          ),
        );
      },
    });
  };

  return (
    <div className="vertical-layout__outer">
      <div className="feature-container-vertical h-35">
        <div className="text-style__body">LIFECYCLE STATE</div>

        <div className="flex items-center gap-1">
          {LIFECYCLE_STATUSES.map((status, i) => (
            <div key={status} className="flex items-center gap-1">
              {i !== 0 && (
                <hr
                  className={`w-8 border translate-y-0.8 ${currentStatus === status ? "border-(--primary-blue)" : "border-(--primary-grey)/30"}`}
                />
              )}

              <div className="relative text-style__small-text vertical-layout__inner items-center">
                <div
                  className={`w-8 h-8 rounded-full ${currentStatus === status ? "bg-(--primary-blue) text-white" : "border border-(--terciary-grey) text-(--primary-grey)"} text-center horizontal-layout justify-center`}
                >
                  {i + 1}
                </div>
                <div className="absolute translate-y-10">{status}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="feature-container-vertical">
        <ContainerTitle title="Lifecycle Actions" />

        <div className="p-2.5 md:p-5 flex justify-between gap-2.5 md:gap-5 bg-(--primary-yellow-faded)/30 border border-(--primary-yellow) rounded-[10px] text-(--primary-red)">
          <div>
            <div className="text-style__body--bold">Suspend Account</div>
            <div className="text-style__small-text">
              Immediately revokes all sessions. Keycloak account remains
              enabled.
            </div>
          </div>
          <div>
            <Button
              buttonText="Suspend"
              buttonType="red"
              disabled={
                state.fetchingEmployeeData || employee.status === "suspended"
              }
              clickAction={() =>
                changeStatus(
                  () =>
                    suspendEmployee(
                      employee.id,
                      "Suspended from Identity app lifecycle panel.",
                    ),
                )
              }
            />
          </div>
        </div>

        <div className="p-2.5 md:p-5 flex justify-between gap-2.5 md:gap-5 bg-(--primary-red-faded)/30 border border-(--primary-red) rounded-[10px] text-(--primary-red)">
          <div>
            <div className="text-style__body--bold">Archived Account</div>
            <div className="text-style__small-text">
              All access removed, sessions revoked. Audit records retained.
              Keycloak disable is a separate step.
            </div>
          </div>
          <div>
            <Button
              buttonText="Archive"
              buttonType="red"
              disabled={
                state.fetchingEmployeeData || employee.status === "archived"
              }
              clickAction={() =>
                changeStatus(
                  () =>
                    archiveEmployee(
                      employee.id,
                      "Archived from Identity app lifecycle panel.",
                    ),
                )
              }
            />
          </div>
        </div>

        <div className="p-2.5 md:p-5 flex justify-between gap-2.5 md:gap-5 bg-(--secondary-blue)/15 border border-(--secondary-blue) rounded-[10px] text-(--secondary-blue)">
          <div>
            <div className="text-style__body--bold">Activate Account</div>
            <div className="text-style__small-text">
              Restores the Powerdeed identity status. App access is still
              governed by assigned roles, permissions, and Keycloak access.
            </div>
          </div>
          <div>
            <Button
              buttonText="Activate"
              disabled={state.fetchingEmployeeData || employee.status === "active"}
              clickAction={() =>
                changeStatus(
                  () =>
                    activateEmployee(
                      employee.id,
                      "Activated from Identity app lifecycle panel.",
                    ),
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
