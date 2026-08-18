"use client";

import useJMLAccessOptions from "../../hooks/useJMLAccessOptions";

export default function AssignAccess() {
  const access = useJMLAccessOptions();

  if (access.isLoading) {
    return (
      <div className="text-style__small-text text-(--primary-grey)">
        Loading access options...
      </div>
    );
  }

  return (
    <div className="vertical-layout__outer">
      <div className="vertical-layout__inner">
        <div className="text-style__body--bold">Keycloak Groups</div>
        {access.groups.map((group, i) => (
          <div
            key={group.id}
            className={`text-style__body ${access.groups.length !== i + 1 ? "border-b border-(--terciary-grey)" : ""}`}
          >
            <input
              id={`jml-group-${group.id}`}
              type="checkbox"
              className="mx-2.5"
              checked={access.selectedGroupIds.includes(group.id)}
              disabled={access.existingGroupIds.includes(group.id)}
              onChange={() => access.toggleGroup(group.id)}
            />

            <label htmlFor={`jml-group-${group.id}`}>{group.name}</label>
          </div>
        ))}

        {!access.groups.length && (
          <div className="text-style__small-text text-(--primary-grey)">
            No Keycloak groups are available.
          </div>
        )}
      </div>

      <div className="vertical-layout__inner">
        <div className="text-style__body--bold">Powerdeed Roles</div>
        {access.roles.map((role, i) => (
          <div
            key={role}
            className={`text-style__body ${access.roles.length !== i + 1 ? "border-b border-(--terciary-grey)" : ""}`}
          >
            <input
              id={`jml-role-${role}`}
              type="checkbox"
              className="mx-2.5"
              checked={access.selectedRoleIds.includes(role)}
              onChange={() => access.toggleRole(role)}
            />
            <label htmlFor={`jml-role-${role}`}>{role}</label>
          </div>
        ))}

        {!access.roles.length && (
          <div className="text-style__small-text text-(--primary-grey)">
            No Powerdeed roles are available.
          </div>
        )}
      </div>
    </div>
  );
}
