"use client";

import { hasPermission, PERMISSIONS } from "@/app/auth";
import useEmployeePowerdeedAccess from "@features/employees/hooks/useEmployeePowerdeedAccess";
import UserPermissions from "../../tables/UserPermissions";
import UserPermissionExceptions from "../../tables/UserExceptions";
import UserRoles from "../../tables/UserRoles";
import PermissionPicker from "../../tables/PermissionPicker";
import RolePicker from "../../tables/RolePicker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Button from "@/global-components/ui/Button";
import { formatLabel } from "@/features/employees/utils/formatLabel";
import { useGlobals } from "@/globals";
import Loader from "@/global-components/ui/Loader";

export default function PowerdeedAccess() {
  const { globalStates } = useGlobals();
  const {
    state,
    employee,
    accessRegistry,
    pickerMode,
    roleRemovalDialog,
    setRoleRemovalDialog,
    permissionRemovalTarget,
    setPermissionRemovalTarget,
    directPermissions,
    effectivePermissions,
    assignedRoles,
    rolePermissionsCount,
    openPicker,
    closePicker,
    addDirectPermission,
    confirmDirectPermissionRemoval,
    addRole,
    removeRole,
    confirmRoleRemoval,
  } = useEmployeePowerdeedAccess();

  if (!employee) return null;

  const canManageAccess =
    hasPermission(globalStates.user, PERMISSIONS.IDENTITY_ACCESS_MANAGE) ||
    hasPermission(globalStates.user, PERMISSIONS.IDENTITY_USERS_MANAGE);

  return (
    <div className="vertical-layout__outer">
      {state.fetchingEmployeeDataError ? (
        <div className="rounded-[10px] border border-(--primary-red)/30 bg-(--primary-red)/10 p-3 text-style__small-text text-(--primary-red)">
          {state.fetchingEmployeeDataError}
        </div>
      ) : null}

      <UserRoles
        roles={assignedRoles}
        isSaving={state.fetchingEmployeeData}
        onAssignRole={canManageAccess ? () => openPicker("role") : undefined}
        onRemoveRole={canManageAccess ? removeRole : undefined}
      />
      <UserPermissions permissions={employee.permissions ?? []} />
      <UserPermissionExceptions
        permissions={directPermissions}
        isSaving={state.fetchingEmployeeData}
        onAddPermission={
          canManageAccess ? () => openPicker("permission") : undefined
        }
        onRemovePermission={
          canManageAccess ? setPermissionRemovalTarget : undefined
        }
      />

      {canManageAccess && state.isPermissionsRegistryOpen && pickerMode && (
        <div className="overlay" onClick={closePicker}>
          <div
            className="flex max-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col rounded-[10px] border border-(--terciary-grey) bg-white p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex shrink-0 items-center gap-3 border-b border-(--terciary-grey) pb-3">
              <div className="flex-1">
                <div className="text-style__big-text text-(--primary-blue)">
                  {pickerMode === "role" ? "Role picker" : "Permission picker"}
                </div>
                <div className="text-style__small-text text-(--primary-grey)">
                  {pickerMode === "role"
                    ? "Choose a Powerdeed role to assign to this employee."
                    : "Choose a permission to add as a direct permission exception."}
                </div>
              </div>

              <button
                type="button"
                aria-label="Close permission picker"
                className="buttonize rounded-[10px] p-2.5 text-(--primary-grey) hover:bg-(--terciary-grey)/30 hover:text-(--primary-blue)"
                onClick={closePicker}
              >
                <FontAwesomeIcon icon={["fas", "xmark"]} />
              </button>
            </div>

            {state.fetchingPermissionsError ||
            state.fetchingEmployeeDataError ? (
              <div className="mb-3 shrink-0 rounded-[10px] border border-(--primary-red)/30 bg-(--primary-red)/10 p-3 text-style__small-text text-(--primary-red)">
                {state.fetchingPermissionsError ||
                  state.fetchingEmployeeDataError}
              </div>
            ) : null}

            <div className="section-scrollbar min-h-0 flex-1 overflow-auto pr-1">
              {accessRegistry ? (
                pickerMode === "role" ? (
                  <RolePicker
                    registry={accessRegistry}
                    assignedRoles={assignedRoles.map((role) => role.roleId)}
                    onSelectRole={addRole}
                    isSaving={state.fetchingEmployeeData}
                  />
                ) : (
                  <PermissionPicker
                    registry={accessRegistry}
                    assignedPermissions={directPermissions}
                    effectivePermissions={effectivePermissions}
                    onSelectPermission={addDirectPermission}
                    isSaving={state.fetchingEmployeeData}
                  />
                )
              ) : (
                <div className="grid min-h-40 place-items-center text-style__small-text text-(--primary-grey)">
                  <Loader /> Loading permissions...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {canManageAccess && roleRemovalDialog && (
        <div className="overlay" onClick={() => setRoleRemovalDialog(null)}>
          <div
            className="w-full max-w-xl rounded-[10px] border border-(--terciary-grey) bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-(--primary-red)/10 text-(--primary-red)">
                <FontAwesomeIcon
                  icon={[
                    "fas",
                    roleRemovalDialog.type === "blocked"
                      ? "shield-halved"
                      : "triangle-exclamation",
                  ]}
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-style__big-text text-(--primary-blue)">
                  {roleRemovalDialog.type === "blocked"
                    ? "Super admin required"
                    : "Remove role?"}
                </div>
                <div className="mt-1 text-style__small-text text-(--primary-grey)">
                  {roleRemovalDialog.type === "blocked"
                    ? `${formatLabel(roleRemovalDialog.roleId)} cannot be removed from ${employee.name} because no other active employee currently has that role. Assign another active super admin first, then try again.`
                    : `You are about to remove ${formatLabel(roleRemovalDialog.roleId)} from ${employee.name}. This can reduce their effective permissions${rolePermissionsCount ? ` by up to ${rolePermissionsCount} permissions` : ""} and may affect their ability to manage users, roles, apps, and security settings.`}
                </div>
              </div>

              <button
                type="button"
                aria-label="Close role removal dialog"
                className="buttonize rounded-[10px] p-2.5 text-(--primary-grey) hover:bg-(--terciary-grey)/30 hover:text-(--primary-blue)"
                onClick={() => setRoleRemovalDialog(null)}
              >
                <FontAwesomeIcon icon={["fas", "xmark"]} />
              </button>
            </div>

            {roleRemovalDialog.type === "confirm" ? (
              <div className="flex justify-end gap-2">
                <Button
                  buttonText="Cancel"
                  buttonType="light"
                  clickAction={() => setRoleRemovalDialog(null)}
                />
                <Button
                  buttonText="Remove role"
                  buttonType="red"
                  disabled={state.fetchingEmployeeData}
                  clickAction={confirmRoleRemoval}
                />
              </div>
            ) : null}
          </div>
        </div>
      )}

      {canManageAccess && permissionRemovalTarget && (
        <div
          className="overlay"
          onClick={() => setPermissionRemovalTarget(null)}
        >
          <div
            className="w-full max-w-xl rounded-[10px] border border-(--terciary-grey) bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-(--primary-yellow)/30 text-(--primary-red)">
                <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="text-style__big-text text-(--primary-blue)">
                  Remove permission exception?
                </div>
                <div className="mt-1 text-style__small-text text-(--primary-grey)">
                  You are about to remove{" "}
                  <span className="font-bold text-(--primary-blue)">
                    {permissionRemovalTarget}
                  </span>{" "}
                  from {employee.name}. If this permission is not provided by
                  one of their roles, they will lose it immediately.
                </div>
              </div>

              <button
                type="button"
                aria-label="Close permission removal dialog"
                className="buttonize rounded-[10px] p-2.5 text-(--primary-grey) hover:bg-(--terciary-grey)/30 hover:text-(--primary-blue)"
                onClick={() => setPermissionRemovalTarget(null)}
              >
                <FontAwesomeIcon icon={["fas", "xmark"]} />
              </button>
            </div>

            <div className="flex justify-end gap-2">
              <Button
                buttonText="Cancel"
                buttonType="light"
                clickAction={() => setPermissionRemovalTarget(null)}
              />
              <Button
                buttonText="Remove exception"
                buttonType="red"
                disabled={state.fetchingEmployeeData}
                clickAction={confirmDirectPermissionRemoval}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
