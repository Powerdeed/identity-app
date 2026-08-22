"use client";

import { formatLabel } from "@/features/employees/utils/formatLabel";
import { getDateFormatted } from "@/global-components/layout/date";
import Notice from "@/global-components/ui/Notice";
import { getLeaverReasonLabel } from "../../../constants/LEAVER_REASONS";
import useLeaverWorkflow from "../../../hooks/useLeaverWorkflow";

export default function PreviewImpact() {
  const workflow = useLeaverWorkflow();
  const employee = workflow.selectedUser;
  const roles = employee?.access?.roles ?? [];

  return (
    <div className="vertical-layout__outer text-left">
      <Notice tone="info">
        Review the account, employment record, and access that will be affected.
        Active Powerdeed sessions are always revoked when offboarding is
        confirmed.
      </Notice>

      <div className="feature-container-vertical">
        <div className="w-full text-style__body--bold">Exit Record</div>
        <div className="horizontal-layout border-b border-(--terciary-grey) pb-2.5">
          <div className="flex-1 text-(--primary-grey)">PERSON</div>
          <div>{employee?.name ?? "-"}</div>
        </div>
        <div className="horizontal-layout border-b border-(--terciary-grey) pb-2.5">
          <div className="flex-1 text-(--primary-grey)">REASON</div>
          <div>
            {workflow.exit.reasonCode
              ? getLeaverReasonLabel(workflow.exit.reasonCode)
              : "-"}
          </div>
        </div>
        {workflow.exit.reasonDetails && (
          <div className="horizontal-layout border-b border-(--terciary-grey) pb-2.5">
            <div className="flex-1 text-(--primary-grey)">DETAILS</div>
            <div>{workflow.exit.reasonDetails}</div>
          </div>
        )}
        <div className="horizontal-layout border-b border-(--terciary-grey) pb-2.5">
          <div className="flex-1 text-(--primary-grey)">EFFECTIVE DATE</div>
          <div>
            {workflow.exit.effectiveDate
              ? getDateFormatted(`${workflow.exit.effectiveDate}T00:00:00`)
              : "-"}
          </div>
        </div>
        <div className="horizontal-layout">
          <div className="flex-1 text-(--primary-grey)">NEW STATUS</div>
          <div>{formatLabel(workflow.exit.targetStatus)}</div>
        </div>
      </div>

      <div className="feature-container-vertical">
        <div className="w-full text-style__body--bold">Access Impact</div>

        <div className="vertical-layout__inner border-b border-(--terciary-grey) pb-2.5">
          <div className="text-(--primary-grey)">KEYCLOAK GROUPS</div>
          <div className="horizontal-layout flex-wrap text-style__small-text">
            {workflow.keycloakGroups.map((group) => (
              <div
                key={group.id}
                className="rounded-[10px] border border-(--primary-red) bg-(--primary-red-faded)/10 px-2.5 text-(--primary-red)"
              >
                {workflow.exit.removeKeycloakGroups
                  ? `${group.name} will be removed`
                  : `${group.name} will be retained`}
              </div>
            ))}
            {!workflow.keycloakGroups.length && (
              <div className="text-(--primary-grey)">None</div>
            )}
          </div>
        </div>

        <div className="vertical-layout__inner border-b border-(--terciary-grey) pb-2.5">
          <div className="text-(--primary-grey)">POWERDEED ROLES</div>
          <div className="horizontal-layout flex-wrap text-style__small-text">
            {roles.map((role) => (
              <div
                key={role.roleId}
                className="rounded-[10px] border border-(--primary-yellow) bg-(--primary-yellow-faded)/30 px-2.5 text-(--primary-yellow)"
              >
                {role.roleId}
              </div>
            ))}
            {!roles.length && (
              <div className="text-(--primary-grey)">No assigned roles</div>
            )}
          </div>
          <div className="text-style__small-text text-(--primary-grey)">
            Roles remain on the identity profile for audit/history. The
            suspended or archived status blocks normal app access.
          </div>
        </div>

        <Notice tone="danger">
          Active sessions will be revoked immediately. Keycloak login will
          {workflow.exit.disableKeycloak ? " be disabled" : " remain enabled"}.
        </Notice>
      </div>
    </div>
  );
}
