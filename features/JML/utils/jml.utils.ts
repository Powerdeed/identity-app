import type {
  AppId,
  DepartmentId,
  EmploymentProfile,
  EmploymentType,
  RoleId,
  SeniorityLevel,
} from "@/app/auth";
import type {
  JMLAccessAssignment,
  JMLEmploymentForm,
} from "../types/jml.types";

const appIdByRolePrefix: Partial<Record<string, AppId>> = {
  command_center: "command_center",
  cms: "cms",
  engineering: "engineering",
  sales: "sales",
  finance: "finance",
  hr: "hr",
};

export function toEmploymentProfile(
  employment: JMLEmploymentForm,
): EmploymentProfile {
  return {
    departmentId: employment.departmentId
      ? (employment.departmentId as DepartmentId)
      : undefined,
    teamIds: employment.teamIds
      .split(",")
      .map((team) => team.trim())
      .filter(Boolean),
    jobTitle: employment.jobTitle || undefined,
    positionCode: employment.positionCode || undefined,
    seniorityLevel: employment.seniorityLevel
      ? (employment.seniorityLevel as SeniorityLevel)
      : undefined,
    employmentType: employment.employmentType
      ? (employment.employmentType as EmploymentType)
      : undefined,
    workLocation: employment.workLocation || undefined,
    managerId: employment.managerId || undefined,
    startDate: employment.startDate || undefined,
  };
}

export function toAccessAssignment(
  roleIds: RoleId[],
  assignedAt = new Date().toISOString(),
): JMLAccessAssignment {
  const appAccess = Array.from(
    new Set(
      roleIds
        .map((roleId) => appIdByRolePrefix[roleId.split(".")[0]])
        .filter((appId): appId is AppId => Boolean(appId)),
    ),
  );

  return {
    appAccess,
    roles: roleIds.map((roleId) => ({
      roleId,
      scopeType: "global",
      assignedAt,
      reason: "JML joiner provisioning",
    })),
  };
}
