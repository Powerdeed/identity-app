export type EmployeeStatus =
  | "active"
  | "pending"
  | "suspended"
  | "archived"
  | "unset";

export interface EmployeeTableRow {
  id: string;
  name: string;
  email: string;
  department?: string;
  title?: string;
  manager?: string;
  status: EmployeeStatus;
  appCount: number;
  roleCount: number;
  sessionCount?: number;
  lastActivity?: string | null;
  sessions: number;
}

export type EmploymentDetails = {
  "EMPLOYEE NUMBER": string;
  DEPARTMENT: DepartmentId;
  TEAM: string;
  "JOB TITLE": string;
  "POSITION CODE": string;
  SENIORITY: SeniorityLevel;
  "EMPLOYEE TYPE": EmploymentType;
  "WORK LOCATION": string;
  "START DATE": string;
  "END DATE": string;
  MANAGER: string;
};
import type {
  DepartmentId,
  EmploymentType,
  SeniorityLevel,
} from "@/app/auth";
