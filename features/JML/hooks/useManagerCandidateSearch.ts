"use client";

import { useEffect, useState } from "react";
import { execute } from "@/lib";
import { getManagerCandidates } from "@/features/policies-and-configuration/services/organizationCatalog";
import type { ManagerCandidate } from "@/features/policies-and-configuration/types/organizationCatalog.types";

export default function useManagerCandidateSearch(
  search: string,
  excludeUserId?: string,
) {
  const [managers, setManagers] = useState<ManagerCandidate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => {
      execute(
        () =>
          getManagerCandidates({
            search: search.trim() || undefined,
            excludeUserId,
            pageSize: 25,
          }),
        {
          setLoading: (loading) => active && setIsLoading(loading),
          setError: (message) => active && setError(message),
          onSuccess: (data) => active && setManagers(data.managers),
        },
      );
    }, 250);

    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [excludeUserId, search]);

  return { managers, isLoading, error };
}
