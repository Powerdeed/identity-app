"use client";

import { useEffect, useState } from "react";
import { searchIdentity } from "../services/globalSearch";
import type { GlobalSearchResponse, GlobalSearchResultType } from "../types";

const EMPTY_RESULTS: GlobalSearchResponse = { query: "", groups: [], total: 0 };

export default function useGlobalSearch(
  query: string,
  options: {
    limit?: number;
    types?: GlobalSearchResultType[];
    delay?: number;
  } = {},
) {
  const [data, setData] = useState<GlobalSearchResponse>(EMPTY_RESULTS);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const typesKey = options.types?.join(",") ?? "";

  useEffect(() => {
    const normalized = query.trim();
    if (normalized.length < 2) {
      return;
    }

    const controller = new AbortController();
    const timer = window.setTimeout(async () => {
      setLoading(true);
      setError("");
      try {
        setData(
          await searchIdentity(normalized, {
            limit: options.limit,
            types: typesKey
              ? (typesKey.split(",") as GlobalSearchResultType[])
              : undefined,
            signal: controller.signal,
          }),
        );
      } catch (searchError) {
        if (!controller.signal.aborted) {
          setError(
            searchError instanceof Error
              ? searchError.message
              : "Search failed",
          );
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, options.delay ?? 300);

    return () => {
      window.clearTimeout(timer);
      controller.abort();
    };
  }, [query, options.delay, options.limit, typesKey]);

  const queryIsSearchable = query.trim().length >= 2;

  return {
    data: queryIsSearchable ? data : { ...EMPTY_RESULTS, query: query.trim() },
    loading: queryIsSearchable && loading,
    error: queryIsSearchable ? error : "",
  };
}
