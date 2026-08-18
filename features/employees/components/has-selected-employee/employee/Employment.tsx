"use client";

import useEmployees from "@/features/employees/hooks/useEmployees";
import { formatLabel } from "@/features/employees/utils/formatLabel";
import Button from "@/global-components/ui/Button";
import ContainerTitle from "@/global-components/ui/ContainerTitle";
import { getDateFormatted } from "@/globals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmploymentEditor from "../EmploymentEditor";
import { useMemo } from "react";
import type { EmploymentDetails } from "@/features/employees/types/employeesTypes";
import { toEmploymentDetails } from "@/features/employees/utils/employment";

export default function Employment() {
  const { state } = useEmployees();
  const employee = state.selectedEmployee;
  const { setEmploymentDetails, setIsEmployeeDetailsOpen } = state;

  const formatOptionalDate = (value?: string) =>
    value ? getDateFormatted(value) : undefined;

  const details: EmploymentDetails = useMemo(
    () => (employee ? toEmploymentDetails(employee) : ({} as EmploymentDetails)),
    [employee],
  );

  if (!employee) return null;

  return (
    <div className="relative w-150 feature-container-vertical text-style__body">
      <ContainerTitle
        title="Employment Details"
        el={
          <Button
            buttonText="Edit"
            buttonType="light"
            clickAction={() => {
              setEmploymentDetails(details);
              setIsEmployeeDetailsOpen(true);
            }}
            icon={<FontAwesomeIcon icon={["far", "pen-to-square"]} />}
          />
        }
      />

      <div className="grid grid-cols-2 gap-5">
        {Object.entries(details).map(([title, value]) => (
          <div key={title}>
            <div className="text-(--primary-grey)">{title}</div>
            <div className="text-style__small-text text-(--primary-blue)">
              {title === "START DATE" || title === "END DATE"
                ? formatLabel(formatOptionalDate(value))
                : formatLabel(value)}
            </div>
          </div>
        ))}
      </div>

      {state.isEmployeeDetailsOpen && (
        <div
          className="overlay"
          onClick={() => setIsEmployeeDetailsOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-white rounded-[10px]"
          >
            <EmploymentEditor />
          </div>
        </div>
      )}
    </div>
  );
}
