"use client";

import { getInitials } from "@/global-components/layout/nav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";

import useEmployees from "../../hooks/useEmployees";
import { activateEmployee, suspendEmployee } from "../../services/employee";

import { STATUS_STYLES } from "../../constants/STATUS_STYLES";
import { navMenu } from "../../constants/EMPLOYEE_NAV_MENU";

import { formatLabel } from "../../utils/formatLabel";
import { IconName } from "@fortawesome/fontawesome-svg-core";
import type { EmployeeStatus } from "../../types/employeesTypes";
import { execute } from "@/lib";

const getHeaderAction = (status: EmployeeStatus) => {
  if (status === "pending") return { action: "Activate", icon: "check" };
  if (status === "suspended") return { action: "Activate", icon: "unlock" };
  if (status === "active") return { action: "Suspend", icon: "ban" };

  return null;
};

export default function Header() {
  const { state } = useEmployees();

  const employee = state.employees.find(
    ({ id }) => id === state.selectedEmployee?.id,
  ) ?? state.selectedEmployee;
  const status: EmployeeStatus = employee?.status ?? "unset";
  const headerAction = getHeaderAction(status);
  const department =
    employee?.employment?.departmentId ?? employee?.profile?.department ?? "No department";
  const title =
    employee?.employment?.jobTitle ?? employee?.profile?.jobTitle ?? "No job title";

  const updateEmployeeStatus = () => {
    if (!employee || !headerAction) return;

    const action =
      headerAction.action === "Activate"
        ? () => activateEmployee(employee.id, "Activated from Identity app header.")
        : () => suspendEmployee(employee.id, "Suspended from Identity app header.");

    execute(action, {
      setLoading: state.setFetchingEmployeeData,
      setError: state.setFetchingEmployeeDataError,
      onSuccess: (updatedEmployee) => {
        state.setSelectedEmployee(updatedEmployee);
        state.setEmployees((employees) =>
          employees.map((listedEmployee) =>
            listedEmployee.id === updatedEmployee.id
              ? updatedEmployee
              : listedEmployee,
          ),
        );
      },
    });
  };

  return (
    employee && (
      <div className="p-[20_20_0_20] bg-white flex flex-col gap-5">
        <div className="horizontal-layout">
          <FontAwesomeIcon
            icon={["fas", "angle-left"]}
            className="buttonize p-2 hover:bg-(--terciary-grey)/50 cursor-pointer rounded-[10px]"
            onClick={() => state.setSelectedEmployee(null)}
          />

          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-(--primary-blue) text-style__small-text--bold text-white">
            {getInitials(employee.name)}
          </div>

          <div className="w-full">
            <div className="horizontal-layout flex-1">
              <div className="text-style__big-text">{employee.name}</div>

              <span
                className={`inline-flex rounded-[10px] border px-2 text-style__small-text ${STATUS_STYLES[status]}`}
              >
                {formatLabel(status)}
              </span>

              <span
                className={`inline-flex rounded-[10px] border px-2 text-style__small-text ${STATUS_STYLES[status]}`}
              >
                Keycloak: {employee.keycloakUserId ? "enabled" : "not linked"}
              </span>
            </div>

            <div className="text-style__small-text text-(--primary-grey)">
              {employee.email} | {title} | {formatLabel(department)}
            </div>
          </div>

          {headerAction ? (
            <Button
              buttonType={status === "active" ? "light" : "primary"}
              buttonText={headerAction.action}
              disabled={state.fetchingEmployeeData}
              clickAction={updateEmployeeStatus}
              icon={
                <FontAwesomeIcon
                  icon={["fas", headerAction.icon as IconName]}
                />
              }
            />
          ) : null}
        </div>

        <ul className="flex items-center text-style__small-text">
          {navMenu.map((menu) => (
            <li
              key={menu}
              className={`px-2.5 h-6 cursor-pointer ${state.currentMenu === menu && "border-b-2 border-(--primary-blue) text-(--primary-blue) font-bold"}`}
              onClick={() => state.setCurrentMenu(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
