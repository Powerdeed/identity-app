"use client";

import { useState, type ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useEmployees from "../../hooks/useEmployees";
import useEmploymentEditor from "../../hooks/useEmploymentEditor";
import type { EmploymentDetails } from "../../types/employeesTypes";
import Button from "@/global-components/ui/Button";
import { DateRangePicker } from "@/global-components/layout/date";
import { parseDateInput } from "../../utils/employment";
import { useActiveOrganizationCatalog } from "@/features/policies-and-configuration";
import useManagerCandidateSearch from "@/features/JML/hooks/useManagerCandidateSearch";
import SearchableSelect from "@/global-components/ui/SearchableSelect";

const employmentTypes = [
  ["full_time", "Full-time"],
  ["part_time", "Part-time"],
  ["contractor", "Contractor"],
  ["intern", "Intern"],
  ["temporary", "Temporary"],
] as const;

export default function EmploymentEditor() {
  const { state } = useEmployees();
  const editor = useEmploymentEditor();
  const details = state.employmentDetails;
  const employee = state.selectedEmployee;
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [jobProfileSearch, setJobProfileSearch] = useState("");
  const [managerSearch, setManagerSearch] = useState("");
  const catalog = useActiveOrganizationCatalog(
    details?.DEPARTMENT,
    departmentSearch,
    jobProfileSearch,
  );
  const managerCandidates = useManagerCandidateSearch(
    managerSearch,
    employee?.id,
  );
  const currentProfile = catalog.jobProfiles.find(
    (profile) => profile.id === details?.["JOB PROFILE"],
  );
  const hasIncompleteAssignment = Boolean(
    details?.DEPARTMENT && !details["JOB PROFILE"],
  );
  const update = (field: keyof EmploymentDetails, value: string) =>
    editor.updateField(
      field,
      value as EmploymentDetails[keyof EmploymentDetails],
    );

  return (
    <div
      className="min-h-80 p-5 vertical-layout__outer text-style__body"
      onClick={(event) => event.stopPropagation()}
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

      {details ? (
        <div className="grid grid-cols-2 gap-5">
          <ReadOnlyField
            label="EMPLOYEE NUMBER"
            value={details["EMPLOYEE NUMBER"] || "Not assigned"}
          />
          <ReadOnlyField
            label="JOB TITLE"
            value={
              currentProfile?.title ??
              employee?.employment?.jobTitle ??
              "Select a job profile"
            }
          />
          <Field label="DEPARTMENT">
            <SearchableSelect
              value={details.DEPARTMENT}
              options={catalog.departments.map((department) => ({
                value: department.id,
                label: department.name,
                description: department.code,
              }))}
              onChange={(departmentId) => {
                update("DEPARTMENT", departmentId);
                update("JOB PROFILE", "");
              }}
              placeholder="Select department"
              searchPlaceholder="Search departments"
              selectedLabel={employee?.employment?.departmentName}
              isLoading={catalog.isLoadingDepartments}
              onSearchChange={setDepartmentSearch}
            />
          </Field>
          <Field label="JOB PROFILE">
            <SearchableSelect
              value={details["JOB PROFILE"]}
              options={catalog.jobProfiles.map((profile) => ({
                value: profile.id,
                label: profile.title,
                description: profile.code,
              }))}
              onChange={(jobProfileId) => update("JOB PROFILE", jobProfileId)}
              placeholder={
                details.DEPARTMENT
                  ? "Select job profile"
                  : "Select a department first"
              }
              searchPlaceholder="Search job profiles"
              selectedLabel={employee?.employment?.jobTitle}
              disabled={!details.DEPARTMENT}
              isLoading={catalog.isLoadingJobProfiles}
              onSearchChange={setJobProfileSearch}
            />
          </Field>
          <ReadOnlyField
            label="POSITION CODE"
            value={
              currentProfile?.code ?? employee?.employment?.positionCode ?? "-"
            }
          />
          <ReadOnlyField
            label="SENIORITY"
            value={
              currentProfile?.seniorityLevel?.replaceAll("_", " ") ??
              employee?.employment?.seniorityLevel?.replaceAll("_", " ") ??
              "-"
            }
          />
          <Field label="MANAGER">
            <SearchableSelect
              value={details.MANAGER}
              options={managerCandidates.managers.map((manager) => ({
                value: manager.id,
                label: manager.name,
                description: [manager.employment?.jobTitle, manager.email]
                  .filter(Boolean)
                  .join(" - "),
              }))}
              onChange={(managerId) => update("MANAGER", managerId)}
              placeholder="Select manager"
              searchPlaceholder="Search eligible managers"
              selectedLabel={employee?.employment?.managerName}
              isLoading={managerCandidates.isLoading}
              emptyMessage="No eligible managers found. Assign a people-manager job profile first."
              onSearchChange={setManagerSearch}
            />
          </Field>
          <Field label="EMPLOYMENT TYPE">
            <SearchableSelect
              value={details["EMPLOYEE TYPE"]}
              options={employmentTypes.map(([value, label]) => ({
                value,
                label,
              }))}
              onChange={(value) => update("EMPLOYEE TYPE", value)}
              placeholder="Select employment type"
              searchPlaceholder="Search employment types"
            />
          </Field>
          <Field label="TEAM">
            <input
              type="text"
              className="input-style w-full"
              value={details.TEAM}
              disabled={state.fetchingEmployeeData}
              onChange={(event) => update("TEAM", event.target.value)}
            />
          </Field>
          <Field label="WORK LOCATION">
            <input
              type="text"
              className="input-style w-full"
              value={details["WORK LOCATION"]}
              disabled={state.fetchingEmployeeData}
              onChange={(event) => update("WORK LOCATION", event.target.value)}
            />
          </Field>
        </div>
      ) : (
        <div>No details to edit</div>
      )}

      {details && (
        <div>
          <div className="mb-2">EMPLOYMENT PERIOD</div>
          <DateRangePicker
            startDate={parseDateInput(details["START DATE"])}
            endDate={parseDateInput(details["END DATE"])}
            onChange={({ startDate, endDate }) =>
              editor.updatePeriod(startDate, endDate)
            }
          />
        </div>
      )}
      {hasIncompleteAssignment && (
        <div className="text-style__small-text text-(--primary-red)">
          Select a Job Profile for the selected Department before saving.
        </div>
      )}
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
          disabled={
            !employee ||
            !details ||
            hasIncompleteAssignment ||
            state.fetchingEmployeeData
          }
        />
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="w-full">
      <div>{label}</div>
      {children}
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="w-full">
      <div>{label}</div>
      <div className="input-style flex min-h-10 w-full items-center text-(--primary-grey)">
        {value}
      </div>
    </div>
  );
}
