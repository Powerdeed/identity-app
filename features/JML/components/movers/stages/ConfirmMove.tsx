"use client";

import { formatLabel } from "@/features/employees/utils/formatLabel";
import { getDateFormatted } from "@/global-components/layout/date";
import Notice from "@/global-components/ui/Notice";
import { getMoveReasonLabel } from "../../../constants/MOVE_REASONS";
import useMoverWorkflow from "../../../hooks/useMoverWorkflow";

export default function ConfirmMove() {
  const workflow = useMoverWorkflow();
  const employee = workflow.selectedUser;
  const currentDepartment = employee?.employment?.departmentId;
  const nextDepartment =
    workflow.changeRows.find((row) => row.key === "departmentId")?.next ??
    currentDepartment;
  const details = {
    Person: employee?.name,
    "New Department": nextDepartment,
    "New Title": workflow.changeRows.find((row) => row.key === "jobProfileId")
      ?.next,
    "New Manager": workflow.changeRows.find((row) => row.key === "managerId")
      ?.next,
    Reason: workflow.change.reasonCode
      ? getMoveReasonLabel(workflow.change.reasonCode)
      : "-",
    ...(workflow.change.reasonDetails
      ? { "Reason Details": workflow.change.reasonDetails }
      : {}),
    "Effective Date": workflow.change.effectiveDate
      ? getDateFormatted(`${workflow.change.effectiveDate}T00:00:00`)
      : "-",
  };

  return (
    <div className="vertical-layout__outer">
      <Notice tone="success">
        <div>
          <div className="text-(--primary-green)">
            Ready to apply move for {employee?.name}
          </div>
          <div>
            {formatLabel(currentDepartment)} to {formatLabel(nextDepartment)};
            active sessions will be revoked.
          </div>
        </div>
      </Notice>

      <div className="feature-container-vertical">
        {Object.entries(details).map(([label, value], index, entries) => (
          <div
            key={label}
            className={`horizontal-layout ${index + 1 !== entries.length ? "border-b border-(--terciary-grey) pb-2.5" : ""}`}
          >
            <div className="flex-1 text-(--primary-grey)">{label}</div>
            <div>
              {label === "Reason" ||
              label === "Reason Details" ||
              label === "Effective Date"
                ? value || "-"
                : formatLabel(value)}
            </div>
          </div>
        ))}
      </div>

      <Notice tone="warning">
        This operation writes a permanent audit event. It updates employment
        and revokes sessions immediately; access assignments remain unchanged
        pending review.
      </Notice>
    </div>
  );
}
