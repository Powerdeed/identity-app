"use client";

import { getInitials } from "@/global-components/layout/nav";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";

import useEmployees from "../../hooks/useEmployees";

import { STATUS_STYLES } from "../../constants/STATUS_STYLES";
import { navMenu } from "../../constants/EMPLOYEE_NAV_MENU";

import { formatLabel } from "../../utils/formatLabel";
import { IconName } from "@fortawesome/fontawesome-svg-core";

const accountActionReg = {
  Pending: { action: "Activate", icon: "check" },
  Suspended: { action: "Activate", icon: "unlock" },
  Active: { action: "Suspend", icon: "ban" },
};

export default function Header() {
  const { states } = useEmployees();
  const accountStatus: "Pending" | "Active" | "Suspended" = "Active"; // TODO: create function to get user status

  const employee = states.employees.find(
    ({ id }) => id === states.selectedEmployee,
  );

  return (
    employee && (
      <div className="p-[20_20_0_20] bg-white flex flex-col gap-5">
        <div className="horizontal-layout">
          <FontAwesomeIcon
            icon={["fas", "angle-left"]}
            className="buttonize p-2 hover:bg-(--terciary-grey)/50 cursor-pointer rounded-[10px]"
          />

          <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-(--primary-blue) text-style__small-text--bold text-white">
            {getInitials(employee.name)}
          </div>

          <div className="w-full">
            <div className="horizontal-layout flex-1">
              <div className="text-style__big-text">{employee.name}</div>

              <span
                className={`inline-flex rounded-[10px] border px-2 text-style__small-text ${STATUS_STYLES[employee.status]}`}
              >
                {formatLabel(employee.status)}
              </span>

              <span
                className={`inline-flex rounded-[10px] border px-2 text-style__small-text ${STATUS_STYLES[employee.status]}`}
              >
                Keycloak: enabeled
              </span>
            </div>

            <div className="text-style__small-text text-(--primary-grey)">
              {employee.email} | Engineering Manager | Engineering
            </div>
          </div>

          <Button
            buttonType={accountStatus === "Active" ? "light" : "primary"}
            buttonText={accountActionReg[accountStatus].action}
            icon={
              <FontAwesomeIcon
                icon={["fas", accountActionReg[accountStatus].icon as IconName]}
              />
            }
          />
        </div>

        <ul className="flex items-center text-style__small-text">
          {navMenu.map((menu) => (
            <li
              key={menu}
              className={`px-2.5 h-6 cursor-pointer ${states.currentMenu === menu && "border-b-2 border-(--primary-blue) text-(--primary-blue) font-bold"}`}
              onClick={() => states.setCurrentMenu(menu)}
            >
              {menu}
            </li>
          ))}
        </ul>
      </div>
    )
  );
}
