"use client";

import { execute } from "@/lib";
import type { LeaverReasonCode } from "../constants/LEAVER_REASONS";
import { getLeaverReasonLabel } from "../constants/LEAVER_REASONS";
import { leaverStageOrder } from "../constants/PROCESS_STAGES";
import { offboardJMLUser } from "../services/jml";
import useJML from "./useJML";

export default function useLeaverWorkflow() {
  const { state, dispatch } = useJML();
  const leaver = state.leaver;
  const currentStageIndex = leaverStageOrder.indexOf(leaver.currentStage);
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === leaverStageOrder.length - 1;
  const hasReason = Boolean(
    leaver.exit.reasonCode &&
      (leaver.exit.reasonCode !== "other" ||
        leaver.exit.reasonDetails.trim()),
  );
  const hasEffectiveDate = Boolean(leaver.exit.effectiveDate);

  const navigate = (offset: -1 | 1) => {
    const stage = leaverStageOrder[currentStageIndex + offset];
    if (stage) dispatch({ type: "leaver/stage-set", stage });
  };

  const performPrimaryAction = () => {
    if (leaver.result) {
      dispatch({ type: "leaver/clear-selection" });
      return;
    }

    dispatch({ type: "leaver/success", message: "" });

    if (!isLastStage) {
      navigate(1);
      return;
    }

    if (!leaver.selectedUser || !leaver.exit.reasonCode) return;

    const reasonLabel = getLeaverReasonLabel(leaver.exit.reasonCode);
    const reasonDetails = leaver.exit.reasonDetails.trim();
    const reason = reasonDetails
      ? `${reasonLabel}: ${reasonDetails}`
      : reasonLabel;

    execute(
      () =>
        offboardJMLUser(leaver.selectedUser!.id, {
          status: leaver.exit.targetStatus,
          reason,
          effectiveDate: leaver.exit.effectiveDate,
          disableKeycloak: leaver.exit.disableKeycloak,
          removeKeycloakGroups: leaver.exit.removeKeycloakGroups,
        }),
      {
        setLoading: (loading) =>
          dispatch({ type: "leaver/processing", loading }),
        setError: (message) => dispatch({ type: "leaver/error", message }),
        onSuccess: (result) => {
          dispatch({ type: "leaver/completed", result });
          dispatch({
            type: "leaver/success",
            message: `${result.user.name} was ${result.user.status}. ${result.revokedSessionCount} active session${result.revokedSessionCount === 1 ? " was" : "s were"} revoked.`,
          });
        },
      },
    );
  };

  const primaryActionDisabled =
    leaver.isProcessing ||
    leaver.isLoadingSelection ||
    (leaver.currentStage === "Select Person" && !leaver.selectedUser) ||
    (leaver.currentStage === "Specify Exit" &&
      (!hasReason || !hasEffectiveDate));

  return {
    ...leaver,
    currentStageIndex,
    isFirstStage,
    isLastStage,
    hasReason,
    hasEffectiveDate,
    primaryActionDisabled,
    clearSelection: () => dispatch({ type: "leaver/clear-selection" }),
    updateExit: (field: keyof typeof leaver.exit, value: string | boolean) =>
      dispatch({ type: "leaver/exit-update", field, value }),
    selectReason: (reasonCode: LeaverReasonCode) =>
      dispatch({ type: "leaver/reason-select", reasonCode }),
    goBack: () => navigate(-1),
    performPrimaryAction,
  };
}
