import type { SeniorityLevel } from "@/globals/types/user.type";

export type ReferenceDataStatus = "active" | "inactive";

export type DepartmentSummary = {
  id: string;
  code: string;
  name: string;
};

export type Department = DepartmentSummary & {
  description?: string | null;
  parentId?: string | null;
  parent?: DepartmentSummary | null;
  status: ReferenceDataStatus;
  sortOrder: number;
  deactivatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
  _count?: { children: number; jobProfiles: number };
};

export type JobProfile = {
  id: string;
  code: string;
  title: string;
  description?: string | null;
  departmentId: string;
  department: DepartmentSummary;
  seniorityLevel?: SeniorityLevel | null;
  isPeopleManager: boolean;
  status: ReferenceDataStatus;
  sortOrder: number;
  deactivatedAt?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ManagerCandidate = {
  id: string;
  name: string;
  email: string;
  employment?: {
    departmentId?: string;
    jobProfileId?: string;
    jobTitle?: string;
  };
};

export type DepartmentInput = {
  code?: string;
  name: string;
  description?: string;
  parentId?: string | null;
  sortOrder: number;
};

export type JobProfileInput = {
  code?: string;
  title: string;
  departmentId: string;
  description?: string;
  seniorityLevel?: SeniorityLevel;
  isPeopleManager: boolean;
  sortOrder: number;
};

export type CatalogPage<T> = {
  total: number;
  page: number;
  pageSize: number;
} & T;
