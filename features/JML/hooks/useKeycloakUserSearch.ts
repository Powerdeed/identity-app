"use client";

import { useEffect } from "react";
import { execute } from "@/lib";
import useJML from "./useJML";
import { searchKeycloakUsers } from "../services/jml";
import type { KeycloakUser } from "../types/jml.types";

export default function useKeycloakUserSearch() {
  const { state, dispatch } = useJML();
  const normalizedSearch = state.search.trim();

  useEffect(() => {
    if (normalizedSearch.length < 2) {
      dispatch({ type: "search/results", users: [] });
      dispatch({ type: "feedback/error", message: "" });
      return;
    }

    const timeout = window.setTimeout(() => {
      execute(() => searchKeycloakUsers(normalizedSearch), {
        setLoading: (loading) =>
          dispatch({ type: "search/loading", loading }),
        setError: (message) =>
          dispatch({ type: "feedback/error", message }),
        onSuccess: (users) => dispatch({ type: "search/results", users }),
      });
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [dispatch, normalizedSearch]);

  return {
    search: state.search,
    results: state.searchResults,
    selectedUserId: state.selectedKeycloakUser?.id,
    isSearching: state.isSearching,
    setSearch: (search: string) => dispatch({ type: "search/set", search }),
    selectUser: (user: KeycloakUser) =>
      dispatch({ type: "identity/select", user }),
  };
}
