"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { InputArea } from "@/global-components/layout/FormWrapper";
import {
  getISOCalendarDate,
  SingleDatePicker,
} from "@/global-components/layout/date";
import SearchableSelect from "@/global-components/ui/SearchableSelect";
import useActiveOrganizationCatalog from "@/features/policies-and-configuration/hooks/useActiveOrganizationCatalog";
import { MOVE_REASONS } from "../../../constants/MOVE_REASONS";
import useMoverWorkflow from "../../../hooks/useMoverWorkflow";
import useManagerCandidateSearch from "../../../hooks/useManagerCandidateSearch";

export default function SpecifyChange() {
  const workflow = useMoverWorkflow();
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [jobProfileSearch, setJobProfileSearch] = useState("");
  const [managerSearch, setManagerSearch] = useState("");
  const catalog = useActiveOrganizationCatalog(
    workflow.change.departmentId,
    departmentSearch,
    jobProfileSearch,
  );
  const managerCandidates = useManagerCandidateSearch(
    managerSearch,
    workflow.selectedUser?.id,
  );
  const today = getISOCalendarDate();

  return (
    <div className="vertical-layout__outer">
      <div className="text-style__small-text text-(--primary-grey)">
        Enter the new employment details. Leave a field blank to keep its
        current value. Changes will be compared in the next step.
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="vertical-layout__inner">
          <div>NEW DEPARTMENT</div>
          <SearchableSelect
            value={workflow.change.departmentId}
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
                workflow.selectDepartment(
                  department.id,
                  department.code,
                  department.name,
                );
              }
            }}
            placeholder={
              catalog.isLoading ? "Loading departments..." : "Select department"
            }
            searchPlaceholder="Search departments"
            isLoading={catalog.isLoadingDepartments}
            selectedLabel={workflow.change.departmentName}
            onSearchChange={setDepartmentSearch}
          />
        </div>

        <div className="vertical-layout__inner">
          <div>NEW JOB TITLE</div>
          <SearchableSelect
            value={workflow.change.jobProfileId}
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
                workflow.selectJobProfile(profile.id, profile.title);
              }
            }}
            placeholder={
              !workflow.change.departmentId
                ? "Select a department first"
                : catalog.isLoading
                  ? "Loading job profiles..."
                  : "Select job profile"
            }
            searchPlaceholder="Search job profiles"
            disabled={!workflow.change.departmentId}
            isLoading={catalog.isLoadingJobProfiles}
            selectedLabel={workflow.change.jobTitle}
            onSearchChange={setJobProfileSearch}
          />
        </div>

        <div className="vertical-layout__inner">
          <div>NEW MANAGER</div>
          <SearchableSelect
            value={workflow.change.managerId}
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
              if (manager) workflow.selectManager(manager.id, manager.name);
            }}
            placeholder="Select manager"
            searchPlaceholder="Search managers by name or email"
            selectedLabel={workflow.change.managerName}
            isLoading={managerCandidates.isLoading}
            emptyMessage="No eligible managers found. Mark the appropriate job profile as a people-manager position first."
            onSearchChange={setManagerSearch}
          />
        </div>

        <div className="vertical-layout__inner">
          <div>REASON FOR MOVE</div>
          <SearchableSelect
            value={workflow.change.reasonCode}
            options={MOVE_REASONS.map((reason) => ({
              value: reason.value,
              label: reason.label,
            }))}
            onChange={(value) => {
              const reason = MOVE_REASONS.find(
                (candidate) => candidate.value === value,
              );
              if (reason) workflow.selectReason(reason.value);
            }}
            placeholder="Select move reason"
            searchPlaceholder="Search move reasons"
          />
        </div>

        <div className="vertical-layout__inner">
          <div>EFFECTIVE DATE</div>
          <SingleDatePicker
            value={workflow.change.effectiveDate}
            maxDate={today}
            label="Select effective date"
            onChange={(value) => workflow.updateChange("effectiveDate", value)}
          />
        </div>

        {workflow.change.reasonCode && (
          <div className="vertical-layout__inner col-span-2">
            <div>
              {workflow.change.reasonCode === "other"
                ? "REASON DETAILS"
                : "ADDITIONAL DETAILS (OPTIONAL)"}
            </div>
            <InputArea
              val={workflow.change.reasonDetails}
              changeFunc={(value) =>
                workflow.updateChange("reasonDetails", value)
              }
            />
          </div>
        )}
      </div>

      {(catalog.error || managerCandidates.error) && (
        <div className="rounded-lg border border-(--primary-red)/30 bg-(--primary-red)/10 p-3 text-style__small-text text-(--primary-red)">
          {catalog.error || managerCandidates.error}
        </div>
      )}

      {(!workflow.hasEmploymentChange ||
        !workflow.hasReason ||
        !workflow.hasEffectiveDate ||
        !workflow.hasCompleteAssignmentSelection) && (
        <div className="horizontal-layout p-2.5 border border-(--primary-yellow) bg-(--primary-yellow-faded)/10 text-(--primary-yellow) rounded-[10px]">
          <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} />
          <div className="text-style__small-text">
            {!workflow.hasCompleteAssignmentSelection
              ? "Select a job profile for the chosen department."
              : !workflow.hasEmploymentChange
              ? "Change at least one assignment field to continue."
              : !workflow.hasReason
                ? workflow.change.reasonCode === "other"
                  ? "Provide details for the Other move reason."
                  : "Select a structured reason for the move."
                : "Select the date on which this move became effective."}
          </div>
        </div>
      )}
    </div>
  );
}
