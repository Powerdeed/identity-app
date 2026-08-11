"use client";

import UserPermissions from "../../tables/UserPermissions";
import UserPermissionExceptions from "../../tables/UserExceptions";
import UserRoles from "../../tables/UserRoles";

export default function PowerdeedAccess() {
  return (
    <div className="vertical-layout__outer">
      <UserRoles />
      <UserPermissions />
      <UserPermissionExceptions />
    </div>
  );
}
