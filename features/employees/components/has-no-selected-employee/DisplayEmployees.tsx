"use client";

import { useState } from "react";
import useEmployees from "../../hooks/useEmployees";
import { createEmployeeTableColumns } from "./employeesTableColumns";
import { SectionTitle } from "@/global-components/ui/Title";
import Button from "@/global-components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchFilterSort, {
  type DepartmentFilter,
  type EmployeeSortOption,
  type StatusFilter,
} from "./SearchFilterSort";
import DataTable from "@/global-components/ui/DataTable";
import { PAGE_META_DATA } from "../../constants/PAGE_META_DATA";
import { EmployeeStatus, EmployeeTableRow } from "../../types/employeesTypes";
import { User } from "@/app/auth";
import { getEmployee } from "../../services/employee";
import { execute } from "@/lib";

const employeeTableColumns = createEmployeeTableColumns();

export default function DisplayEmployees() {
  const { state } = useEmployees();
  const [searchValue, setSearchValue] = useState("");
  const [showProvisionNotice, setShowProvisionNotice] = useState(false);
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All statuses");
  const [departmentFilter, setDepartmentFilter] =
    useState<DepartmentFilter>("All Departments");
  const [sortOption, setSortOption] =
    useState<EmployeeSortOption>("Default order");

  const normalizedSearch = searchValue.trim().toLocaleLowerCase();
  const filteredEmployees = state.employees.filter((employee) => {
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
    const employeeStatus = getEmployeeStatus(employee);
    const matchesStatus =
      statusFilter === "All statuses" ||
      employeeStatus === statusFilter.toLocaleLowerCase();
    const employeeDepartment =
      employee.employment?.departmentId ?? employee.profile?.department;
    const matchesDepartment =
      departmentFilter === "All Departments" ||
      employeeDepartment?.toLocaleLowerCase() ===
        departmentFilter.toLocaleLowerCase();

    return matchesSearch && matchesStatus && matchesDepartment;
  });
  const sortedEmployees = [...filteredEmployees].sort((first, second) => {
    if (sortOption === "Name A-Z") {
      return first.name.localeCompare(second.name);
    }
    if (sortOption === "Name Z-A") {
      return second.name.localeCompare(first.name);
    }
    if (sortOption === "Recently active") {
      return getActivityTime(second) - getActivityTime(first);
    }
    if (sortOption === "Least recently active") {
      return getActivityTime(first) - getActivityTime(second);
    }

    return 0;
  });

  const visibleEmployees = sortedEmployees
    .slice(
      (state.currentPage - 1) * state.pageSize,
      state.currentPage * state.pageSize,
    )
    .map(toEmployeeTableRow);

  const updateCriteria = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    state.setCurrentPage(1);
  };

  const fetchEmployeeData = async (employeeData: EmployeeTableRow) =>
    execute(() => getEmployee(employeeData.id), {
      setLoading: state.setFetchingEmployees,
      setError: state.setFetchingEmployeesError,
      onSuccess: (employee) => state.setSelectedEmployee(employee),
    });

  return (
    <div className="uniform-page-display">
      <div className="flex items-center">
        <div className="flex-1">
          <SectionTitle
            title={PAGE_META_DATA.title}
            subtitle={PAGE_META_DATA.subtitle}
          />
        </div>

        <Button
          buttonText="Provision Employee"
          flipDirection
          clickAction={() => setShowProvisionNotice(true)}
        >
          <FontAwesomeIcon icon={["fas", "user-plus"]} />
        </Button>
      </div>

      <SearchFilterSort
        searchValue={searchValue}
        status={statusFilter}
        department={departmentFilter}
        sort={sortOption}
        onSearchChange={(value) => updateCriteria(setSearchValue, value)}
        onStatusChange={(value) => updateCriteria(setStatusFilter, value)}
        onDepartmentChange={(value) =>
          updateCriteria(setDepartmentFilter, value)
        }
        onSortChange={(value) => updateCriteria(setSortOption, value)}
      />

      {showProvisionNotice ? (
        <div
          className="overlay"
          onClick={() => setShowProvisionNotice(false)}
        >
          <div
            className="w-full max-w-xl rounded-[10px] border border-(--terciary-grey) bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-(--secondary-blue)/15 text-(--secondary-blue)">
                <FontAwesomeIcon icon={["fas", "user-plus"]} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-style__big-text text-(--primary-blue)">
                  Provisioning flow
                </div>
                <div className="mt-1 text-style__small-text text-(--primary-grey)">
                  Employee provisioning is backed by Keycloak user search and
                  identity-service profile creation. Use this once the dedicated
                  provisioning picker is connected; existing employees can be
                  managed from the workforce directory.
                </div>
              </div>
              <button
                type="button"
                aria-label="Close provisioning notice"
                className="buttonize rounded-[10px] p-2.5 text-(--primary-grey) hover:bg-(--terciary-grey)/30 hover:text-(--primary-blue)"
                onClick={() => setShowProvisionNotice(false)}
              >
                <FontAwesomeIcon icon={["fas", "xmark"]} />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <DataTable
        title="Workforce directory"
        description={
          filteredEmployees.length === state.employees.length
            ? `${state.employees.length} ${state.employees.length === 1 ? "employee" : "employees"}`
            : `${filteredEmployees.length} of ${state.employees.length} employees`
        }
        headerAside={
          <div className="flex items-center gap-2 text-style__small-text text-(--primary-grey)">
            <span className="h-2 w-2 rounded-full bg-(--primary-green)" />
            Identity data
          </div>
        }
        columns={employeeTableColumns}
        data={visibleEmployees}
        getRowId={(employee) => employee.id}
        minWidthClassName="min-w-280"
        pagination={{
          totalItems: filteredEmployees.length,
          currentPage: state.currentPage,
          pageSize: state.pageSize,
          onPageChange: state.setCurrentPage,
          onPageSizeChange: state.setPageSize,
          dataType: "employees",
        }}
        getData={fetchEmployeeData}
        emptyState={
          <div className="grid min-h-44 place-items-center px-5 py-10 text-center">
            <div>
              <div className="mx-auto mb-3 grid h-10 w-10 place-items-center rounded-full bg-(--terciary-grey)/25 text-(--primary-grey)">
                <FontAwesomeIcon icon={["fas", "user-group"]} />
              </div>

              <div className="text-style__body--bold text-(--primary-blue)">
                No employees found
              </div>

              <p className="mt-1 text-style__small-text text-(--primary-grey)">
                Provision an employee or adjust the current filters.
              </p>
            </div>
          </div>
        }
      />
    </div>
  );
}

function toEmployeeTableRow(employee: User): EmployeeTableRow {
  const accessRoles = employee.access?.roles ?? [];
  const appAccess = employee.access?.appAccess ?? [];
  const status = getEmployeeStatus(employee);
  const lastActivity = employee.activitySummary?.lastActiveAt ?? null;

  return {
    id: employee.id,
    name: employee.name,
    email: employee.email,
    department:
      employee.employment?.departmentId ?? employee.profile?.department,
    title: employee.employment?.jobTitle ?? employee.profile?.jobTitle,
    manager: employee.employment?.managerId,
    status,
    appCount: appAccess.length,
    roleCount: accessRoles.length,
    sessionCount: 0,
    sessions: 0,
    lastActivity,
  };
}

function getEmployeeStatus(employee: User): EmployeeStatus {
  if (employee.status) return employee.status;

  const accountStatus = employee.security?.accountStatus;
  if (accountStatus === "active" || accountStatus === "suspended") {
    return accountStatus;
  }

  return "unset";
}

function getActivityTime(employee: User) {
  const lastActivity = employee.activitySummary?.lastActiveAt;

  if (!lastActivity) return 0;

  const time = new Date(lastActivity).getTime();
  return Number.isNaN(time) ? 0 : time;
}
