"use client";

import { SubmitEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useGlobalSearch from "../hooks/useGlobalSearch";
import { useGlobals } from "@/globals";
import type { GlobalSearchResultType } from "../types";
import SearchBar from "@/global-components/ui/SearchBar";
import Loader from "@/global-components/ui/Loader";

export default function SearchResults({
  initialQuery,
  initialType,
}: {
  initialQuery: string;
  initialType?: GlobalSearchResultType;
}) {
  const router = useRouter();
  const { globalStates } = useGlobals();
  const [query, setQuery] = useState(initialQuery);
  const { data, loading, error } = useGlobalSearch(initialQuery, {
    limit: 20,
    delay: 0,
    types: initialType ? [initialType] : undefined,
  });

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    const normalized = query.trim();
    if (normalized.length >= 2)
      router.push(`/search?q=${encodeURIComponent(normalized)}`);
  };

  return (
    <main
      className={`page-with-panels min-w-0 max-w-full overflow-x-hidden pt-15 ${globalStates.sideBarOpen ? "pl-65" : "pl-15"}`}
    >
      <div className="uniform-page-display text-style__body">
        <div className="mx-auto w-full max-w-5xl">
          <h1 className="text-style__page-title">Search identity</h1>
          <p className="mb-5 text-(--primary-grey)">
            Results are limited to records your account is allowed to view.
          </p>
          <form role="search" onSubmit={submit} className="mb-6 flex gap-2">
            <SearchBar
              type="search"
              placeholder="Search employees, access, sessions, departments..."
              val={query}
              changeFunc={(value) => setQuery(value)}
            />

            <button
              type="submit"
              className="rounded-[10px] bg-(--primary-blue) px-5 py-3 font-semibold text-white"
            >
              Search
            </button>
          </form>

          {initialQuery.length < 2 && (
            <p>Enter at least two characters to search.</p>
          )}

          {loading && (
            <div className="horizontal-layout text-(--primary-grey)">
              <Loader />
              <span>Searching identity records...</span>
            </div>
          )}

          {error && <p className="text-(--primary-red)">{error}</p>}

          {!loading &&
            !error &&
            initialQuery.length >= 2 &&
            data.total === 0 && (
              <p>No accessible records matched “{initialQuery}”.</p>
            )}

          <div className="grid gap-5 md:grid-cols-2">
            {data.groups.map((group) => (
              <section key={group.type} className="feature-container-vertical">
                <h2 className="text-style__big-text font-bold">
                  {group.label}
                </h2>

                <div className="divide-y divide-(--terciary-grey)">
                  {group.results.map((result) => (
                    <Link
                      key={`${result.type}:${result.id}`}
                      href={result.href}
                      className="block py-3 hover:text-(--primary-blue)"
                    >
                      <div className="text-style__body--bold">
                        {result.title}
                      </div>
                      <div className="text-style__body text-(--primary-grey)">
                        {result.subtitle}
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
