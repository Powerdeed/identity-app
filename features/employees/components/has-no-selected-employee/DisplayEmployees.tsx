"use client";

import { useMemo, useState } from "react";
import useEmployees from "../../hooks/useEmployees";
import useEmployeesDirectory from "../../hooks/useEmployeesDirectory";
import { createEmployeeTableColumns } from "./employeesTableColumns";
import { SectionTitle } from "@/global-components/ui/Title";
import Button from "@/global-components/ui/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import SearchFilterSort from "./SearchFilterSort";
import type {
  DepartmentFilter,
  EmployeeSortOption,
  StatusFilter,
} from "../../constants/EMPLOYEE_DIRECTORY";
import DataTable from "@/global-components/ui/DataTable";
import { PAGE_META_DATA } from "../../constants/PAGE_META_DATA";
import {
  filterEmployees,
  sortEmployees,
  toEmployeeTableRow,
} from "../../utils/employeeDirectory";

const employeeTableColumns = createEmployeeTableColumns();

export default function DisplayEmployees() {
  const { state } = useEmployees();
  const directory = useEmployeesDirectory();
  const [searchValue, setSearchValue] = useState("");
  const [showProvisionNotice, setShowProvisionNotice] = useState(false);
  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("All statuses");
  const [departmentFilter, setDepartmentFilter] =
    useState<DepartmentFilter>("All Departments");
  const [sortOption, setSortOption] =
    useState<EmployeeSortOption>("Default order");

  const filteredEmployees = useMemo(
    () =>
      filterEmployees(state.employees, {
        search: searchValue,
        status: statusFilter,
        department: departmentFilter,
        sort: sortOption,
      }),
    [departmentFilter, searchValue, state.employees, statusFilter, sortOption],
  );
  const visibleEmployees = useMemo(
    () =>
      sortEmployees(filteredEmployees, sortOption)
        .slice(
          (state.currentPage - 1) * state.pageSize,
          state.currentPage * state.pageSize,
        )
        .map(toEmployeeTableRow),
    [filteredEmployees, sortOption, state.currentPage, state.pageSize],
  );

  const updateCriteria = <T,>(setter: (value: T) => void, value: T) => {
    setter(value);
    state.setCurrentPage(1);
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
        getData={directory.selectEmployee}
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
