"use client";

import {
  LIFECYCLE_STATUSES,
  LifecycleStatus,
} from "@/features/employees/constants/LIFECYCLE_STATUSES";
import Button from "@/global-components/ui/Button";
import ContainerTitle from "@/global-components/ui/ContainerTitle";
import { useEffect, useState } from "react";

export default function Lifecycle({
  employeeStatus = "Active",
}: {
  employeeStatus?: LifecycleStatus;
}) {
  const [currentStatus, setCurrentStatus] = useState<LifecycleStatus | null>(
    null,
  );

  useEffect(() => {
    const setStatus = () => {
      if (employeeStatus) setCurrentStatus(employeeStatus);
    };
    setStatus();
  }, [employeeStatus]);

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
            {/* TODO: Add functionality to this code */}
            <Button buttonText="Suspend" buttonType="red" />
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
            {/* TODO: Add functionality to this code */}
            <Button buttonText="Archive" buttonType="red" />
          </div>
        </div>
      </div>
    </div>
  );
}
