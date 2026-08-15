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
  const { state } = useEmployees();

  return (
    <div>
      <Header />

      <div className="p-5">
        {state.currentMenu === "Overview" ? <Overview /> : null}
        {state.currentMenu === "Employment" ? <Employment /> : null}
        {state.currentMenu === "Powerdeed Access" ? <PowerdeedAccess /> : null}
        {state.currentMenu === "Keycloak Access" ? <KeycloakAccess /> : null}
        {state.currentMenu === "Sessions & Devices" ? (
          <SessionsAndDevices />
        ) : null}
        {state.currentMenu === "Lifecycle" ? <Lifecycle /> : null}
        {state.currentMenu === "Activity" ? <Activity /> : null}
      </div>
    </div>
  );
}
