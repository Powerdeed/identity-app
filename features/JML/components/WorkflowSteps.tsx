"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function WorkflowSteps<TStage extends string>({
  stages,
  currentStage,
}: {
  stages: readonly TStage[];
  currentStage: TStage;
}) {
  const currentStageIndex = stages.indexOf(currentStage);

  return (
    <div className="text-style__small-text flex items-center gap-1 overflow-auto">
      {stages.map((stage, index) => (
        <div key={stage} className="flex items-center gap-1 whitespace-nowrap">
          {index !== 0 && <hr className="w-6 border-(--terciary-grey)" />}
          <div
            className={`w-6 h-6 rounded-full font-bold text-center grid items-center justify-center ${
              currentStage === stage
                ? "bg-(--secondary-blue) text-white"
                : currentStageIndex > index
                  ? "bg-(--secondary-green) text-white"
                  : "border border-(--terciary-grey) text-(--primary-grey)"
            }`}
          >
            {currentStageIndex <= index ? (
              index + 1
            ) : (
              <FontAwesomeIcon icon={["fas", "check"]} />
            )}
          </div>
          <div
            className={
              currentStage === stage
                ? "text-(--secondary-blue)"
                : "text-(--primary-grey)"
            }
          >
            {stage}
          </div>
        </div>
      ))}
    </div>
  );
}
