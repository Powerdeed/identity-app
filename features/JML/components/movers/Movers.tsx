"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { moverStages } from "@/features/JML/constants/PROCESS_STAGES";

import useJML from "../../hooks/useJML";
import SelectPerson from "./stages/SelectPerson";
import SpecifyChange from "./stages/SpecifyChange";
import PreviewImpact from "./stages/PreviewImpact";
import ConfirmMove from "./stages/ConfirmMove";
import Button from "@/global-components/ui/Button";
import { getRandomClassNameColor } from "@/globals";
import { getInitials } from "@/global-components/layout/nav";
import { useState } from "react";

const targetEmployee = "Bernard Kuria";

export default function Movers() {
  const [selectedEmployee, setSelectedEmployee] = useState("Bernard Kuria");

  const {
    currentMoverStage,
    currentMoverStageIndex,
    firstMoverStage,
    lastMoverStage,
    setCurrentMoverStage,
  } = useJML();

  const initialBackgroundColor = getRandomClassNameColor(targetEmployee);

  return (
    <div className="vertical-layout__outer">
      <div className="text-style__small-text flex items-center gap-1">
        {moverStages.map((stage, i) => (
          <div key={stage} className={`flex items-center gap-1`}>
            {i !== 0 && <hr className={`w-6 border-(--terciary-grey)`} />}
            <div
              className={`w-6 h-6 rounded-full font-bold text-center grid items-center justify-center ${
                currentMoverStage === stage
                  ? "bg-(--secondary-blue) text-white"
                  : currentMoverStageIndex > i
                    ? "bg-(--secondary-green) text-white"
                    : "border border-(--terciary-grey)  text-(--primary-grey)"
              }`}
            >
              {currentMoverStageIndex < i + 1 ? (
                i + 1
              ) : (
                <FontAwesomeIcon icon={["fas", "check"]} />
              )}
            </div>
            <div
              className={`${currentMoverStage === stage ? "text-(--secondary-blue)" : "text-(--primary-grey)"}`}
            >
              {stage}
            </div>
          </div>
        ))}
      </div>

      <div className="feature-container-vertical">
        <div className="horizontal-layout justify-between text-style__big-text border-b border-(--terciary-grey) pb-2.5">
          Step {currentMoverStageIndex + 1}:
          {moverStages[currentMoverStageIndex]}
          {currentMoverStage !== firstMoverStage && selectedEmployee && (
            <div className="horizontal-layout">
              <div
                className={`w-8 h-8 grid items-center text-center ${initialBackgroundColor} rounded-[10px] text-style__body--bold`}
              >
                {getInitials(targetEmployee)}
              </div>

              <div className="text-(--primary-grey) text-style__small-text">
                {targetEmployee}
              </div>
            </div>
          )}
        </div>

        {currentMoverStage === "Select Person" && <SelectPerson />}
        {currentMoverStage === "Specify Change" && <SpecifyChange />}
        {currentMoverStage === "Preview Impact" && <PreviewImpact />}
        {currentMoverStage === "Confirm Move" && <ConfirmMove />}

        <div className="horizontal-layout justify-between border-t border-(--terciary-grey) pt-2.5">
          <Button
            buttonType="light"
            buttonText="Back"
            clickAction={() =>
              setCurrentMoverStage(() =>
                currentMoverStage === firstMoverStage
                  ? firstMoverStage
                  : moverStages[currentMoverStageIndex - 1],
              )
            }
          />

          <Button
            buttonText={"Next"}
            clickAction={() =>
              setCurrentMoverStage(() =>
                currentMoverStage === lastMoverStage
                  ? lastMoverStage
                  : moverStages[currentMoverStageIndex + 1],
              )
            }
          />
        </div>
      </div>
    </div>
  );
}
