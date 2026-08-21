import { identityApiRequest } from "@/lib/api/identityApiRequest";
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
  identityApiRequest<CatalogPage<{ departments: Department[] }>>({
    method: "GET",
    url: "/organization/departments",
    params,
  });

export const createDepartment = async (input: DepartmentInput) => {
  const data = await identityApiRequest<{ department: Department }>({
    method: "POST",
    url: "/organization/departments",
    data: input,
  });
  return data.department;
};

export const updateDepartment = async (id: string, input: DepartmentInput) => {
  const changes = { ...input };
  delete changes.code;
  const data = await identityApiRequest<{ department: Department }>({
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
  const data = await identityApiRequest<{ department: Department }>({
    method: "POST",
    url: `/organization/departments/${id}/${status === "active" ? "activate" : "deactivate"}`,
    data: { reason },
  });
  return data.department;
};

export const getJobProfiles = (params: CatalogListParams = {}) =>
  identityApiRequest<CatalogPage<{ jobProfiles: JobProfile[] }>>({
    method: "GET",
    url: "/organization/job-profiles",
    params,
  });

export const getManagerCandidates = (
  params: Pick<CatalogListParams, "search" | "page" | "pageSize"> & {
    excludeUserId?: string;
  } = {},
) =>
  identityApiRequest<CatalogPage<{ managers: ManagerCandidate[] }>>({
    method: "GET",
    url: "/organization/manager-candidates",
    params,
  });

export const createJobProfile = async (input: JobProfileInput) => {
  const data = await identityApiRequest<{ jobProfile: JobProfile }>({
    method: "POST",
    url: "/organization/job-profiles",
    data: input,
  });
  return data.jobProfile;
};

export const updateJobProfile = async (id: string, input: JobProfileInput) => {
  const changes = { ...input };
  delete changes.code;
  const data = await identityApiRequest<{ jobProfile: JobProfile }>({
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
  const data = await identityApiRequest<{ jobProfile: JobProfile }>({
    method: "POST",
    url: `/organization/job-profiles/${id}/${status === "active" ? "activate" : "deactivate"}`,
    data: { reason },
  });
  return data.jobProfile;
};
