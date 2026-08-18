"use client";

import Dotindicator from "@/global-components/ui/Dotindicator";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getDateTimeFormatted } from "@/globals";
import useJML from "../../hooks/useJML";

const sectionTitle = "Verify the Keycloak identity before proceeding.";

export default function VerifyIdentity() {
  const { state } = useJML();
  const employee = state.selectedKeycloakUser;

  if (!employee) return null;

  const employeeDetails = {
    Name: employee.name,
    Username: employee.username || "-",
    "Keycloak ID": employee.id,
    Email: employee.email || "-",
    Created: getDateTimeFormatted(employee.createdAt) || "Unavailable",
    "Email verified": employee.emailVerified ? "Yes" : "No",
    "Keycloak account": employee.enabled ? "Enabled" : "Disabled",
  };
  const employeeDetailsLength = Object.keys(employeeDetails).length;

  return (
    <div className="vertical-layout__inner">
      <div className="horizontal-layout bg-(--primary-green-faded)/30 border border-(--primary-green) text-(--primary-green) rounded-[10px] p-2.5">
        <FontAwesomeIcon
          icon={["fas", "check"]}
          className="px-0.5 py-1 border border-(--primary-green) rounded-full"
        />

        <div className="">
          <div className="flex-1">
            <div className="text-style__body--bold">
              {employee.name} selected
            </div>
            <div className="horizontal-layout text-style__small-text text-(--secondary-green)">
              <div>{employee.email}</div>
              <Dotindicator color="bg-(--secondary-green)" />
              <div>{employee.id}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="text-(--primary-grey) text-style__small-text pb-2.5">
        {sectionTitle}
      </div>

      {Object.entries(employeeDetails).map(([title, detail], i) => (
        <div
          key={title}
          className={`horizontal-layout text-style__small-text ${employeeDetailsLength !== i + 1 ? "border-b border-(--terciary-grey) pb-2.5" : ""}`}
        >
          <div className="flex-1 text-(--primary-grey)">{title}</div>
          <div>{detail}</div>
        </div>
      ))}
    </div>
  );
}
