"use client";

import { useEffect, useState } from "react";
import type { RoleAssignment, RoleId } from "@/globals/types/user.type";
import { execute } from "@/lib";
import { updateEmployeeAccess } from "../services/employeeProfile";
import {
  getAccessRegistry,
  type AccessRegistry,
} from "../services/permissions";
import useEmployees from "./useEmployees";

export type AccessPickerMode = "permission" | "role";
export type RoleRemovalDialog =
  | { type: "confirm"; roleIndex: number; roleId: string }
  | { type: "blocked"; roleId: string };

const SUPER_ADMIN_ROLE = "platform.super_admin";

export default function useEmployeePowerdeedAccess() {
  const { state } = useEmployees();
  const employee = state.selectedEmployee;
  const [accessRegistry, setAccessRegistry] = useState<AccessRegistry | null>(null);
  const [pickerMode, setPickerMode] = useState<AccessPickerMode | null>(null);
  const [roleRemovalDialog, setRoleRemovalDialog] =
    useState<RoleRemovalDialog | null>(null);
  const [permissionRemovalTarget, setPermissionRemovalTarget] =
    useState<string | null>(null);
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
    void execute(getAccessRegistry, {
      setLoading: setFetchingPermissions,
      setError: setFetchingPermissionsError,
      onSuccess: (registry) => {
        setAccessRegistry(registry);
        setPermissions(Object.values(registry.permissions));
      },
    });
  }, [setFetchingPermissions, setFetchingPermissionsError, setPermissions]);

  const directPermissions = employee?.access?.directPermissions ?? [];
  const effectivePermissions = employee?.permissions ?? [];
  const assignedRoles = employee?.access?.roles ?? [];
  const closePicker = () => {
    setPickerMode(null);
    setIsPermissionsRegistryOpen(false);
  };
  const openPicker = (mode: AccessPickerMode) => {
    setPickerMode(mode);
    setIsPermissionsRegistryOpen(true);
  };

  const commitEmployee = (updatedEmployee: NonNullable<typeof employee>) => {
    setSelectedEmployee(updatedEmployee);
    setEmployees((currentEmployees) =>
      currentEmployees.map((listedEmployee) =>
        listedEmployee.id === updatedEmployee.id
          ? updatedEmployee
          : listedEmployee,
      ),
    );
  };

  const updateAccess = (input: {
    roles?: RoleAssignment[];
    directPermissions?: string[];
  }) => {
    if (!employee) throw new Error("An employee must be selected.");
    return updateEmployeeAccess(employee.id, {
      access: {
        appAccess: employee.access?.appAccess ?? [],
        roles: input.roles ?? assignedRoles,
        directPermissions: input.directPermissions ?? directPermissions,
      },
    });
  };

  const runUpdate = (
    input: Parameters<typeof updateAccess>[0],
    onSuccess?: () => void,
  ) =>
    void execute(() => updateAccess(input), {
      setLoading: setFetchingEmployeeData,
      setError: setFetchingEmployeeDataError,
      onSuccess: (updatedEmployee) => {
        commitEmployee(updatedEmployee);
        onSuccess?.();
      },
    });

  const addDirectPermission = (permission: string) => {
    if (
      directPermissions.includes(permission) ||
      effectivePermissions.includes(permission)
    ) return;

    runUpdate(
      { directPermissions: [...new Set([...directPermissions, permission])] },
      closePicker,
    );
  };

  const confirmDirectPermissionRemoval = () => {
    if (!permissionRemovalTarget) return;
    const permission = permissionRemovalTarget;
    setPermissionRemovalTarget(null);
    runUpdate({
      directPermissions: directPermissions.filter(
        (directPermission) => directPermission !== permission,
      ),
    });
  };

  const addRole = (role: string) => {
    if (assignedRoles.some((assignment) => assignment.roleId === role)) return;
    runUpdate(
      {
        roles: [
          ...assignedRoles,
          {
            roleId: role as RoleId,
            scopeType: "global",
            assignedAt: new Date().toISOString(),
          },
        ],
      },
      closePicker,
    );
  };

  const removeRole = (roleIndex: number) => {
    const role = assignedRoles[roleIndex];
    if (!role || !employee) return;

    const hasAnotherActiveSuperAdmin = employees.some(
      (listedEmployee) =>
        listedEmployee.id !== employee.id &&
        listedEmployee.status === "active" &&
        listedEmployee.access?.roles?.some(
          (assignment) => assignment.roleId === SUPER_ADMIN_ROLE,
        ),
    );
    if (role.roleId === SUPER_ADMIN_ROLE && !hasAnotherActiveSuperAdmin) {
      setRoleRemovalDialog({ type: "blocked", roleId: role.roleId });
      return;
    }
    setRoleRemovalDialog({ type: "confirm", roleIndex, roleId: role.roleId });
  };

  const confirmRoleRemoval = () => {
    if (roleRemovalDialog?.type !== "confirm") return;
    const roleIndex = roleRemovalDialog.roleIndex;
    setRoleRemovalDialog(null);
    runUpdate({ roles: assignedRoles.filter((_, index) => index !== roleIndex) });
  };

  const rolePermissionsCount = roleRemovalDialog?.roleId
    ? (accessRegistry?.rolePermissions[roleRemovalDialog.roleId]?.length ?? 0)
    : 0;

  return {
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
  };
}
