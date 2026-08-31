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
  DEPARTMENT: string;
  "JOB PROFILE": string;
  TEAM: string;
  "EMPLOYEE TYPE": EmploymentType;
  "WORK LOCATION": string;
  "START DATE": string;
  "END DATE": string;
  MANAGER: string;
};
import type { EmploymentType } from "@/globals/types/user.type";
