import { apiRequest } from "@lib";
import type { GlobalSearchResponse, GlobalSearchResultType } from "../types";

export function searchIdentity(
  query: string,
  options: {
    types?: GlobalSearchResultType[];
    limit?: number;
    signal?: AbortSignal;
  } = {},
) {
  return apiRequest<GlobalSearchResponse>({
    method: "GET",
    url: "/admin/search",
    params: {
      q: query,
      types: options.types?.join(","),
      limit: options.limit ?? 5,
    },
    signal: options.signal,
  });
}
