"use client";

import { useEffect } from "react";
import type { RoleId } from "@/app/auth";
import { execute } from "@/lib";
import useJML from "./useJML";
import {
  getJMLAccessOptions,
  getJMLKeycloakAccess,
} from "../services/jml";

export default function useJMLAccessOptions() {
  const { state, dispatch } = useJML();
  const keycloakUserId = state.selectedKeycloakUser?.id;
  const hasLoadedOptions = state.keycloakGroups.length > 0;

  useEffect(() => {
    if (!keycloakUserId || hasLoadedOptions) return;

    execute(
      async () => {
        const [options, currentAccess] = await Promise.all([
          getJMLAccessOptions(),
          getJMLKeycloakAccess(keycloakUserId),
        ]);

        return { ...options, currentAccess };
      },
      {
        setLoading: (loading) =>
          dispatch({ type: "access/loading", loading }),
        setError: (message) =>
          dispatch({ type: "feedback/error", message }),
        onSuccess: ({ groups, roles, currentAccess }) =>
          dispatch({
            type: "access/options",
            groups,
            roles,
            existingGroupIds: currentAccess.groups.map((group) => group.id),
          }),
      },
    );
  }, [dispatch, hasLoadedOptions, keycloakUserId]);

  return {
    groups: state.keycloakGroups,
    roles: state.powerdeedRoles,
    selectedGroupIds: state.selectedGroupIds,
    selectedRoleIds: state.selectedRoleIds,
    existingGroupIds: state.existingGroupIds,
    isLoading: state.isLoadingAccess,
    toggleGroup: (groupId: string) =>
      dispatch({ type: "access/group-toggle", groupId }),
    toggleRole: (roleId: RoleId) =>
      dispatch({ type: "access/role-toggle", roleId }),
  };
}
