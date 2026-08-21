"use client";

import { useEffect } from "react";
import { execute } from "@/lib";
import {
  getJMLKeycloakAccess,
  searchActiveJMLEmployees,
} from "../services/jml";
import type { JMLProvisionedUser } from "../types/jml.types";
import useJML from "./useJML";

export default function useMoverEmployeeSearch() {
  const { state, dispatch } = useJML();
  const mover = state.mover;
  const normalizedSearch = mover.search.trim();

  useEffect(() => {
    if (normalizedSearch.length < 2 || mover.selectedUser) {
      dispatch({ type: "mover/search-results", users: [] });
      return;
    }

    const timeout = window.setTimeout(() => {
      execute(() => searchActiveJMLEmployees(normalizedSearch), {
        setLoading: (loading) =>
          dispatch({ type: "mover/search-loading", loading }),
        setError: (message) => dispatch({ type: "mover/error", message }),
        onSuccess: (users) =>
          dispatch({ type: "mover/search-results", users }),
      });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [dispatch, mover.selectedUser, normalizedSearch]);

  const selectUser = (user: JMLProvisionedUser) =>
    execute(() => getJMLKeycloakAccess(user.keycloakUserId), {
      setLoading: (loading) =>
        dispatch({ type: "mover/selection-loading", loading }),
      setError: (message) => dispatch({ type: "mover/error", message }),
      onSuccess: ({ groups }) =>
        dispatch({ type: "mover/select", user, groups }),
    });

  return {
    search: mover.search,
    results: mover.searchResults,
    isSearching: mover.isSearching,
    isLoadingSelection: mover.isLoadingSelection,
    setSearch: (search: string) =>
      dispatch({ type: "mover/search-set", search }),
    selectUser,
  };
}
