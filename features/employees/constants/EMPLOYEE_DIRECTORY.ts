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
