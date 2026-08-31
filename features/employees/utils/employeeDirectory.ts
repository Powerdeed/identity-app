import type { User } from "@/globals/types/user.type";
import type {
  DepartmentFilter,
  EmployeeSortOption,
  StatusFilter,
} from "../constants/EMPLOYEE_DIRECTORY";
import type {
  EmployeeStatus,
  EmployeeTableRow,
} from "../types/employeesTypes";

export type EmployeeDirectoryCriteria = {
  search: string;
  status: StatusFilter;
  department: DepartmentFilter;
  sort: EmployeeSortOption;
};

export function filterEmployees(
  employees: User[],
  criteria: EmployeeDirectoryCriteria,
) {
  const normalizedSearch = criteria.search.trim().toLocaleLowerCase();

  return employees.filter((employee) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        employee.name,
        employee.email,
        employee.profile?.department,
        employee.profile?.jobTitle,
        employee.employment?.departmentId,
        employee.employment?.jobTitle,
        employee.employment?.managerId,
        employee.status,
      ].some((value) => value?.toLocaleLowerCase().includes(normalizedSearch));
    const matchesStatus =
      criteria.status === "All statuses" ||
      getEmployeeStatus(employee) === criteria.status.toLocaleLowerCase();
    const employeeDepartment =
      employee.employment?.departmentId ?? employee.profile?.department;
    const matchesDepartment =
      criteria.department === "All Departments" ||
      employeeDepartment?.toLocaleLowerCase() ===
        criteria.department.toLocaleLowerCase();

    return matchesSearch && matchesStatus && matchesDepartment;
  });
}

export function sortEmployees(employees: User[], sort: EmployeeSortOption) {
  return [...employees].sort((first, second) => {
    if (sort === "Name A-Z") return first.name.localeCompare(second.name);
    if (sort === "Name Z-A") return second.name.localeCompare(first.name);
    if (sort === "Recently active") {
      return getActivityTime(second) - getActivityTime(first);
    }
    if (sort === "Least recently active") {
      return getActivityTime(first) - getActivityTime(second);
    }

    return 0;
  });
}

export function toEmployeeTableRow(employee: User): EmployeeTableRow {
  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    department:
      employee.employment?.departmentId ?? employee.profile?.department,
    title: employee.employment?.jobTitle ?? employee.profile?.jobTitle,
    manager: employee.employment?.managerId,
    status: getEmployeeStatus(employee),
    appCount: employee.access?.appAccess?.length ?? 0,
    roleCount: employee.access?.roles?.length ?? 0,
    sessionCount: 0,
    sessions: 0,
    lastActivity: employee.activitySummary?.lastActiveAt ?? null,
  };
}

export function getEmployeeStatus(employee: User): EmployeeStatus {
  if (employee.status) return employee.status;

  const accountStatus = employee.security?.accountStatus;
  return accountStatus === "active" || accountStatus === "suspended"
    ? accountStatus
    : "unset";
}

function getActivityTime(employee: User) {
  const lastActivity = employee.activitySummary?.lastActiveAt;
  if (!lastActivity) return 0;

  const time = new Date(lastActivity).getTime();
  return Number.isNaN(time) ? 0 : time;
}
