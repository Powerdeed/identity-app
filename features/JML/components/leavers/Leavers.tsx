"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { leaverStageOrder } from "../../constants/PROCESS_STAGES";
import Button from "@/global-components/ui/Button";
import Notice from "@/global-components/ui/Notice";
import { getInitials } from "@/global-components/layout/nav";
import { getRandomClassNameColor } from "@/globals";
import useLeaverWorkflow from "../../hooks/useLeaverWorkflow";
import WorkflowSteps from "../WorkflowSteps";
import ConfirmOffboarding from "./stages/ConfirmOffboarding";
import PreviewImpact from "./stages/PreviewImpact";
import SelectPerson from "./stages/SelectPerson";
import SpecifyExit from "./stages/SpecifyExit";

export default function Leavers() {
  const workflow = useLeaverWorkflow();
  const selectedEmployee = workflow.selectedUser;

  return (
    <div className="vertical-layout__outer">
      <WorkflowSteps
        stages={leaverStageOrder}
        currentStage={workflow.currentStage}
      />

      <div className="feature-container-vertical">
        <div className="horizontal-layout justify-between border-b border-(--terciary-grey) pb-2.5 text-style__big-text">
          <div>
            Step {workflow.currentStageIndex + 1}: {workflow.currentStage}
          </div>

          {!workflow.isFirstStage && selectedEmployee && (
            <div className="horizontal-layout">
              <div
                className={`grid h-8 w-8 items-center rounded-[10px] text-center text-style__body--bold ${getRandomClassNameColor(selectedEmployee.id)}`}
              >
                {getInitials(selectedEmployee.name)}
              </div>
              <div className="text-style__small-text text-(--primary-grey)">
                {selectedEmployee.name}
              </div>
            </div>
          )}
        </div>

        {workflow.currentStage === "Select Person" && <SelectPerson />}
        {workflow.currentStage === "Specify Exit" && <SpecifyExit />}
        {workflow.currentStage === "Preview Impact" && <PreviewImpact />}
        {workflow.currentStage === "Confirm Offboarding" && (
          <ConfirmOffboarding />
        )}

        {workflow.error && <Notice tone="danger">{workflow.error}</Notice>}

        {workflow.successMessage && (
          <Notice tone="success">{workflow.successMessage}</Notice>
        )}

        <div className="horizontal-layout justify-between border-t border-(--terciary-grey) pt-2.5">
          <Button
            buttonType="light"
            buttonText="Back"
            disabled={
              workflow.isFirstStage ||
              workflow.isProcessing ||
              Boolean(workflow.result)
            }
            icon={<FontAwesomeIcon icon={["fas", "angle-left"]} />}
            clickAction={workflow.goBack}
          />

          <Button
            buttonText={
              workflow.isProcessing
                ? "Offboarding..."
                : workflow.result
                  ? "Offboard Another Employee"
                  : workflow.isLastStage
                    ? "Confirm Offboarding"
                    : "Next"
            }
            disabled={workflow.primaryActionDisabled}
            icon={
              <FontAwesomeIcon
                icon={[
                  "fas",
                  workflow.isLastStage && !workflow.result
                    ? "check"
                    : "angle-right",
                ]}
              />
            }
            flipDirection={!workflow.isLastStage}
            clickAction={workflow.performPrimaryAction}
          />
        </div>
      </div>
    </div>
  );
}
