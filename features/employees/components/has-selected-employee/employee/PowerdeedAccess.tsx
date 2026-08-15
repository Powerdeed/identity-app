"use client";

import useEmployees from "@features/employees/hooks/useEmployees";
import UserPermissions from "../../tables/UserPermissions";
import UserPermissionExceptions from "../../tables/UserExceptions";
import UserRoles from "../../tables/UserRoles";
import { useEffect, useState } from "react";
import { execute } from "@/lib";
import {
  getAccessRegistry,
  type AccessRegistry,
} from "@/features/employees/services/permissions";
import PermissionPicker from "../../tables/PermissionPicker";
import RolePicker from "../../tables/RolePicker";
import { updateEmployeeAccess } from "@/features/employees/services/employee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { RoleAssignment, RoleId } from "@/app/auth";
import Button from "@/global-components/ui/Button";

type AccessPickerMode = "permission" | "role" | null;

type RoleRemovalDialog =
  | {
      type: "confirm";
      roleIndex: number;
      roleId: string;
    }
  | {
      type: "blocked";
      roleId: string;
    }
  | null;

const SUPER_ADMIN_ROLE = "platform.super_admin";

function formatRoleLabel(role: string) {
  return role
    .replace(/[._-]+/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PowerdeedAccess() {
  const { state } = useEmployees();
  const employee = state.selectedEmployee;
  const [accessRegistry, setAccessRegistry] = useState<AccessRegistry | null>(
    null,
  );
  const [pickerMode, setPickerMode] = useState<AccessPickerMode>(null);
  const [roleRemovalDialog, setRoleRemovalDialog] =
    useState<RoleRemovalDialog>(null);
  const [permissionRemovalTarget, setPermissionRemovalTarget] = useState<
    string | null
  >(null);
  const {
    employees,
    setEmployees,
    setFetchingPermissions,
    setFetchingPermissionsError,
    setPermissions,
    setIsPermissionsRegistryOpen,
    setFetchingEmployeeData,
    setFetchingEmployeeDataError,
    setSelectedEmployee,
  } = state;

  useEffect(() => {
    const fetchPermissions = async () =>
      execute(getAccessRegistry, {
        setLoading: setFetchingPermissions,
        setError: setFetchingPermissionsError,
        onSuccess: (registry) => {
          setAccessRegistry(registry);
          setPermissions(Object.values(registry.permissions));
        },
      });

    fetchPermissions();
  }, [setFetchingPermissions, setFetchingPermissionsError, setPermissions]);

  if (!employee) return null;

  const directPermissions = employee.access?.directPermissions ?? [];
  const effectivePermissions = employee.permissions ?? [];
  const assignedRoles = employee.access?.roles ?? [];

  const closePicker = () => {
    setPickerMode(null);
    setIsPermissionsRegistryOpen(false);
  };

  const updateAccess = (input: {
    roles?: RoleAssignment[];
    directPermissions?: string[];
  }) =>
    updateEmployeeAccess(employee.id, {
      access: {
        appAccess: employee.access?.appAccess ?? [],
        roles: input.roles ?? assignedRoles,
        directPermissions: input.directPermissions ?? directPermissions,
      },
    });

  const addDirectPermission = (permission: string) => {
    if (
      directPermissions.includes(permission) ||
      effectivePermissions.includes(permission)
    ) {
      return;
    }

    const nextDirectPermissions = [...new Set([...directPermissions, permission])];

    execute(
      () => updateAccess({ directPermissions: nextDirectPermissions }),
      {
        setLoading: setFetchingEmployeeData,
        setError: setFetchingEmployeeDataError,
        onSuccess: (updatedEmployee) => {
          setSelectedEmployee(updatedEmployee);
          setEmployees((employees) =>
            employees.map((listedEmployee) =>
              listedEmployee.id === updatedEmployee.id
                ? updatedEmployee
                : listedEmployee,
            ),
          );
          closePicker();
        },
      },
    );
  };

  const removeDirectPermission = (permission: string) => {
    setPermissionRemovalTarget(permission);
  };

  const confirmDirectPermissionRemoval = () => {
    if (!permissionRemovalTarget) return;

    const permission = permissionRemovalTarget;
    setPermissionRemovalTarget(null);

    execute(
      () =>
        updateAccess({
          directPermissions: directPermissions.filter(
            (directPermission) => directPermission !== permission,
          ),
        }),
      {
        setLoading: setFetchingEmployeeData,
        setError: setFetchingEmployeeDataError,
        onSuccess: (updatedEmployee) => {
          setSelectedEmployee(updatedEmployee);
          setEmployees((employees) =>
            employees.map((listedEmployee) =>
              listedEmployee.id === updatedEmployee.id
                ? updatedEmployee
                : listedEmployee,
            ),
          );
        },
      },
    );
  };

  const addRole = (role: string) => {
    if (assignedRoles.some((assignment) => assignment.roleId === role)) return;

    execute(
      () =>
        updateAccess({
          roles: [
            ...assignedRoles,
            {
              roleId: role as RoleId,
              scopeType: "global",
              assignedAt: new Date().toISOString(),
            },
          ],
        }),
      {
        setLoading: setFetchingEmployeeData,
        setError: setFetchingEmployeeDataError,
        onSuccess: (updatedEmployee) => {
          setSelectedEmployee(updatedEmployee);
          setEmployees((employees) =>
            employees.map((listedEmployee) =>
              listedEmployee.id === updatedEmployee.id
                ? updatedEmployee
                : listedEmployee,
            ),
          );
          closePicker();
        },
      },
    );
  };

  const removeRole = (roleIndex: number) => {
    const role = assignedRoles[roleIndex];
    if (!role) return;

    if (role.roleId === SUPER_ADMIN_ROLE) {
      const hasAnotherActiveSuperAdmin = employees.some(
        (listedEmployee) =>
          listedEmployee.id !== employee.id &&
          listedEmployee.status === "active" &&
          listedEmployee.access?.roles?.some(
            (assignment) => assignment.roleId === SUPER_ADMIN_ROLE,
          ),
      );

      if (!hasAnotherActiveSuperAdmin) {
        setRoleRemovalDialog({
          type: "blocked",
          roleId: role.roleId,
        });
        return;
      }
    }

    setRoleRemovalDialog({
      type: "confirm",
      roleIndex,
      roleId: role.roleId,
    });
  };

  const confirmRoleRemoval = () => {
    if (roleRemovalDialog?.type !== "confirm") return;

    const roleIndex = roleRemovalDialog.roleIndex;
    setRoleRemovalDialog(null);

    execute(
      () =>
        updateAccess({
          roles: assignedRoles.filter((_, index) => index !== roleIndex),
        }),
      {
        setLoading: setFetchingEmployeeData,
        setError: setFetchingEmployeeDataError,
        onSuccess: (updatedEmployee) => {
          setSelectedEmployee(updatedEmployee);
          setEmployees((employees) =>
            employees.map((listedEmployee) =>
              listedEmployee.id === updatedEmployee.id
                ? updatedEmployee
                : listedEmployee,
            ),
          );
        },
      },
    );
  };

  const rolePermissionsCount = roleRemovalDialog?.roleId
    ? (accessRegistry?.rolePermissions[roleRemovalDialog.roleId]?.length ?? 0)
    : 0;

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
        onAssignRole={() => {
          setPickerMode("role");
          setIsPermissionsRegistryOpen(true);
        }}
        onRemoveRole={removeRole}
      />
      <UserPermissions permissions={employee.permissions ?? []} />
      <UserPermissionExceptions
        permissions={directPermissions}
        isSaving={state.fetchingEmployeeData}
        onAddPermission={() => {
          setPickerMode("permission");
          setIsPermissionsRegistryOpen(true);
        }}
        onRemovePermission={removeDirectPermission}
      />

      {state.isPermissionsRegistryOpen && pickerMode && (
        <div
          className="overlay"
          onClick={closePicker}
        >
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
                  Loading permissions...
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {roleRemovalDialog && (
        <div
          className="overlay"
          onClick={() => setRoleRemovalDialog(null)}
        >
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
                    ? `${formatRoleLabel(roleRemovalDialog.roleId)} cannot be removed from ${employee.name} because no other active employee currently has that role. Assign another active super admin first, then try again.`
                    : `You are about to remove ${formatRoleLabel(roleRemovalDialog.roleId)} from ${employee.name}. This can reduce their effective permissions${rolePermissionsCount ? ` by up to ${rolePermissionsCount} permissions` : ""} and may affect their ability to manage users, roles, apps, and security settings.`}
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

      {permissionRemovalTarget && (
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
