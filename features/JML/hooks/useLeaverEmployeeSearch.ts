"use client";

import { useEffect } from "react";
import { execute } from "@/lib";
import {
  getJMLKeycloakAccess,
  searchActiveJMLEmployees,
} from "../services/jml";
import type { JMLProvisionedUser } from "../types/jml.types";
import useJML from "./useJML";

export default function useLeaverEmployeeSearch() {
  const { state, dispatch } = useJML();
  const leaver = state.leaver;
  const normalizedSearch = leaver.search.trim();

  useEffect(() => {
    if (normalizedSearch.length < 2 || leaver.selectedUser) {
      dispatch({ type: "leaver/search-results", users: [] });
      return;
    }

    const timeout = window.setTimeout(() => {
      execute(() => searchActiveJMLEmployees(normalizedSearch), {
        setLoading: (loading) =>
          dispatch({ type: "leaver/search-loading", loading }),
        setError: (message) => dispatch({ type: "leaver/error", message }),
        onSuccess: (users) =>
          dispatch({ type: "leaver/search-results", users }),
      });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [dispatch, leaver.selectedUser, normalizedSearch]);

  const selectUser = (user: JMLProvisionedUser) =>
    execute(() => getJMLKeycloakAccess(user.keycloakUserId), {
      setLoading: (loading) =>
        dispatch({ type: "leaver/selection-loading", loading }),
      setError: (message) => dispatch({ type: "leaver/error", message }),
      onSuccess: ({ groups }) =>
        dispatch({ type: "leaver/select", user, groups }),
    });

  return {
    search: leaver.search,
    results: leaver.searchResults,
    isSearching: leaver.isSearching,
    isLoadingSelection: leaver.isLoadingSelection,
    setSearch: (search: string) =>
      dispatch({ type: "leaver/search-set", search }),
    selectUser,
  };
}
