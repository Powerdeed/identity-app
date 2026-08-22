"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";
import Notice from "@/global-components/ui/Notice";
import WorkflowSteps from "../WorkflowSteps";
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
      <WorkflowSteps stages={joinerStageOrder} currentStage={state.currentStage} />

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
          <Notice tone="danger">{state.error}</Notice>
        )}

        {state.successMessage && (
          <Notice tone="success">{state.successMessage}</Notice>
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
