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
