"use client";

import { execute } from "@/lib";
import { joinerStageOrder } from "../constants/PROCESS_STAGES";
import {
  activateJMLUser,
  addJMLKeycloakGroup,
  provisionFromKeycloak,
  updateJMLAccess,
  updateJMLEmployment,
} from "../services/jml";
import { toAccessAssignment, toEmploymentProfile } from "../utils/jml.utils";
import useJML from "./useJML";

export default function useJMLWorkflow() {
  const { state, dispatch } = useJML();
  const currentStageIndex = joinerStageOrder.indexOf(state.currentStage);
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === joinerStageOrder.length - 1;
  const employmentIsIncomplete =
    !state.employment.departmentId ||
    !state.employment.jobProfileId ||
    !state.employment.startDate;

  const navigate = (offset: -1 | 1) => {
    const stage = joinerStageOrder[currentStageIndex + offset];
    if (stage) dispatch({ type: "stage/set", stage });
  };

  const runWorkflowOperation = <T,>(
    operation: () => Promise<T>,
    onSuccess: (result: T) => void,
  ) =>
    execute(operation, {
      setLoading: (loading) =>
        dispatch({ type: "workflow/loading", loading }),
      setError: (message) =>
        dispatch({ type: "feedback/error", message }),
      onSuccess,
    });

  const performPrimaryAction = () => {
    dispatch({ type: "feedback/success", message: "" });

    if (
      state.currentStage === "Search Keycloak" ||
      state.currentStage === "Verify Identity"
    ) {
      navigate(1);
      return;
    }

    if (state.currentStage === "Create Profile") {
      if (state.provisionedUser) {
        navigate(1);
        return;
      }

      const keycloakUserId = state.selectedKeycloakUser?.id;
      if (!keycloakUserId) return;

      runWorkflowOperation(
        () => provisionFromKeycloak(keycloakUserId),
        (user) => {
          dispatch({ type: "profile/set", user });
          navigate(1);
        },
      );
      return;
    }

    if (state.currentStage === "Employment") {
      const userId = state.provisionedUser?.id;
      if (!userId) return;

      runWorkflowOperation(
        () => updateJMLEmployment(userId, toEmploymentProfile(state.employment)),
        (user) => {
          dispatch({ type: "profile/set", user });
          navigate(1);
        },
      );
      return;
    }

    if (state.currentStage === "Assign Access") {
      const userId = state.provisionedUser?.id;
      const keycloakUserId = state.selectedKeycloakUser?.id;
      if (!userId || !keycloakUserId) return;

      const newGroupIds = state.selectedGroupIds.filter(
        (groupId) => !state.existingGroupIds.includes(groupId),
      );

      runWorkflowOperation(
        async () => {
          const [updatedUser] = await Promise.all([
            updateJMLAccess(
              userId,
              toAccessAssignment(state.selectedRoleIds),
            ),
            ...newGroupIds.map((groupId) =>
              addJMLKeycloakGroup(keycloakUserId, groupId),
            ),
          ]);

          return updatedUser;
        },
        (user) => {
          dispatch({ type: "profile/set", user });
          dispatch({ type: "access/groups-persisted" });
          navigate(1);
        },
      );
      return;
    }

    if (state.currentStage === "Review & Activate") {
      const userId = state.provisionedUser?.id;
      if (!userId) return;

      runWorkflowOperation(() => activateJMLUser(userId), (user) => {
        dispatch({ type: "profile/set", user });
        dispatch({
          type: "feedback/success",
          message: `${user.name}'s account is now active.`,
        });
      });
    }
  };

  return {
    currentStageIndex,
    isFirstStage,
    isLastStage,
    primaryActionDisabled:
      state.isProcessing ||
      state.isLoadingAccess ||
      (state.currentStage === "Search Keycloak" &&
        !state.selectedKeycloakUser) ||
      (state.currentStage === "Employment" && employmentIsIncomplete) ||
      (isLastStage && state.provisionedUser?.status === "active"),
    goBack: () => navigate(-1),
    performPrimaryAction,
  };
}
