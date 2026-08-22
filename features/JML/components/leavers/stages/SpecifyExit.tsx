"use client";

import { InputArea } from "@/global-components/layout/FormWrapper";
import {
  getISOCalendarDate,
  SingleDatePicker,
} from "@/global-components/layout/date";
import Notice from "@/global-components/ui/Notice";
import SearchableSelect from "@/global-components/ui/SearchableSelect";
import { LEAVER_REASONS } from "../../../constants/LEAVER_REASONS";
import useLeaverWorkflow from "../../../hooks/useLeaverWorkflow";

const statusOptions = [
  {
    value: "suspended",
    label: "Suspended",
    description: "Blocks normal access while keeping the profile recoverable.",
  },
  {
    value: "archived",
    label: "Archived",
    description: "Use when the account should be treated as fully closed.",
  },
];

export default function SpecifyExit() {
  const workflow = useLeaverWorkflow();
  const today = getISOCalendarDate();

  return (
    <div className="vertical-layout__outer">
      <div className="text-style__small-text text-(--primary-grey)">
        Capture the exit reason and choose the security actions that should run
        when the employee is offboarded.
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="vertical-layout__inner">
          <div>EXIT REASON</div>
          <SearchableSelect
            value={workflow.exit.reasonCode}
            options={LEAVER_REASONS.map((reason) => ({
              value: reason.value,
              label: reason.label,
            }))}
            onChange={(value) => {
              const reason = LEAVER_REASONS.find(
                (candidate) => candidate.value === value,
              );
              if (reason) workflow.selectReason(reason.value);
            }}
            placeholder="Select exit reason"
            searchPlaceholder="Search exit reasons"
          />
        </div>

        <div className="vertical-layout__inner">
          <div>EFFECTIVE DATE</div>
          <SingleDatePicker
            value={workflow.exit.effectiveDate}
            maxDate={today}
            label="Select effective date"
            onChange={(value) => workflow.updateExit("effectiveDate", value)}
          />
        </div>

        <div className="vertical-layout__inner">
          <div>PROFILE STATUS</div>
          <SearchableSelect
            value={workflow.exit.targetStatus}
            options={statusOptions}
            onChange={(value) =>
              workflow.updateExit(
                "targetStatus",
                value as "suspended" | "archived",
              )
            }
            placeholder="Select profile status"
            searchPlaceholder="Search statuses"
          />
        </div>

        <div className="vertical-layout__inner">
          <div>SECURITY ACTIONS</div>
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={workflow.exit.disableKeycloak}
              onChange={(event) =>
                workflow.updateExit("disableKeycloak", event.target.checked)
              }
            />
            <span>Disable Keycloak login</span>
          </label>
          <label className="flex items-center gap-2.5">
            <input
              type="checkbox"
              checked={workflow.exit.removeKeycloakGroups}
              onChange={(event) =>
                workflow.updateExit(
                  "removeKeycloakGroups",
                  event.target.checked,
                )
              }
            />
            <span>Remove Keycloak groups</span>
          </label>
        </div>

        {workflow.exit.reasonCode && (
          <div className="vertical-layout__inner col-span-2">
            <div>
              {workflow.exit.reasonCode === "other"
                ? "REASON DETAILS"
                : "ADDITIONAL DETAILS (OPTIONAL)"}
            </div>
            <InputArea
              val={workflow.exit.reasonDetails}
              changeFunc={(value) =>
                workflow.updateExit("reasonDetails", value)
              }
            />
          </div>
        )}
      </div>

      {(!workflow.hasReason || !workflow.hasEffectiveDate) && (
        <Notice tone="warning">
          {!workflow.hasReason
            ? workflow.exit.reasonCode === "other"
              ? "Provide details for the Other exit reason."
              : "Select a structured reason for the exit."
            : "Select the date on which this exit became effective."}
        </Notice>
      )}
    </div>
  );
}
