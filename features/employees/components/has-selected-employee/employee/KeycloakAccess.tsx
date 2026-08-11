"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";
import ContainerTitle from "@/global-components/ui/ContainerTitle";

const SESSION_IMPACT =
  "Session impact: Adding or removing Keycloak groups or roles will revoke all active Powerdeed sessions for this employee so they receive a fresh entitlement snapshot on next login. Always review active sessions before making changes.";

// TODO: Create a function to get this data
const keycloakGroupMemberships = new Set(["hr-staff", "people-data-read"]);
const keycloakGroupMembershipList = Array.from(keycloakGroupMemberships);

// TODO: Create a function to get this data
const directRealmRoles = new Set(["hr-staff", "people-data-read"]);
const directRealmRolesList = Array.from(directRealmRoles);

export default function KeycloakAccess() {
  return (
    <div className="vertical-layout__outer text-style__body">
      <div className="horizontal-layout p-5 rounded-[10px] text-style__small-text border border-(--primary-yellow) bg-(--primary-yellow)/30 text-(--primary-red)">
        <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} />
        <div>{SESSION_IMPACT}</div>
      </div>

      {/* Keycloak Group Membership */}
      <div className="feature-container-vertical">
        <ContainerTitle
          title="Keycloak Group Membership"
          el={<Button buttonText="+ Add Group" />}
        />

        {keycloakGroupMembershipList.map((group, i) => (
          <div
            key={group}
            className={`${i !== keycloakGroupMembershipList.length - 1 ? "border-b border-(--terciary-grey) pb-2.5" : ""} horizontal-layout justify-between`}
          >
            <div className="text-(--primary-green)">{group}</div>
            <FontAwesomeIcon
              icon={["fas", "xmark"]}
              className="buttonize text-style__small-text hover:bg-(--terciary-grey)/30 hover:text-(--primary-red) p-1.5 rounded-[10px]"
            />
          </div>
        ))}

        {!keycloakGroupMembershipList.length && (
          <div className="text-style__small-text text-(--primary-grey)">
            No Keycloak Group Memberships assigned.
          </div>
        )}
      </div>

      {/* Direct Realm Roles */}
      <div className="feature-container-vertical">
        <ContainerTitle title="Direct Realm Roles" />

        {directRealmRolesList.map((group, i) => (
          <div
            key={group}
            className={`${i !== directRealmRolesList.length - 1 ? "border-b border-(--terciary-grey) pb-2.5" : ""} horizontal-layout justify-between`}
          >
            <div className="text-(--primary-green)">{group}</div>
            <FontAwesomeIcon
              icon={["fas", "xmark"]}
              className="buttonize text-style__small-text hover:bg-(--terciary-grey)/30 hover:text-(--primary-red) p-1.5 rounded-[10px]"
            />
          </div>
        ))}

        {!directRealmRolesList.length && (
          <div className="text-style__small-text text-(--primary-grey)">
            No direct realm roles assigned.
          </div>
        )}
      </div>
    </div>
  );
}
