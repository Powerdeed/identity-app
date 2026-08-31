"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useMemo, useRef, useState } from "react";

export type SearchableSelectOption = {
  value: string;
  label: string;
  description?: string;
  disabled?: boolean;
};

type SearchableSelectProps = {
  value: string;
  options: SearchableSelectOption[];
  onChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  selectedLabel?: string;
  emptyMessage?: string;
  onSearchChange?: (search: string) => void;
};

export default function SearchableSelect({
  value,
  options,
  onChange,
  placeholder = "Select an option",
  searchPlaceholder = "Search options",
  disabled = false,
  isLoading = false,
  selectedLabel,
  emptyMessage = "No matching options.",
  onSearchChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const selected = options.find((option) => option.value === value);
  const displayLabel = selected?.label ?? (value ? selectedLabel : undefined);
  const filteredOptions = useMemo(() => {
    const query = search.trim().toLocaleLowerCase();
    if (!query) return options;
    return options.filter((option) =>
      `${option.label} ${option.description ?? ""}`
        .toLocaleLowerCase()
        .includes(query),
    );
  }, [options, search]);

  useEffect(() => {
    if (!open) return;
    const closeOnOutsideClick = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    return () => document.removeEventListener("mousedown", closeOnOutsideClick);
  }, [open]);

  return (
    <div ref={containerRef} className="relative min-w-0 w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="input-style flex min-h-10 w-full items-center gap-2.5 text-left disabled:cursor-not-allowed disabled:opacity-60"
      >
        <span
          className={`flex-1 truncate ${selected ? "" : "text-(--primary-grey)"}`}
        >
          {displayLabel ?? placeholder}
        </span>
        <FontAwesomeIcon
          icon={["fas", "angle-down"]}
          className="text-(--primary-grey)"
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full min-w-64 rounded-lg border border-(--terciary-grey) bg-white p-2 shadow-lg">
          <div className="flex items-center gap-2 border-b border-(--terciary-grey) px-2 pb-2">
            <FontAwesomeIcon
              icon={["fas", "magnifying-glass"]}
              className="text-(--primary-grey)"
            />
            <input
              autoFocus
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                onSearchChange?.(event.target.value);
              }}
              placeholder={searchPlaceholder}
              className="min-w-0 flex-1 outline-none text-style__small-text"
            />
          </div>
          <ul
            role="listbox"
            className="section-scrollbar mt-1 max-h-56 overflow-y-auto"
          >
            {isLoading && (
              <li className="px-2 py-4 text-center text-style__small-text text-(--primary-grey)">
                Loading options...
              </li>
            )}
            {!isLoading &&
              filteredOptions.map((option) => (
                <li
                  key={option.value}
                  role="option"
                  aria-selected={option.value === value}
                >
                  <button
                    type="button"
                    disabled={option.disabled}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      setSearch("");
                      onSearchChange?.("");
                    }}
                    className={`w-full rounded-md px-2 py-2 text-left hover:bg-(--terciary-grey)/20 disabled:cursor-not-allowed disabled:opacity-50 ${option.value === value ? "bg-(--secondary-blue)/10 text-(--secondary-blue)" : ""}`}
                  >
                    <div className="text-style__small-text--bold">
                      {option.label}
                    </div>
                    {option.description && (
                      <div className="truncate text-style__small-text text-(--primary-grey)">
                        {option.description}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            {!isLoading && !filteredOptions.length && (
              <li className="px-2 py-4 text-center text-style__small-text text-(--primary-grey)">
                {emptyMessage}
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
