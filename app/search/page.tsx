import type { Metadata } from "next";
import SearchResults from "@/features/global-search/components/SearchResults";
import type { GlobalSearchResultType } from "@/features/global-search/types";

export const metadata: Metadata = { title: "Search" };

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; type?: string | string[] }>;
}) {
  const resolvedSearchParams = await searchParams;
  const rawQuery = resolvedSearchParams.q;
  const query = (
    Array.isArray(rawQuery) ? rawQuery[0] : (rawQuery ?? "")
  ).trim();
  const rawType = Array.isArray(resolvedSearchParams.type)
    ? resolvedSearchParams.type[0]
    : (resolvedSearchParams.type ?? "");
  const searchableTypes: GlobalSearchResultType[] = [
    "employee",
    "session",
    "department",
    "job-profile",
    "team",
    "location",
    "role",
    "permission",
    "group",
    "access-review",
    "security-event",
  ];
  const type = searchableTypes.includes(rawType as GlobalSearchResultType)
    ? (rawType as GlobalSearchResultType)
    : undefined;

  return (
    <SearchResults
      key={`${query}:${type ?? "all"}`}
      initialQuery={query}
      initialType={type}
    />
  );
}
