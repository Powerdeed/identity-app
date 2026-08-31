"use client";

import { useState } from "react";
import { InputArea } from "@/global-components/layout/FormWrapper";
import {
  getISOCalendarDate,
  SingleDatePicker,
} from "@/global-components/layout/date";
import Notice from "@/global-components/ui/Notice";
import SearchableSelect from "@/global-components/ui/SearchableSelect";
import useActiveOrganizationCatalog from "@/features/policies-and-configuration/hooks/useActiveOrganizationCatalog";
import useManagerCandidateSearch from "../../../hooks/useManagerCandidateSearch";
import useJML from "../../../hooks/useJML";

const employmentTypes = [
  ["full_time", "Full-time"],
  ["part_time", "Part-time"],
  ["contractor", "Contractor"],
  ["intern", "Intern"],
  ["temporary", "Temporary"],
] as const;

export default function Employment() {
  const { state, dispatch } = useJML();
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [jobProfileSearch, setJobProfileSearch] = useState("");
  const [managerSearch, setManagerSearch] = useState("");
  const catalog = useActiveOrganizationCatalog(
    state.employment.departmentId,
    departmentSearch,
    jobProfileSearch,
  );
  const managerCandidates = useManagerCandidateSearch(managerSearch);

  return (
    <div className="vertical-layout__outer">
      <Notice>
        Select the employee&apos;s catalog-backed assignment. Department and
        job profile are stored as relational records in identity-service.
      </Notice>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="vertical-layout__inner">
          <div>DEPARTMENT</div>
          <SearchableSelect
            value={state.employment.departmentId}
            options={catalog.departments.map((department) => ({
              value: department.id,
              label: department.name,
              description: department.code,
            }))}
            onChange={(departmentId) => {
              const department = catalog.departments.find(
                (candidate) => candidate.id === departmentId,
              );
              if (department) {
                dispatch({
                  type: "employment/department-select",
                  id: department.id,
                  code: department.code,
                  name: department.name,
                });
              }
            }}
            placeholder={
              catalog.isLoadingDepartments
                ? "Loading departments..."
                : "Select department"
            }
            searchPlaceholder="Search departments"
            selectedLabel={state.employment.departmentName}
            isLoading={catalog.isLoadingDepartments}
            onSearchChange={setDepartmentSearch}
          />
        </div>

        <div className="vertical-layout__inner">
          <div>JOB PROFILE</div>
          <SearchableSelect
            value={state.employment.jobProfileId}
            options={catalog.jobProfiles.map((profile) => ({
              value: profile.id,
              label: profile.title,
              description: profile.code,
            }))}
            onChange={(jobProfileId) => {
              const profile = catalog.jobProfiles.find(
                (candidate) => candidate.id === jobProfileId,
              );
              if (profile) {
                dispatch({
                  type: "employment/job-profile-select",
                  id: profile.id,
                  title: profile.title,
                });
              }
            }}
            placeholder={
              !state.employment.departmentId
                ? "Select a department first"
                : catalog.isLoadingJobProfiles
                  ? "Loading job profiles..."
                  : "Select job profile"
            }
            searchPlaceholder="Search job profiles"
            disabled={!state.employment.departmentId}
            selectedLabel={state.employment.jobTitle}
            isLoading={catalog.isLoadingJobProfiles}
            onSearchChange={setJobProfileSearch}
          />
        </div>

        <div className="vertical-layout__inner">
          <div>MANAGER</div>
          <SearchableSelect
            value={state.employment.managerId}
            options={managerCandidates.managers.map((manager) => ({
              value: manager.id,
              label: manager.name,
              description: [manager.employment?.jobTitle, manager.email]
                .filter(Boolean)
                .join(" - "),
            }))}
            onChange={(managerId) => {
              const manager = managerCandidates.managers.find(
                (candidate) => candidate.id === managerId,
              );
              if (manager) {
                dispatch({
                  type: "employment/manager-select",
                  id: manager.id,
                  name: manager.name,
                });
              }
            }}
            placeholder="Select manager"
            searchPlaceholder="Search managers by name or email"
            selectedLabel={state.employment.managerName}
            isLoading={managerCandidates.isLoading}
            emptyMessage="No eligible managers found. Mark the appropriate job profile as a people-manager position first."
            onSearchChange={setManagerSearch}
          />
        </div>

        <div className="vertical-layout__inner">
          <div>START DATE</div>
          <SingleDatePicker
            value={state.employment.startDate}
            maxDate={getISOCalendarDate()}
            label="Select start date"
            onChange={(value) =>
              dispatch({
                type: "employment/update",
                field: "startDate",
                value,
              })
            }
          />
        </div>

        <div className="vertical-layout__inner">
          <div>EMPLOYMENT TYPE</div>
          <SearchableSelect
            value={state.employment.employmentType}
            options={employmentTypes.map(([value, label]) => ({
              value,
              label,
            }))}
            onChange={(value) =>
              dispatch({
                type: "employment/update",
                field: "employmentType",
                value,
              })
            }
            placeholder="Select employment type"
            searchPlaceholder="Search employment types"
          />
        </div>

        <div className="vertical-layout__inner">
          <div>WORK LOCATION</div>
          <InputArea
            val={state.employment.workLocation}
            changeFunc={(value) =>
              dispatch({
                type: "employment/update",
                field: "workLocation",
                value,
              })
            }
          />
        </div>
      </div>

      {(catalog.error || managerCandidates.error) && (
        <Notice tone="danger">{catalog.error || managerCandidates.error}</Notice>
      )}

      {(!state.employment.departmentId ||
        !state.employment.jobProfileId ||
        !state.employment.startDate) && (
        <Notice tone="warning">
          {!state.employment.departmentId
            ? "Select a department."
            : !state.employment.jobProfileId
              ? "Select a job profile for the chosen department."
              : "Select a start date."}
        </Notice>
      )}
    </div>
  );
}
