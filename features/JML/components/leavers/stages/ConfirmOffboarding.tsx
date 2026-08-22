"use client";

import { formatLabel } from "@/features/employees/utils/formatLabel";
import { getDateFormatted } from "@/global-components/layout/date";
import Notice from "@/global-components/ui/Notice";
import { getLeaverReasonLabel } from "../../../constants/LEAVER_REASONS";
import useLeaverWorkflow from "../../../hooks/useLeaverWorkflow";

export default function ConfirmOffboarding() {
  const workflow = useLeaverWorkflow();
  const employee = workflow.selectedUser;
  const details = {
    Person: employee?.name,
    Email: employee?.email,
    Department:
      employee?.employment?.departmentName ?? employee?.employment?.departmentId,
    Title: employee?.employment?.jobTitle,
    Reason: workflow.exit.reasonCode
      ? getLeaverReasonLabel(workflow.exit.reasonCode)
      : "-",
    ...(workflow.exit.reasonDetails
      ? { "Reason Details": workflow.exit.reasonDetails }
      : {}),
    "Effective Date": workflow.exit.effectiveDate
      ? getDateFormatted(`${workflow.exit.effectiveDate}T00:00:00`)
      : "-",
    "New Status": workflow.exit.targetStatus,
    "Disable Keycloak": workflow.exit.disableKeycloak ? "Yes" : "No",
    "Remove Keycloak Groups": workflow.exit.removeKeycloakGroups ? "Yes" : "No",
  };

  return (
    <div className="vertical-layout__outer">
      <Notice tone="danger">
        Confirm offboarding for {employee?.name}. This revokes active sessions
        immediately and writes an audit event.
      </Notice>

      <div className="feature-container-vertical">
        {Object.entries(details).map(([label, value], index, entries) => (
          <div
            key={label}
            className={`horizontal-layout ${index + 1 !== entries.length ? "border-b border-(--terciary-grey) pb-2.5" : ""}`}
          >
            <div className="flex-1 text-(--primary-grey)">{label}</div>
            <div>
              {label === "Email" ||
              label === "Reason" ||
              label === "Reason Details" ||
              label === "Effective Date" ||
              label === "Disable Keycloak" ||
              label === "Remove Keycloak Groups"
                ? value || "-"
                : formatLabel(value)}
            </div>
          </div>
        ))}
      </div>

      <Notice tone="warning">
        This workflow does not delete the employee record. It preserves the
        profile, assignment, and access history so audits can still explain what
        happened later.
      </Notice>
    </div>
  );
}
