"use client";

import { execute } from "@/lib";
import type { MoveReasonCode } from "../constants/MOVE_REASONS";
import { moverStageOrder } from "../constants/PROCESS_STAGES";
import { moveJMLEmployee } from "../services/jml";
import {
  getMoverChangeRows,
  toMoveEmployeeInput,
} from "../utils/jml.utils";
import useJML from "./useJML";

export default function useMoverWorkflow() {
  const { state, dispatch } = useJML();
  const mover = state.mover;
  const currentStageIndex = moverStageOrder.indexOf(mover.currentStage);
  const isFirstStage = currentStageIndex === 0;
  const isLastStage = currentStageIndex === moverStageOrder.length - 1;
  const changeRows = getMoverChangeRows(mover.selectedUser, mover.change);
  const hasEmploymentChange = changeRows.some((row) => row.changed);
  const hasCompleteAssignmentSelection =
    (!mover.change.departmentId && !mover.change.jobProfileId) ||
    Boolean(mover.change.departmentId && mover.change.jobProfileId);
  const hasReason = Boolean(
    mover.change.reasonCode &&
      (mover.change.reasonCode !== "other" ||
        mover.change.reasonDetails.trim()),
  );
  const hasEffectiveDate = Boolean(mover.change.effectiveDate);

  const navigate = (offset: -1 | 1) => {
    const stage = moverStageOrder[currentStageIndex + offset];
    if (stage) dispatch({ type: "mover/stage-set", stage });
  };

  const performPrimaryAction = () => {
    if (mover.result) {
      dispatch({ type: "mover/clear-selection" });
      return;
    }

    dispatch({ type: "mover/success", message: "" });

    if (!isLastStage) {
      navigate(1);
      return;
    }

    if (!mover.selectedUser) return;

    execute(
      () =>
        moveJMLEmployee(
          mover.selectedUser!.id,
          toMoveEmployeeInput(mover.selectedUser!, mover.change),
        ),
      {
        setLoading: (loading) =>
          dispatch({ type: "mover/processing", loading }),
        setError: (message) => dispatch({ type: "mover/error", message }),
        onSuccess: (result) => {
          dispatch({ type: "mover/completed", result });
          dispatch({
            type: "mover/success",
            message: `${result.user.name}'s move was applied. ${result.revokedSessionCount} active session${result.revokedSessionCount === 1 ? " was" : "s were"} revoked.`,
          });
        },
      },
    );
  };

  const cannotSpecifyChange =
    !hasEmploymentChange ||
    !hasReason ||
    !hasEffectiveDate ||
    !hasCompleteAssignmentSelection;

  const primaryActionDisabled =
    mover.isProcessing ||
    mover.isLoadingSelection ||
    (mover.currentStage === "Select Person" && !mover.selectedUser) ||
    (mover.currentStage === "Specify Change" && cannotSpecifyChange);

  return {
    ...mover,
    currentStageIndex,
    isFirstStage,
    isLastStage,
    changeRows,
    hasEmploymentChange,
    hasReason,
    hasCompleteAssignmentSelection,
    hasEffectiveDate,
    primaryActionDisabled,
    clearSelection: () => dispatch({ type: "mover/clear-selection" }),
    updateChange: (field: keyof typeof mover.change, value: string) =>
      dispatch({ type: "mover/change-update", field, value }),
    selectDepartment: (id: string, code: string, name: string) =>
      dispatch({ type: "mover/department-select", id, code, name }),
    selectJobProfile: (id: string, title: string) =>
      dispatch({ type: "mover/job-profile-select", id, title }),
    selectManager: (id: string, name: string) =>
      dispatch({ type: "mover/manager-select", id, name }),
    selectReason: (reasonCode: MoveReasonCode) =>
      dispatch({ type: "mover/reason-select", reasonCode }),
    goBack: () => navigate(-1),
    performPrimaryAction,
  };
}
