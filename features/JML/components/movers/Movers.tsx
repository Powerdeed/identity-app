"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { moverStages } from "@/features/JML/constants/PROCESS_STAGES";
import { getInitials } from "@/global-components/layout/nav";
import Button from "@/global-components/ui/Button";
import { getRandomClassNameColor } from "@/globals";
import useMoverWorkflow from "../../hooks/useMoverWorkflow";
import ConfirmMove from "./stages/ConfirmMove";
import PreviewImpact from "./stages/PreviewImpact";
import SelectPerson from "./stages/SelectPerson";
import SpecifyChange from "./stages/SpecifyChange";

export default function Movers() {
  const workflow = useMoverWorkflow();
  const selectedEmployee = workflow.selectedUser;

  return (
    <div className="vertical-layout__outer">
      <div className="text-style__small-text flex items-center gap-1">
        {moverStages.map((stage, index) => (
          <div key={stage} className="flex items-center gap-1">
            {index !== 0 && <hr className="w-6 border-(--terciary-grey)" />}
            <div
              className={`w-6 h-6 rounded-full font-bold text-center grid items-center justify-center ${
                workflow.currentStage === stage
                  ? "bg-(--secondary-blue) text-white"
                  : workflow.currentStageIndex > index
                    ? "bg-(--secondary-green) text-white"
                    : "border border-(--terciary-grey) text-(--primary-grey)"
              }`}
            >
              {workflow.currentStageIndex <= index ? (
                index + 1
              ) : (
                <FontAwesomeIcon icon={["fas", "check"]} />
              )}
            </div>
            <div
              className={
                workflow.currentStage === stage
                  ? "text-(--secondary-blue)"
                  : "text-(--primary-grey)"
              }
            >
              {stage}
            </div>
          </div>
        ))}
      </div>

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
          <div className="rounded-[10px] border border-(--primary-red)/30 bg-(--primary-red)/10 p-3 text-style__small-text text-(--primary-red)">
            {workflow.error}
          </div>
        )}

        {workflow.successMessage && (
          <div className="rounded-[10px] border border-(--primary-green)/30 bg-(--primary-green)/10 p-3 text-style__small-text text-(--primary-green)">
            {workflow.successMessage}
          </div>
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
