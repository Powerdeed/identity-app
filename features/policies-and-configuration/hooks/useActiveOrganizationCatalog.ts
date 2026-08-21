"use client";

import { useEffect, useState } from "react";
import { execute } from "@/lib";
import { getDepartments, getJobProfiles } from "../services/organizationCatalog";
import type { Department, JobProfile } from "../types/organizationCatalog.types";

export default function useActiveOrganizationCatalog(
  departmentId?: string,
  departmentSearch = "",
  jobProfileSearch = "",
) {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [jobProfilesDepartmentId, setJobProfilesDepartmentId] = useState("");
  const [isLoadingDepartments, setIsLoadingDepartments] = useState(false);
  const [isLoadingJobProfiles, setIsLoadingJobProfiles] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    const timeout = window.setTimeout(() => {
      execute(
        () =>
          getDepartments({
            status: "active",
            search: departmentSearch.trim() || undefined,
            pageSize: 50,
          }),
        {
          setLoading: (loading) => active && setIsLoadingDepartments(loading),
          setError: (message) => active && setError(message),
          onSuccess: (data) => active && setDepartments(data.departments),
        },
      );
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [departmentSearch]);

  useEffect(() => {
    if (!departmentId) return;
    let active = true;
    const timeout = window.setTimeout(() => {
      execute(
        () =>
          getJobProfiles({
            status: "active",
            departmentId,
            search: jobProfileSearch.trim() || undefined,
            pageSize: 50,
          }),
        {
          setLoading: (loading) => active && setIsLoadingJobProfiles(loading),
          setError: (message) => active && setError(message),
          onSuccess: (data) => {
            if (!active) return;
            setJobProfiles(data.jobProfiles);
            setJobProfilesDepartmentId(departmentId);
          },
        },
      );
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timeout);
    };
  }, [departmentId, jobProfileSearch]);

  return {
    departments,
    jobProfiles:
      departmentId && departmentId === jobProfilesDepartmentId
        ? jobProfiles
        : [],
    isLoading: isLoadingDepartments || isLoadingJobProfiles,
    isLoadingDepartments,
    isLoadingJobProfiles,
    error,
  };
}
