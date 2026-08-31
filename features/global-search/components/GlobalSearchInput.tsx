"use client";

import {
  SubmitEvent,
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import useGlobalSearch from "../hooks/useGlobalSearch";
import SearchBar from "@/global-components/ui/SearchBar";
import Loader from "@/global-components/ui/Loader";

function safeInternalHref(href: string) {
  return href.startsWith("/") && !href.startsWith("//") ? href : "/search";
}

export default function GlobalSearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const { data, loading, error } = useGlobalSearch(value);
  const results = useMemo(
    () => data.groups.flatMap((group) => group.results),
    [data.groups],
  );
  const resultIndexes = useMemo(
    () =>
      new Map(
        results.map((result, index) => [`${result.type}:${result.id}`, index]),
      ),
    [results],
  );

  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const navigate = (href: string) => {
    setOpen(false);
    router.push(safeInternalHref(href));
  };

  const submit = (event: SubmitEvent) => {
    event.preventDefault();
    if (activeIndex >= 0 && results[activeIndex]) {
      navigate(results[activeIndex].href);
      return;
    }
    const query = value.trim();
    if (query.length >= 2) navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowDown" && results.length) {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => (current + 1) % results.length);
    } else if (event.key === "ArrowUp" && results.length) {
      event.preventDefault();
      setActiveIndex((current) =>
        current <= 0 ? results.length - 1 : current - 1,
      );
    } else if (event.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  };

  return (
    <div className="relative flex-1" ref={containerRef}>
      <form role="search" onSubmit={submit}>
        <SearchBar
          role="combobox"
          AriaExpanded={open}
          type="search"
          placeholder="Search employees, access, sessions, departments..."
          val={value}
          changeFunc={(value) => {
            onChange(value);
            setOpen(true);
            setActiveIndex(-1);
          }}
          keyDownFunc={onKeyDown}
        />
      </form>

      {open && value.trim().length >= 2 && (
        <div
          id="global-search-results"
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-70 max-h-[70vh] w-full min-w-0 overflow-y-auto rounded-[10px] border border-(--terciary-grey) bg-white p-2 shadow-xl md:min-w-lg"
        >
          {error && <p className="p-3 text-sm text-(--primary-red)">{error}</p>}

          {loading && (
            <div className="flex items-center justify-between gap-3 rounded-lg px-3 py-3 text-sm text-(--primary-grey)">
              <Loader />
              <span className="flex-1">Searching identity records...</span>
            </div>
          )}

          {!loading && !error && data.groups.length === 0 && (
            <p className="p-3 text-sm text-(--primary-grey)">
              No accessible records matched “{value.trim()}”.
            </p>
          )}

          {!loading && data.groups.map((group) => (
            <section
              key={group.type}
              aria-label={group.label}
              className="mb-2 last:mb-0"
            >
              <h2 className="px-3 py-1 text-xs font-bold uppercase tracking-wide text-(--primary-grey)">
                {group.label}
              </h2>
              {group.results.map((result) => {
                const index =
                  resultIndexes.get(`${result.type}:${result.id}`) ?? -1;
                return (
                  <button
                    key={`${result.type}:${result.id}`}
                    type="button"
                    role="option"
                    aria-selected={index === activeIndex}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => navigate(result.href)}
                    className={`block w-full rounded-lg px-3 py-2 text-left ${index === activeIndex ? "bg-(--terciary-grey)" : "hover:bg-(--terciary-grey)"}`}
                  >
                    <span className="block font-semibold">{result.title}</span>
                    <span className="block truncate text-xs text-(--primary-grey)">
                      {result.subtitle}
                    </span>
                  </button>
                );
              })}
            </section>
          ))}

          {!loading && data.total > 0 && (
            <button
              type="button"
              onClick={() =>
                navigate(`/search?q=${encodeURIComponent(value.trim())}`)
              }
              className="w-full border-t border-(--terciary-grey) p-3 text-center font-semibold text-(--primary-blue)"
            >
              View all results
            </button>
          )}
        </div>
      )}
    </div>
  );
}
