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
import { EmployeeTableRow } from "../../types/employeesTypes";

const employeeTableColumns = createEmployeeTableColumns();

export default function DisplayEmployees() {
  const { states } = useEmployees();
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All statuses");
  const [departmentFilter, setDepartmentFilter] =
    useState<DepartmentFilter>("All Departments");
  const [sortOption, setSortOption] =
    useState<EmployeeSortOption>("Default order");

  const normalizedSearch = searchValue.trim().toLocaleLowerCase();
  const filteredEmployees = states.employees.filter((employee) => {
    const matchesSearch =
      !normalizedSearch ||
      [
        employee.name,
        employee.email,
        employee.department,
        employee.title,
        employee.manager,
        employee.status,
      ].some((value) => value?.toLocaleLowerCase().includes(normalizedSearch));
    const matchesStatus =
      statusFilter === "All statuses" ||
      employee.status === statusFilter.toLocaleLowerCase();
    const matchesDepartment =
      departmentFilter === "All Departments" ||
      employee.department?.toLocaleLowerCase() ===
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

  const visibleEmployees = sortedEmployees.slice(
    (states.currentPage - 1) * states.pageSize,
    states.currentPage * states.pageSize,
  );

  const updateCriteria = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    states.setCurrentPage(1);
  };

  const getEmployee = (employeeData: EmployeeTableRow) => {
    states.setSelectedEmployee(employeeData.id);
  };

  return (
    <div className="uniform-page-display">
      <div className="flex items-center">
        <div className="flex-1">
          <SectionTitle
            title={PAGE_META_DATA.title}
            subtitle={PAGE_META_DATA.subtitle}
          />
        </div>

        <Button buttonText="Provision Employee" flipDirection>
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

      <DataTable
        title="Workforce directory"
        description={
          filteredEmployees.length === states.employees.length
            ? `${states.employees.length} ${states.employees.length === 1 ? "employee" : "employees"}`
            : `${filteredEmployees.length} of ${states.employees.length} employees`
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
          currentPage: states.currentPage,
          pageSize: states.pageSize,
          onPageChange: states.setCurrentPage,
          onPageSizeChange: states.setPageSize,
          dataType: "employees",
        }}
        getData={getEmployee}
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

function getActivityTime(employee: EmployeeTableRow) {
  if (!employee.lastActivity) return 0;

  const time = new Date(employee.lastActivity).getTime();
  return Number.isNaN(time) ? 0 : time;
}
