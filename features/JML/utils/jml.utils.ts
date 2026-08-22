import type { AppId, EmploymentProfile, EmploymentType, RoleId } from "@/app/auth";
import type {
  JMLAccessAssignment,
  JMLEmploymentForm,
  JMLProvisionedUser,
  MoveEmployeeInput,
  MoverChangeForm,
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
    departmentId: employment.departmentCode || undefined,
    departmentRefId: employment.departmentId || undefined,
    departmentName: employment.departmentName || undefined,
    jobProfileId: employment.jobProfileId || undefined,
    jobTitle: employment.jobTitle || undefined,
    employmentType: employment.employmentType
      ? (employment.employmentType as EmploymentType)
      : undefined,
    workLocation: employment.workLocation || undefined,
    managerId: employment.managerId || undefined,
    managerName: employment.managerName || undefined,
    startDate: employment.startDate || undefined,
  } as EmploymentProfile;
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

export function getMoverChangeRows(
  user: JMLProvisionedUser | null,
  change: MoverChangeForm,
) {
  const currentEmployment = user?.employment;
  return [
    {
      key: "departmentId" as const,
      label: "Department",
      current: currentEmployment?.departmentId ?? "",
      next: change.departmentName || currentEmployment?.departmentId || "",
      changed: Boolean(change.departmentId) &&
        (currentEmployment?.departmentRefId
          ? change.departmentId !== currentEmployment.departmentRefId
          : change.departmentCode !== currentEmployment?.departmentId),
    },
    {
      key: "jobProfileId" as const,
      label: "Title",
      current: currentEmployment?.jobTitle ?? "",
      next: change.jobTitle || currentEmployment?.jobTitle || "",
      changed: Boolean(change.jobProfileId) &&
        (currentEmployment?.jobProfileId
          ? change.jobProfileId !== currentEmployment.jobProfileId
          : change.jobTitle !== currentEmployment?.jobTitle),
    },
    {
      key: "managerId" as const,
      label: "Manager",
      current: currentEmployment?.managerId ?? "",
      next:
        change.managerName || change.managerId || currentEmployment?.managerId || "",
      changed: Boolean(change.managerId) &&
        change.managerId !== currentEmployment?.managerId,
    },
  ];
}

export function toMoveEmployeeInput(
  user: JMLProvisionedUser,
  change: MoverChangeForm,
): MoveEmployeeInput {
  const rows = getMoverChangeRows(user, change);
  const employment: MoveEmployeeInput["employment"] = {};
  if (rows.some((row) => row.key !== "managerId" && row.changed)) {
    employment.departmentId = change.departmentId;
    employment.jobProfileId = change.jobProfileId;
  }
  if (rows.find((row) => row.key === "managerId")?.changed) {
    employment.managerId = change.managerId;
  }

  if (!change.reasonCode) {
    throw new Error("A structured move reason is required.");
  }

  return {
    employment,
    reasonCode: change.reasonCode,
    reasonDetails: change.reasonDetails.trim() || undefined,
    effectiveDate: change.effectiveDate,
  };
}
