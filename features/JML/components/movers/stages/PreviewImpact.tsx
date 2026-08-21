"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatLabel } from "@/features/employees/utils/formatLabel";
import { getDateFormatted } from "@/global-components/layout/date";
import { getMoveReasonLabel } from "../../../constants/MOVE_REASONS";
import useMoverWorkflow from "../../../hooks/useMoverWorkflow";

export default function PreviewImpact() {
  const workflow = useMoverWorkflow();
  const roles = workflow.selectedUser?.access?.roles ?? [];
  const assignmentChanged = workflow.changeRows.some((row) => row.changed);

  return (
    <div className="vertical-layout__outer text-left">
      <div className="horizontal-layout p-2.5 border border-(--secondary-blue) bg-(--secondary-blue)/10 text-(--secondary-blue) rounded-[10px]">
        <FontAwesomeIcon icon={["fas", "info-circle"]} />
        <div className="text-style__small-text">
          Review the employment changes and current access before continuing.
          Active sessions will be revoked so the employee receives a fresh
          entitlement snapshot on the next login.
        </div>
      </div>

      <div className="feature-container-vertical">
        <div className="w-full text-style__body--bold">Move Record</div>
        <div className="horizontal-layout border-b border-(--terciary-grey) pb-2.5">
          <div className="flex-1 text-(--primary-grey)">REASON</div>
          <div>
            {workflow.change.reasonCode
              ? getMoveReasonLabel(workflow.change.reasonCode)
              : "-"}
          </div>
        </div>
        {workflow.change.reasonDetails && (
          <div className="horizontal-layout border-b border-(--terciary-grey) pb-2.5">
            <div className="flex-1 text-(--primary-grey)">DETAILS</div>
            <div>{workflow.change.reasonDetails}</div>
          </div>
        )}
        <div className="horizontal-layout">
          <div className="flex-1 text-(--primary-grey)">EFFECTIVE DATE</div>
          <div>
            {getDateFormatted(
              `${workflow.change.effectiveDate}T00:00:00`,
            )}
          </div>
        </div>
      </div>

      <div className="feature-container-vertical">
        <div className="w-full text-style__body--bold">Employment Changes</div>
        <div className="horizontal-layout text-style__body text-(--primary-grey) border-b border-(--terciary-grey) pb-2.5">
          <div className="flex-1">FIELD</div>
          <div className="flex-1">CURRENT</div>
          <div className="flex-1">NEW</div>
        </div>

        {workflow.changeRows.map((row, index) => (
          <div
            key={row.key}
            className={`horizontal-layout text-style__body py-2.5 ${index + 1 !== workflow.changeRows.length ? "border-b border-(--terciary-grey)" : ""} ${row.changed ? "bg-(--terciary-grey)/30" : ""}`}
          >
            <div className="flex-1">{row.label}</div>
            <div className="flex-1 text-(--primary-grey)">
              {row.changed ? (
                <del>{formatLabel(row.current)}</del>
              ) : (
                formatLabel(row.current)
              )}
            </div>
            <div className={row.changed ? "flex-1 text-(--secondary-blue)" : "flex-1"}>
              {formatLabel(row.next)}
            </div>
          </div>
        ))}
      </div>

      <div className="feature-container-vertical">
        <div className="w-full text-style__body--bold">Access Consequences</div>

        <div className="vertical-layout__inner border-b border-(--terciary-grey) pb-2.5">
          <div className="text-(--primary-grey)">KEYCLOAK GROUPS RETAINED</div>
          <div className="horizontal-layout flex-wrap text-style__small-text">
            {workflow.keycloakGroups.map((group) => (
              <div
                key={group.id}
                className="px-2.5 border border-(--secondary-blue) bg-(--secondary-blue)/10 text-(--secondary-blue) rounded-[10px]"
              >
                {group.name}
              </div>
            ))}
            {!workflow.keycloakGroups.length && <div>None</div>}
          </div>
        </div>

        <div className="vertical-layout__inner border-b border-(--terciary-grey) pb-2.5">
          <div className="text-(--primary-yellow)">ROLES REQUIRING REVIEW</div>
          <div className="horizontal-layout flex-wrap text-style__small-text">
            {assignmentChanged && roles.length ? (
              roles.map((role) => (
                <div
                  key={role.roleId}
                  className="px-2.5 border border-(--primary-yellow) bg-(--primary-yellow-faded)/30 text-(--primary-yellow) rounded-[10px]"
                >
                  {role.roleId}
                </div>
              ))
            ) : (
              <div className="text-(--primary-grey)">None</div>
            )}
          </div>
          {assignmentChanged && roles.length > 0 && (
            <div className="text-style__small-text text-(--primary-grey)">
              Existing access is preserved. Review these roles against the new
              assignment instead of removing access automatically.
            </div>
          )}
        </div>

        <div className="horizontal-layout p-2.5 text-style__small-text border border-(--primary-red) bg-(--primary-red-faded)/10 text-(--primary-red) rounded-[10px]">
          <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} />
          <div>
            All active Powerdeed sessions will be revoked on confirmation.
          </div>
        </div>
      </div>
    </div>
  );
}
