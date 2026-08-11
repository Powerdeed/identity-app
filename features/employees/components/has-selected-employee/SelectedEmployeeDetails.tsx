"use client";

import useEmployees from "../../hooks/useEmployees";
import Header from "./Header";
import Activity from "./employee/Activity";
import Employment from "./employee/Employment";
import KeycloakAccess from "./employee/KeycloakAccess";
import Lifecycle from "./employee/Lifecycle";
import Overview from "./employee/Overview";
import PowerdeedAccess from "./employee/PowerdeedAccess";
import SessionsAndDevices from "./employee/Sessions&Devices";

export default function SelectedEmployeeDetails() {
  const { states } = useEmployees();

  return (
    <div>
      <Header />

      <div className="p-5">
        {states.currentMenu === "Overview" ? <Overview /> : null}
        {states.currentMenu === "Employment" ? <Employment /> : null}
        {states.currentMenu === "Powerdeed Access" ? <PowerdeedAccess /> : null}
        {states.currentMenu === "Keycloak Access" ? <KeycloakAccess /> : null}
        {states.currentMenu === "Sessions & Devices" ? (
          <SessionsAndDevices />
        ) : null}
        {states.currentMenu === "Lifecycle" ? <Lifecycle /> : null}
        {states.currentMenu === "Activity" ? <Activity /> : null}
      </div>
    </div>
  );
}
