"use client";

import useEmployees from "@/features/employees/hooks/useEmployees";
import { formatLabel } from "@/features/employees/utils/formatLabel";
import Button from "@/global-components/ui/Button";
import ContainerTitle from "@/global-components/ui/ContainerTitle";
import { getDateFormatted } from "@/globals";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import EmploymentEditor from "../EmploymentEditor";
import { useEffect, useMemo } from "react";
import { EmploymentDetails } from "@/features/employees/context/EmployeesProvider";
import { DepartmentId, EmploymentType, SeniorityLevel } from "@/app/auth";

export default function Employment() {
  const { state } = useEmployees();
  const employee = state.selectedEmployee;
  const { setEmploymentDetails, setIsEmployeeDetailsOpen } = state;

  const employment = employee?.employment;
  const formatOptionalDate = (value?: string) =>
    value ? getDateFormatted(value) : undefined;
  const formatDateInput = (value?: string) =>
    value ? new Date(value).toISOString().slice(0, 10) : "";

  const details: EmploymentDetails = useMemo(
    () => ({
      "EMPLOYEE NUMBER": employment?.employeeNumber || "",
      DEPARTMENT: employment?.departmentId || ("" as DepartmentId),
      TEAM: employment?.teamIds?.join(", ") || "",
      "JOB TITLE": (employment?.jobTitle ?? employee?.profile?.jobTitle) || "",
      "POSITION CODE": employment?.positionCode || "",
      SENIORITY: employment?.seniorityLevel || ("" as SeniorityLevel),
      "EMPLOYEE TYPE": employment?.employmentType || ("" as EmploymentType),
      "WORK LOCATION":
        (employment?.workLocation ?? employee?.profile?.location) || "",
      "START DATE": formatDateInput(employment?.startDate),
      "END DATE": formatDateInput(employment?.endDate),
      MANAGER: employment?.managerId || "",
    }),
    [employment, employee?.profile],
  );

  useEffect(() => {
    const getEmployeeDetails = () => setEmploymentDetails(details);

    getEmployeeDetails();
  }, [details, setEmploymentDetails]);

  if (!employee) return null;

  return (
    <div className="relative w-150 feature-container-vertical text-style__body">
      <ContainerTitle
        title="Employment Details"
        el={
          <Button
            buttonText="Edit"
            buttonType="light"
            clickAction={() => setIsEmployeeDetailsOpen(true)}
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
