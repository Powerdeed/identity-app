"use client";

import useEmployees from "../../hooks/useEmployees";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { EmploymentDetails } from "../../context/EmployeesProvider";
import Button from "@/global-components/ui/Button";
import { updateEmployeeEmployment } from "../../services/employee";
import { execute } from "@/lib";
import type { EmploymentProfile } from "@/app/auth";
import { DateRangePicker } from "@/global-components/layout/date";

const dateFields: Array<keyof EmploymentDetails> = ["START DATE", "END DATE"];

const parseDateInput = (value?: string) => {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  return new Date(year, month - 1, day);
};

const formatDateInput = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

export default function EmploymentEditor() {
  const { state } = useEmployees();
  const employee = state.selectedEmployee;

  const modifyEmployeeDetails = (
    key: keyof EmploymentDetails,
    value: EmploymentDetails[keyof EmploymentDetails],
  ) => {
    state.setEmploymentDetails((prev) => {
      if (!prev) return null;
      return { ...prev, [key]: value };
    });
  };

  const closeEditor = () => state.setIsEmployeeDetailsOpen(false);

  const toEmploymentProfile = (
    details: EmploymentDetails,
  ): EmploymentProfile => ({
    employeeNumber: details["EMPLOYEE NUMBER"] || undefined,
    departmentId: details.DEPARTMENT || undefined,
    teamIds: details.TEAM
      ? details.TEAM.split(",")
          .map((team) => team.trim())
          .filter(Boolean)
      : undefined,
    managerId: details.MANAGER || undefined,
    jobTitle: details["JOB TITLE"] || undefined,
    positionCode: details["POSITION CODE"] || undefined,
    seniorityLevel: details.SENIORITY || undefined,
    employmentType: details["EMPLOYEE TYPE"] || undefined,
    workLocation: details["WORK LOCATION"] || undefined,
    startDate: details["START DATE"] || undefined,
    endDate: details["END DATE"] || undefined,
  });

  const saveEmploymentDetails = () => {
    if (!employee || !state.employmentDetails) return;

    execute(
      () =>
        updateEmployeeEmployment(
          employee.id,
          toEmploymentProfile(state.employmentDetails as EmploymentDetails),
        ),
      {
        setLoading: state.setFetchingEmployeeData,
        setError: state.setFetchingEmployeeDataError,
        onSuccess: (updatedEmployee) => {
          state.setSelectedEmployee(updatedEmployee);
          closeEditor();
        },
      },
    );
  };

  return (
    <div
      className="min-h-80 p-5 vertical-layout__outer text-style__body"
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <div className="text-style__big-text border-b border-(--terciary-grey) pb-2.5 flex">
        <div className="flex-1">Employment details editor</div>
        <FontAwesomeIcon
          icon={["fas", "xmark"]}
          className="buttonize p-2.5 hover:text-(--primary-blue) rounded-[10px] hover:rotate-90"
          onClick={closeEditor}
        />
      </div>

      {state.fetchingEmployeeDataError && (
        <div className="rounded-[10px] border border-(--primary-red)/30 bg-(--primary-red)/10 p-3 text-style__small-text text-(--primary-red)">
          {state.fetchingEmployeeDataError}
        </div>
      )}

      <div className="grid grid-cols-2 gap-5">
        {state.employmentDetails &&
          Object.entries(state.employmentDetails).map(
            ([employmentField, employeeFieldValue]) =>
              dateFields.includes(employmentField as keyof EmploymentDetails) ? null : (
              <div key={employmentField} className="w-full">
                <div>{employmentField}</div>

                <input
                  type="text"
                  className="input-style w-full"
                  value={employeeFieldValue ?? ""}
                  disabled={state.fetchingEmployeeData}
                  onChange={(e) =>
                    modifyEmployeeDetails(
                      employmentField as keyof EmploymentDetails,
                      e.target
                        .value as EmploymentDetails[keyof EmploymentDetails],
                    )
                  }
                />
              </div>
            ),
          )}
      </div>

      {state.employmentDetails && (
        <div>
          <div className="mb-2">EMPLOYMENT PERIOD</div>
          <DateRangePicker
            startDate={parseDateInput(state.employmentDetails["START DATE"])}
            endDate={parseDateInput(state.employmentDetails["END DATE"])}
            onChange={({ startDate, endDate }) => {
              state.setEmploymentDetails((prev) => {
                if (!prev) return null;

                return {
                  ...prev,
                  "START DATE": formatDateInput(startDate),
                  "END DATE": formatDateInput(endDate),
                };
              });
            }}
          />
        </div>
      )}

      {!state.employmentDetails && <div>No details to edit</div>}

      <div className="horizontal-layout justify-end border-t border-(--terciary-grey) pt-5">
        <Button
          buttonText="Cancel"
          buttonType="light"
          clickAction={closeEditor}
          disabled={state.fetchingEmployeeData}
        />
        <Button
          buttonText={state.fetchingEmployeeData ? "Saving..." : "Save"}
          clickAction={saveEmploymentDetails}
          disabled={!employee || !state.employmentDetails || state.fetchingEmployeeData}
        />
      </div>
    </div>
  );
}
