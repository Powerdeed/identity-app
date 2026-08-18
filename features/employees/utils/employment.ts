import type {
  DepartmentId,
  EmploymentProfile,
  EmploymentType,
  SeniorityLevel,
  User,
} from "@/app/auth";
import type { EmploymentDetails } from "../types/employeesTypes";

export const employmentDateFields: Array<keyof EmploymentDetails> = [
  "START DATE",
  "END DATE",
];

export function toEmploymentDetails(employee: User): EmploymentDetails {
  const employment = employee.employment;

  return {
    "EMPLOYEE NUMBER": employment?.employeeNumber || "",
    DEPARTMENT: employment?.departmentId || ("" as DepartmentId),
    TEAM: employment?.teamIds?.join(", ") || "",
    "JOB TITLE": employment?.jobTitle ?? employee.profile?.jobTitle ?? "",
    "POSITION CODE": employment?.positionCode || "",
    SENIORITY: employment?.seniorityLevel || ("" as SeniorityLevel),
    "EMPLOYEE TYPE": employment?.employmentType || ("" as EmploymentType),
    "WORK LOCATION":
      employment?.workLocation ?? employee.profile?.location ?? "",
    "START DATE": toDateInput(employment?.startDate),
    "END DATE": toDateInput(employment?.endDate),
    MANAGER: employment?.managerId || "",
  };
}

export function toEmploymentProfile(
  details: EmploymentDetails,
): EmploymentProfile {
  return {
    employeeNumber: details["EMPLOYEE NUMBER"] || undefined,
    departmentId: details.DEPARTMENT || undefined,
    teamIds: details.TEAM
      ? details.TEAM.split(",")
          .map((team) => team.trim())
          .filter(Boolean)
      : undefined,
    managerId: details.MANAGER || undefined,
    jobTitle: details["JOB TITLE"] || undefined,
    positionCode: details["POSITION CODE"] || undefined,
    seniorityLevel: details.SENIORITY || undefined,
    employmentType: details["EMPLOYEE TYPE"] || undefined,
    workLocation: details["WORK LOCATION"] || undefined,
    startDate: details["START DATE"] || undefined,
    endDate: details["END DATE"] || undefined,
  };
}

export function parseDateInput(value?: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day) : null;
}

export function toDateInput(value?: string | Date) {
  if (!value) return "";

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "" : date.toISOString().slice(0, 10);
}
