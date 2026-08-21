"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { hasPermission, PERMISSIONS } from "@/app/auth";
import { useGlobals } from "@/globals";
import Button from "@/global-components/ui/Button";
import DataTable, { type DataTableColumn } from "@/global-components/ui/DataTable";
import SearchableSelect from "@/global-components/ui/SearchableSelect";
import { SectionTitle } from "@/global-components/ui/Title";
import CatalogStatusDialog from "./components/CatalogStatusDialog";
import { DepartmentForm, JobProfileForm } from "./components/CatalogForms";
import useActiveOrganizationCatalog from "./hooks/useActiveOrganizationCatalog";
import useOrganizationCatalog from "./hooks/useOrganizationCatalog";
import type {
  Department,
  JobProfile,
  ReferenceDataStatus,
} from "./types/organizationCatalog.types";

type CatalogTab = "Departments" | "Job Profiles";
type StatusDialog =
  | { type: "department"; record: Department }
  | { type: "jobProfile"; record: JobProfile };

function StatusBadge({ status }: { status: ReferenceDataStatus }) {
  const active = status === "active";
  return (
    <span className={`inline-flex items-center gap-1.5 ${active ? "text-(--secondary-green)" : "text-(--primary-grey)"}`}>
      <span className={`h-2 w-2 rounded-full ${active ? "bg-(--secondary-green)" : "bg-(--primary-grey)"}`} />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

export default function PoliciesAndConfiguration() {
  const catalog = useOrganizationCatalog();
  const activeCatalog = useActiveOrganizationCatalog();
  const { globalStates } = useGlobals();
  const [tab, setTab] = useState<CatalogTab>("Departments");
  const [departmentFormOpen, setDepartmentFormOpen] = useState(false);
  const [jobProfileFormOpen, setJobProfileFormOpen] = useState(false);
  const [editingDepartment, setEditingDepartment] = useState<Department>();
  const [editingJobProfile, setEditingJobProfile] = useState<JobProfile>();
  const [statusDialog, setStatusDialog] = useState<StatusDialog>();
  const canManage =
    hasPermission(globalStates.user, PERMISSIONS.IDENTITY_SETTINGS_MANAGE) ||
    hasPermission(globalStates.user, PERMISSIONS.IDENTITY_POLICIES_MANAGE);

  const departmentColumns = useMemo<DataTableColumn<Department>[]>(
    () => [
      {
        id: "department",
        header: "DEPARTMENT",
        cell: (department) => (
          <div>
            <div className="text-style__small-text--bold">{department.name}</div>
            <div className="text-(--primary-grey)">{department.code}</div>
          </div>
        ),
      },
      {
        id: "parent",
        header: "PARENT",
        cell: (department) => department.parent?.name ?? "-",
      },
      {
        id: "profiles",
        header: "JOB PROFILES",
        cell: (department) => department._count?.jobProfiles ?? 0,
      },
      {
        id: "status",
        header: "STATUS",
        cell: (department) => <StatusBadge status={department.status} />,
      },
      {
        id: "actions",
        header: "",
        cellClassName: "w-24",
        cell: (department) =>
          canManage ? (
            <div className="flex justify-end gap-1">
              <button
                type="button"
                title="Edit department"
                aria-label={`Edit ${department.name}`}
                className="buttonize rounded-[6px] p-2 hover:bg-(--terciary-grey)/30"
                onClick={() => {
                  setEditingDepartment(department);
                  setDepartmentFormOpen(true);
                }}
              >
                <FontAwesomeIcon icon={["fas", "pen"]} />
              </button>
              <button
                type="button"
                title={department.status === "active" ? "Deactivate department" : "Activate department"}
                aria-label={`${department.status === "active" ? "Deactivate" : "Activate"} ${department.name}`}
                className={`buttonize rounded-[6px] p-2 hover:bg-(--terciary-grey)/30 ${department.status === "active" ? "text-(--primary-red)" : "text-(--secondary-green)"}`}
                onClick={() => setStatusDialog({ type: "department", record: department })}
              >
                <FontAwesomeIcon icon={["fas", department.status === "active" ? "ban" : "check"]} />
              </button>
            </div>
          ) : null,
      },
    ],
    [canManage],
  );

  const jobProfileColumns = useMemo<DataTableColumn<JobProfile>[]>(
    () => [
      {
        id: "profile",
        header: "JOB PROFILE",
        cell: (profile) => (
          <div>
            <div className="text-style__small-text--bold">{profile.title}</div>
            <div className="text-(--primary-grey)">{profile.code}</div>
          </div>
        ),
      },
      { id: "department", header: "DEPARTMENT", cell: (profile) => profile.department.name },
      {
        id: "seniority",
        header: "SENIORITY",
        cell: (profile) => profile.seniorityLevel?.replaceAll("_", " ") ?? "-",
      },
      { id: "manager", header: "MANAGER POSITION", cell: (profile) => (profile.isPeopleManager ? "Yes" : "No") },
      { id: "status", header: "STATUS", cell: (profile) => <StatusBadge status={profile.status} /> },
      {
        id: "actions",
        header: "",
        cellClassName: "w-24",
        cell: (profile) =>
          canManage ? (
            <div className="flex justify-end gap-1">
              <button
                type="button"
                title="Edit job profile"
                aria-label={`Edit ${profile.title}`}
                className="buttonize rounded-[6px] p-2 hover:bg-(--terciary-grey)/30"
                onClick={() => {
                  setEditingJobProfile(profile);
                  setJobProfileFormOpen(true);
                }}
              >
                <FontAwesomeIcon icon={["fas", "pen"]} />
              </button>
              <button
                type="button"
                title={profile.status === "active" ? "Deactivate job profile" : "Activate job profile"}
                aria-label={`${profile.status === "active" ? "Deactivate" : "Activate"} ${profile.title}`}
                className={`buttonize rounded-[6px] p-2 hover:bg-(--terciary-grey)/30 ${profile.status === "active" ? "text-(--primary-red)" : "text-(--secondary-green)"}`}
                onClick={() => setStatusDialog({ type: "jobProfile", record: profile })}
              >
                <FontAwesomeIcon icon={["fas", profile.status === "active" ? "ban" : "check"]} />
              </button>
            </div>
          ) : null,
      },
    ],
    [canManage],
  );

  return (
    <div className="uniform-page-display min-w-0 text-style__body">
      <SectionTitle
        title="Policies & Configuration"
        subtitle="Organization structure and identity reference data"
      />

      <div className="flex w-fit overflow-hidden rounded-[8px] bg-white text-style__small-text">
        {(["Departments", "Job Profiles"] as CatalogTab[]).map((catalogTab) => (
          <button
            key={catalogTab}
            type="button"
            onClick={() => setTab(catalogTab)}
            className={`buttonize px-4 py-2.5 ${tab === catalogTab ? "bg-(--secondary-blue) text-white" : ""}`}
          >
            {catalogTab}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="w-48">
          <SearchableSelect
            value={catalog.status}
            options={[
              { value: "active", label: "Active" },
              { value: "inactive", label: "Inactive" },
              { value: "all", label: "All statuses" },
            ]}
            onChange={(status) => catalog.setStatus(status as ReferenceDataStatus | "all")}
            searchPlaceholder="Search statuses"
          />
        </div>
        {canManage && (
          <Button
            buttonText={tab === "Departments" ? "Add Department" : "Add Job Profile"}
            icon={<FontAwesomeIcon icon={["fas", "plus"]} />}
            clickAction={() => {
              catalog.clearFeedback();
              if (tab === "Departments") {
                setEditingDepartment(undefined);
                setDepartmentFormOpen(true);
              } else {
                setEditingJobProfile(undefined);
                setJobProfileFormOpen(true);
              }
            }}
          />
        )}
      </div>

      {catalog.error && (
        <div className="rounded-[8px] border border-(--primary-red)/30 bg-(--primary-red)/10 p-3 text-(--primary-red)">
          {catalog.error}
        </div>
      )}
      {catalog.successMessage && (
        <div className="rounded-[8px] border border-(--primary-green)/30 bg-(--primary-green)/10 p-3 text-(--primary-green)">
          {catalog.successMessage}
        </div>
      )}

      {departmentFormOpen && (
        <DepartmentForm
          key={editingDepartment?.id ?? "new-department"}
          department={editingDepartment}
          departments={activeCatalog.departments}
          isSaving={catalog.isSaving}
          onCancel={() => setDepartmentFormOpen(false)}
          onSave={(input) => catalog.saveDepartment(input, editingDepartment)}
        />
      )}
      {jobProfileFormOpen && (
        <JobProfileForm
          key={editingJobProfile?.id ?? "new-job-profile"}
          jobProfile={editingJobProfile}
          departments={activeCatalog.departments}
          isSaving={catalog.isSaving}
          onCancel={() => setJobProfileFormOpen(false)}
          onSave={(input) => catalog.saveJobProfile(input, editingJobProfile)}
        />
      )}

      {tab === "Departments" ? (
        <DataTable
          title="Departments"
          description={catalog.isLoading ? "Loading departments..." : `${catalog.departmentTotal} department${catalog.departmentTotal === 1 ? "" : "s"}`}
          columns={departmentColumns}
          data={catalog.departments}
          getRowId={(department) => department.id}
          minWidthClassName="min-w-180"
          search={{
            value: catalog.departmentSearch,
            onChange: catalog.setDepartmentSearch,
            placeholder: "Search departments",
          }}
          pagination={{
            totalItems: catalog.departmentTotal,
            currentPage: catalog.departmentPage,
            pageSize: catalog.departmentPageSize,
            onPageChange: catalog.setDepartmentPage,
            onPageSizeChange: catalog.setDepartmentPageSize,
            dataType: "departments",
          }}
        />
      ) : (
        <DataTable
          title="Job Profiles"
          description={catalog.isLoading ? "Loading job profiles..." : `${catalog.jobProfileTotal} job profile${catalog.jobProfileTotal === 1 ? "" : "s"}`}
          columns={jobProfileColumns}
          data={catalog.jobProfiles}
          getRowId={(profile) => profile.id}
          minWidthClassName="min-w-220"
          search={{
            value: catalog.jobProfileSearch,
            onChange: catalog.setJobProfileSearch,
            placeholder: "Search job profiles",
          }}
          pagination={{
            totalItems: catalog.jobProfileTotal,
            currentPage: catalog.jobProfilePage,
            pageSize: catalog.jobProfilePageSize,
            onPageChange: catalog.setJobProfilePage,
            onPageSizeChange: catalog.setJobProfilePageSize,
            dataType: "job profiles",
          }}
        />
      )}

      {statusDialog && (
        <CatalogStatusDialog
          recordName={statusDialog.type === "department" ? statusDialog.record.name : statusDialog.record.title}
          nextAction={statusDialog.record.status === "active" ? "deactivate" : "activate"}
          isSaving={catalog.isSaving}
          onCancel={() => setStatusDialog(undefined)}
          onConfirm={(reason) =>
            statusDialog.type === "department"
              ? catalog.changeDepartmentStatus(statusDialog.record, reason)
              : catalog.changeJobProfileStatus(statusDialog.record, reason)
          }
        />
      )}
    </div>
  );
}
