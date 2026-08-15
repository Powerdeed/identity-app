"use client";

import Filter from "./Filter";

export type DataTableFilterConfig<T extends string | number> = {
  id: string;
  options: readonly T[];
  value: T;
  placeholder: string;
  onChange: (value: T) => void;
  dropdownSelectorDirection?: "upwards" | "downwards";
};

export default function DataTableFilters({
  filters,
}: {
  filters: DataTableFilterConfig<string | number>[];
}) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2.5">
      {filters.map((filter) => (
        <Filter
          key={filter.id}
          filterOptions={filter.options}
          selectedOption={filter.value}
          setSelectedOption={filter.onChange}
          selectFirstOption={false}
          placeholder={filter.placeholder}
          dropdownSelectorDirection={
            filter.dropdownSelectorDirection ?? "downwards"
          }
          className="text-style__small-text"
        />
      ))}
    </div>
  );
}
