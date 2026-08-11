"use client";

import SearchBar from "@global-components/ui/SearchBar";
import Filter from "@global-components/ui/Filter";

export const STATUS_FILTERS = [
  "All statuses",
  "Pending",
  "Active",
  "Suspended",
  "Archived",
] as const;

export const DEPARTMENT_FILTERS = [
  "All Departments",
  "Content",
  "Engineering",
  "Executive",
  "Finance",
  "HR",
  "Operations",
] as const;

export const EMPLOYEE_SORT_OPTIONS = [
  "Default order",
  "Name A-Z",
  "Name Z-A",
  "Recently active",
  "Least recently active",
] as const;

export type StatusFilter = (typeof STATUS_FILTERS)[number];
export type DepartmentFilter = (typeof DEPARTMENT_FILTERS)[number];
export type EmployeeSortOption = (typeof EMPLOYEE_SORT_OPTIONS)[number];

interface SearchFilterSortProps {
  searchValue: string;
  status: StatusFilter;
  department: DepartmentFilter;
  sort: EmployeeSortOption;
  onSearchChange: (value: string) => void;
  onStatusChange: (value: StatusFilter) => void;
  onDepartmentChange: (value: DepartmentFilter) => void;
  onSortChange: (value: EmployeeSortOption) => void;
}

export default function SearchFilterSort({
  searchValue,
  status,
  department,
  sort,
  onSearchChange,
  onStatusChange,
  onDepartmentChange,
  onSortChange,
}: SearchFilterSortProps) {
  return (
    <div className="feature-container-horizontal flex-wrap text-style__body">
      <SearchBar
        placeholder="Search employees"
        changeFunc={onSearchChange}
        val={searchValue}
      />

      <Filter
        filterOptions={STATUS_FILTERS}
        selectedOption={status}
        setSelectedOption={onStatusChange}
        selectFirstOption={false}
        placeholder="Select status"
      />

      <Filter
        filterOptions={DEPARTMENT_FILTERS}
        selectedOption={department}
        setSelectedOption={onDepartmentChange}
        selectFirstOption={false}
        placeholder="Select department"
      />

      <Filter
        filterOptions={EMPLOYEE_SORT_OPTIONS}
        selectedOption={sort}
        setSelectedOption={onSortChange}
        selectFirstOption={false}
        placeholder="Sort employees"
      />
    </div>
  );
}
