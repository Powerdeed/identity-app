"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { moverStageOrder } from "@/features/JML/constants/PROCESS_STAGES";
import { getInitials } from "@/global-components/layout/nav";
import Button from "@/global-components/ui/Button";
import Notice from "@/global-components/ui/Notice";
import { getRandomClassNameColor } from "@/globals";
import useMoverWorkflow from "../../hooks/useMoverWorkflow";
import WorkflowSteps from "../WorkflowSteps";
import ConfirmMove from "./stages/ConfirmMove";
import PreviewImpact from "./stages/PreviewImpact";
import SelectPerson from "./stages/SelectPerson";
import SpecifyChange from "./stages/SpecifyChange";

export default function Movers() {
  const workflow = useMoverWorkflow();
  const selectedEmployee = workflow.selectedUser;

  return (
    <div className="vertical-layout__outer">
      <WorkflowSteps stages={moverStageOrder} currentStage={workflow.currentStage} />

      <div className="feature-container-vertical">
        <div className="horizontal-layout justify-between text-style__big-text border-b border-(--terciary-grey) pb-2.5">
          <div>
            Step {workflow.currentStageIndex + 1}: {workflow.currentStage}
          </div>

          {!workflow.isFirstStage && selectedEmployee && (
            <div className="horizontal-layout">
              <div
                className={`w-8 h-8 grid items-center text-center ${getRandomClassNameColor(selectedEmployee.id)} rounded-[10px] text-style__body--bold`}
              >
                {getInitials(selectedEmployee.name)}
              </div>
              <div className="text-(--primary-grey) text-style__small-text">
                {selectedEmployee.name}
              </div>
            </div>
          )}
        </div>

        {workflow.currentStage === "Select Person" && <SelectPerson />}
        {workflow.currentStage === "Specify Change" && <SpecifyChange />}
        {workflow.currentStage === "Preview Impact" && <PreviewImpact />}
        {workflow.currentStage === "Confirm Move" && <ConfirmMove />}

        {workflow.error && (
          <Notice tone="danger">{workflow.error}</Notice>
        )}

        {workflow.successMessage && (
          <Notice tone="success">{workflow.successMessage}</Notice>
        )}

        <div className="horizontal-layout justify-between border-t border-(--terciary-grey) pt-2.5">
          <Button
            buttonType="light"
            buttonText="Back"
            disabled={
              workflow.isFirstStage || workflow.isProcessing || Boolean(workflow.result)
            }
            icon={<FontAwesomeIcon icon={["fas", "angle-left"]} />}
            clickAction={workflow.goBack}
          />

          <Button
            buttonText={
              workflow.isProcessing
                ? "Applying..."
                : workflow.result
                  ? "Move Another Employee"
                  : workflow.isLastStage
                    ? "Confirm Move"
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
