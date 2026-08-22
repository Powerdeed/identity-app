"use client";

import { hasPermission, PERMISSIONS } from "@/app/auth";
import {
  LIFECYCLE_STATUSES,
  LifecycleStatus,
} from "@/features/employees/constants/LIFECYCLE_STATUSES";
import useEmployees from "@/features/employees/hooks/useEmployees";
import useEmployeeStatusActions from "@/features/employees/hooks/useEmployeeStatusActions";
import Button from "@/global-components/ui/Button";
import ContainerTitle from "@/global-components/ui/ContainerTitle";
import Notice from "@/global-components/ui/Notice";
import { useGlobals } from "@/globals";
import { useEffect, useState } from "react";

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
  const { globalStates } = useGlobals();
  const { state } = useEmployees();
  const { changeStatus } = useEmployeeStatusActions();
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

  const canManageLifecycle =
    hasPermission(globalStates.user, PERMISSIONS.IDENTITY_USERS_MANAGE) ||
    hasPermission(globalStates.user, PERMISSIONS.IDENTITY_JML_MANAGE);

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

        {!canManageLifecycle ? (
          <Notice tone="info">
            You can review this lifecycle state, but managing activation,
            suspension, or archival requires identity user or JML management
            permission.
          </Notice>
        ) : null}

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
                !canManageLifecycle ||
                state.fetchingEmployeeData ||
                employee.status === "suspended"
              }
              clickAction={() =>
                changeStatus(
                  "suspend",
                  "Suspended from Identity app lifecycle panel.",
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
                !canManageLifecycle ||
                state.fetchingEmployeeData ||
                employee.status === "archived"
              }
              clickAction={() =>
                changeStatus(
                  "archive",
                  "Archived from Identity app lifecycle panel.",
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
              disabled={
                !canManageLifecycle ||
                state.fetchingEmployeeData ||
                employee.status === "active"
              }
              clickAction={() =>
                changeStatus(
                  "activate",
                  "Activated from Identity app lifecycle panel.",
                )
              }
            />
          </div>
        </div>
      </div>
    </div>
  );
}
