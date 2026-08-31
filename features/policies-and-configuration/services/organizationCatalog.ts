import { apiRequest } from "@lib";

import type {
  CatalogPage,
  Department,
  DepartmentInput,
  JobProfile,
  JobProfileInput,
  ManagerCandidate,
  ReferenceDataStatus,
} from "../types/organizationCatalog.types";

type CatalogListParams = {
  search?: string;
  status?: ReferenceDataStatus | "all";
  departmentId?: string;
  page?: number;
  pageSize?: number;
};

export const getDepartments = (params: CatalogListParams = {}) =>
  apiRequest<CatalogPage<{ departments: Department[] }>>({
    method: "GET",
    url: "/organization/departments",
    params,
  });

export const createDepartment = async (input: DepartmentInput) => {
  const data = await apiRequest<{ department: Department }>({
    method: "POST",
    url: "/organization/departments",
    data: input,
  });
  return data.department;
};

export const updateDepartment = async (id: string, input: DepartmentInput) => {
  const changes = { ...input };
  delete changes.code;
  const data = await apiRequest<{ department: Department }>({
    method: "PATCH",
    url: `/organization/departments/${id}`,
    data: changes,
  });
  return data.department;
};

export const setDepartmentStatus = async (
  id: string,
  status: ReferenceDataStatus,
  reason: string,
) => {
  const data = await apiRequest<{ department: Department }>({
    method: "POST",
    url: `/organization/departments/${id}/${status === "active" ? "activate" : "deactivate"}`,
    data: { reason },
  });
  return data.department;
};

export const getJobProfiles = (params: CatalogListParams = {}) =>
  apiRequest<CatalogPage<{ jobProfiles: JobProfile[] }>>({
    method: "GET",
    url: "/organization/job-profiles",
    params,
  });

export const getManagerCandidates = (
  params: Pick<CatalogListParams, "search" | "page" | "pageSize"> & {
    excludeUserId?: string;
  } = {},
) =>
  apiRequest<CatalogPage<{ managers: ManagerCandidate[] }>>({
    method: "GET",
    url: "/organization/manager-candidates",
    params,
  });

export const createJobProfile = async (input: JobProfileInput) => {
  const data = await apiRequest<{ jobProfile: JobProfile }>({
    method: "POST",
    url: "/organization/job-profiles",
    data: input,
  });
  return data.jobProfile;
};

export const updateJobProfile = async (id: string, input: JobProfileInput) => {
  const changes = { ...input };
  delete changes.code;
  const data = await apiRequest<{ jobProfile: JobProfile }>({
    method: "PATCH",
    url: `/organization/job-profiles/${id}`,
    data: changes,
  });
  return data.jobProfile;
};

export const setJobProfileStatus = async (
  id: string,
  status: ReferenceDataStatus,
  reason: string,
) => {
  const data = await apiRequest<{ jobProfile: JobProfile }>({
    method: "POST",
    url: `/organization/job-profiles/${id}/${status === "active" ? "activate" : "deactivate"}`,
    data: { reason },
  });
  return data.jobProfile;
};
