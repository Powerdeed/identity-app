"use client";

import useEmployees from "../../hooks/useEmployees";
import useEmploymentEditor from "../../hooks/useEmploymentEditor";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { EmploymentDetails } from "../../types/employeesTypes";
import Button from "@/global-components/ui/Button";
import { DateRangePicker } from "@/global-components/layout/date";
import {
  employmentDateFields,
  parseDateInput,
} from "../../utils/employment";

export default function EmploymentEditor() {
  const { state } = useEmployees();
  const editor = useEmploymentEditor();
  const employee = state.selectedEmployee;

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
          onClick={editor.close}
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
              employmentDateFields.includes(employmentField as keyof EmploymentDetails) ? null : (
              <div key={employmentField} className="w-full">
                <div>{employmentField}</div>

                <input
                  type="text"
                  className="input-style w-full"
                  value={employeeFieldValue ?? ""}
                  disabled={state.fetchingEmployeeData}
                  onChange={(e) =>
                    editor.updateField(
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
            onChange={({ startDate, endDate }) =>
              editor.updatePeriod(startDate, endDate)
            }
          />
        </div>
      )}

      {!state.employmentDetails && <div>No details to edit</div>}

      <div className="horizontal-layout justify-end border-t border-(--terciary-grey) pt-5">
        <Button
          buttonText="Cancel"
          buttonType="light"
          clickAction={editor.close}
          disabled={state.fetchingEmployeeData}
        />
        <Button
          buttonText={state.fetchingEmployeeData ? "Saving..." : "Save"}
          clickAction={editor.save}
          disabled={!employee || !state.employmentDetails || state.fetchingEmployeeData}
        />
      </div>
    </div>
  );
}
