"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";
import SearchKeycloak from "./stages/SearchKeycloak";
import VerifyIdentity from "./stages/VerifyIdentity";
import CreateProfile from "./stages/CreateProfile";
import Employment from "./stages/Employment";
import AssignAccess from "./stages/AssignAccess";
import ReviewAndActivate from "./stages/Review&Activate";

import { joinerStageOrder, joinerStages } from "../../constants/PROCESS_STAGES";
import useJML from "@/features/JML/hooks/useJML";
import useJMLWorkflow from "@/features/JML/hooks/useJMLWorkflow";

export default function Joiners() {
  const { state } = useJML();
  const workflow = useJMLWorkflow();

  return (
    <div className="vertical-layout__outer">
      <div className="text-style__small-text flex items-center gap-1">
        {joinerStageOrder.map((stage, i) => (
          <div key={stage} className={`flex items-center gap-1`}>
            {i !== 0 && <hr className={`w-6 border-(--terciary-grey)`} />}
            <div
              className={`w-6 h-6 rounded-full font-bold text-center grid items-center justify-center ${
                state.currentStage === stage
                  ? "bg-(--secondary-blue) text-white"
                  : workflow.currentStageIndex > i
                    ? "bg-(--secondary-green) text-white"
                    : "border border-(--terciary-grey)  text-(--primary-grey)"
              }`}
            >
              {workflow.currentStageIndex < i + 1 ? (
                i + 1
              ) : (
                <FontAwesomeIcon icon={["fas", "check"]} />
              )}
            </div>
            <div
              className={`${state.currentStage === stage ? "text-(--secondary-blue)" : "text-(--primary-grey)"}`}
            >
              {stage}
            </div>
          </div>
        ))}
      </div>

      <div className="feature-container-vertical">
        <div className="text-style__big-text border-b border-(--terciary-grey) pb-2.5">
          Step {workflow.currentStageIndex + 1}:
          {joinerStages[state.currentStage]}
        </div>

        {/* Display Stage */}
        {state.currentStage === "Search Keycloak" && <SearchKeycloak />}
        {state.currentStage === "Verify Identity" && <VerifyIdentity />}
        {state.currentStage === "Create Profile" && <CreateProfile />}
        {state.currentStage === "Employment" && <Employment />}
        {state.currentStage === "Assign Access" && <AssignAccess />}
        {state.currentStage === "Review & Activate" && <ReviewAndActivate />}

        {state.error && (
          <div className="rounded-[10px] border border-(--primary-red)/30 bg-(--primary-red)/10 p-3 text-style__small-text text-(--primary-red)">
            {state.error}
          </div>
        )}

        {state.successMessage && (
          <div className="rounded-[10px] border border-(--primary-green)/30 bg-(--primary-green)/10 p-3 text-style__small-text text-(--primary-green)">
            {state.successMessage}
          </div>
        )}

        <div className="horizontal-layout justify-between border-t border-(--terciary-grey) pt-2.5">
          <Button
            buttonType="light"
            buttonText="Back"
            disabled={workflow.isFirstStage || state.isProcessing}
            icon={<FontAwesomeIcon icon={["fas", "angle-left"]} />}
            clickAction={workflow.goBack}
          />

          <Button
            buttonText={
              state.isProcessing
                ? "Saving..."
                : workflow.isLastStage
                  ? state.provisionedUser?.status === "active"
                    ? "Activated"
                    : "Activate Account"
                  : "Next"
            }
            icon={
              <FontAwesomeIcon
                icon={["fas", workflow.isLastStage ? "check" : "angle-right"]}
              />
            }
            flipDirection={!workflow.isLastStage}
            disabled={workflow.primaryActionDisabled}
            clickAction={workflow.performPrimaryAction}
          />
        </div>
      </div>
    </div>
  );
}
