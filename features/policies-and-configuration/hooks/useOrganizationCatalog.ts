"use client";

import { useCallback, useEffect, useState } from "react";
import { execute } from "@/lib";
import {
  createDepartment,
  createJobProfile,
  getDepartments,
  getJobProfiles,
  setDepartmentStatus,
  setJobProfileStatus,
  updateDepartment,
  updateJobProfile,
} from "../services/organizationCatalog";
import type {
  Department,
  DepartmentInput,
  JobProfile,
  JobProfileInput,
  ReferenceDataStatus,
} from "../types/organizationCatalog.types";

const DEFAULT_PAGE_SIZE = 10;

export default function useOrganizationCatalog() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [jobProfiles, setJobProfiles] = useState<JobProfile[]>([]);
  const [departmentTotal, setDepartmentTotal] = useState(0);
  const [jobProfileTotal, setJobProfileTotal] = useState(0);
  const [departmentPage, setDepartmentPage] = useState(1);
  const [jobProfilePage, setJobProfilePage] = useState(1);
  const [departmentPageSize, setDepartmentPageSize] =
    useState(DEFAULT_PAGE_SIZE);
  const [jobProfilePageSize, setJobProfilePageSize] =
    useState(DEFAULT_PAGE_SIZE);
  const [departmentSearch, setDepartmentSearch] = useState("");
  const [jobProfileSearch, setJobProfileSearch] = useState("");
  const [status, setStatus] = useState<ReferenceDataStatus | "all">("active");
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const loadDepartments = useCallback(
    () =>
      getDepartments({
        search: departmentSearch.trim() || undefined,
        status,
        page: departmentPage,
        pageSize: departmentPageSize,
      }),
    [departmentPage, departmentPageSize, departmentSearch, status],
  );
  const loadJobProfiles = useCallback(
    () =>
      getJobProfiles({
        search: jobProfileSearch.trim() || undefined,
        status,
        page: jobProfilePage,
        pageSize: jobProfilePageSize,
      }),
    [jobProfilePage, jobProfilePageSize, jobProfileSearch, status],
  );

  const refresh = useCallback(
    () =>
      execute(
        () => Promise.all([loadDepartments(), loadJobProfiles()]),
        {
          setLoading: setIsLoading,
          setError,
          onSuccess: ([departmentData, jobProfileData]) => {
            setDepartments(departmentData.departments);
            setDepartmentTotal(departmentData.total);
            setJobProfiles(jobProfileData.jobProfiles);
            setJobProfileTotal(jobProfileData.total);
          },
        },
      ),
    [loadDepartments, loadJobProfiles],
  );

  useEffect(() => {
    const timeout = window.setTimeout(refresh, 250);
    return () => window.clearTimeout(timeout);
  }, [refresh]);

  const runMutation = <T,>(
    operation: () => Promise<T>,
    message: string,
  ) =>
    execute(operation, {
      setLoading: setIsSaving,
      setError,
      onSuccess: () => {
        setSuccessMessage(message);
        void refresh();
      },
    });

  return {
    departments,
    jobProfiles,
    departmentTotal,
    jobProfileTotal,
    departmentPage,
    jobProfilePage,
    departmentPageSize,
    jobProfilePageSize,
    departmentSearch,
    jobProfileSearch,
    status,
    isLoading,
    isSaving,
    error,
    successMessage,
    setDepartmentPage,
    setJobProfilePage,
    setDepartmentPageSize,
    setJobProfilePageSize,
    setDepartmentSearch: (value: string) => {
      setDepartmentPage(1);
      setDepartmentSearch(value);
    },
    setJobProfileSearch: (value: string) => {
      setJobProfilePage(1);
      setJobProfileSearch(value);
    },
    setStatus: (value: ReferenceDataStatus | "all") => {
      setDepartmentPage(1);
      setJobProfilePage(1);
      setStatus(value);
    },
    clearFeedback: () => {
      setError("");
      setSuccessMessage("");
    },
    saveDepartment: (input: DepartmentInput, department?: Department) =>
      runMutation(
        () =>
          department
            ? updateDepartment(department.id, input)
            : createDepartment(input),
        `Department ${department ? "updated" : "created"} successfully.`,
      ),
    saveJobProfile: (input: JobProfileInput, jobProfile?: JobProfile) =>
      runMutation(
        () =>
          jobProfile
            ? updateJobProfile(jobProfile.id, input)
            : createJobProfile(input),
        `Job profile ${jobProfile ? "updated" : "created"} successfully.`,
      ),
    changeDepartmentStatus: (
      department: Department,
      reason: string,
    ) =>
      runMutation(
        () =>
          setDepartmentStatus(
            department.id,
            department.status === "active" ? "inactive" : "active",
            reason,
          ),
        `Department ${department.status === "active" ? "deactivated" : "activated"}.`,
      ),
    changeJobProfileStatus: (jobProfile: JobProfile, reason: string) =>
      runMutation(
        () =>
          setJobProfileStatus(
            jobProfile.id,
            jobProfile.status === "active" ? "inactive" : "active",
            reason,
          ),
        `Job profile ${jobProfile.status === "active" ? "deactivated" : "activated"}.`,
      ),
  };
}
