"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMemo, useState } from "react";
import { hasPermission, PERMISSIONS } from "@/app/auth";
import { useSectionParams } from "@/app/[section]/SectionParamsContext";
import { useGlobals } from "@/globals";
import Button from "@/global-components/ui/Button";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import Loader from "@/global-components/ui/Loader";
import Notice from "@/global-components/ui/Notice";
import PageTabs, { type PageTab } from "@/global-components/ui/PageTabs";
import StatusChip from "@/global-components/ui/StatusChip";
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
type ConfigurationTab = "System Policies" | CatalogTab;
type StatusDialog =
  | { type: "department"; record: Department }
  | { type: "jobProfile"; record: JobProfile };

type PolicyRow = {
  policy: string;
  value: string;
  scope: string;
};

type IntegrationRow = {
  service: string;
  detail: string;
  status: "connected" | "degraded" | "planned";
};

const configurationTabs: PageTab<ConfigurationTab>[] = [
  { id: "System Policies", label: "System Policies" },
  { id: "Departments", label: "Departments" },
  { id: "Job Profiles", label: "Job Profiles" },
];

function StatusBadge({ status }: { status: ReferenceDataStatus }) {
  const active = status === "active";
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${active ? "text-(--secondary-green)" : "text-(--primary-grey)"}`}
    >
      <span
        className={`h-2 w-2 rounded-full ${active ? "bg-(--secondary-green)" : "bg-(--primary-grey)"}`}
      />
      {active ? "Active" : "Inactive"}
    </span>
  );
}

function SystemPolicies({
  catalogError,
  catalogLoading,
}: {
  catalogError?: string;
  catalogLoading: boolean;
}) {
  const sessionPolicyRows: PolicyRow[] = [
    {
      policy: "Session duration",
      value: "Configured by identity-service session TTL",
      scope: "All staff apps",
    },
    {
      policy: "Current-session revocation",
      value: "Protected by default",
      scope: "Administrators",
    },
    {
      policy: "Revocation behavior",
      value: "Immediate, entitlement snapshot cleared",
      scope: "Identity sessions",
    },
  ];

  const accessPolicyRows: PolicyRow[] = [
    {
      policy: "Direct permission exceptions",
      value: "Require documented reason and review",
      scope: "Powerdeed access",
    },
    {
      policy: "Role assignment approval",
      value: "Manager or security admin approval",
      scope: "High-risk roles",
    },
    {
      policy: "Temporary access max duration",
      value: "90 days",
      scope: "Direct exceptions",
    },
  ];

  const integrationRows: IntegrationRow[] = [
    {
      service: "Identity Service",
      detail: "Users, sessions, audit events, and permission registry",
      status: catalogError ? "degraded" : "connected",
    },
    {
      service: "Cloud SQL",
      detail: "Accessed through identity-service persistence layer",
      status: catalogError ? "degraded" : "connected",
    },
    {
      service: "Keycloak",
      detail: "Authentication, SSO, groups, realm roles, and client roles",
      status: "connected",
    },
    {
      service: "Campaign Engine",
      detail: "Periodic access certification workflow",
      status: "planned",
    },
  ];

  const policyColumns: DataTableColumn<PolicyRow>[] = [
    { id: "policy", header: "POLICY", accessorKey: "policy" },
    { id: "value", header: "VALUE", accessorKey: "value" },
    { id: "scope", header: "SCOPE", accessorKey: "scope" },
  ];

  const integrationColumns: DataTableColumn<IntegrationRow>[] = [
    { id: "service", header: "SERVICE", accessorKey: "service" },
    { id: "detail", header: "DETAIL", accessorKey: "detail" },
    {
      id: "status",
      header: "STATUS",
      cell: (row) => (
        <StatusChip
          tone={
            row.status === "connected"
              ? "green"
              : row.status === "degraded"
                ? "yellow"
                : "grey"
          }
        >
          {row.status}
        </StatusChip>
      ),
    },
  ];

  return (
    <div className="vertical-layout__outer">
      {catalogError ? (
        <Notice tone="danger">{catalogError}</Notice>
      ) : (
        <Notice tone="info">
          These policies describe the current operating model. Editable policy
          storage can be added once approvals and campaign scheduling are
          modeled as durable workflows.
        </Notice>
      )}

      <div className="grid gap-5 xl:grid-cols-2">
        <DataTable
          title="Session Policy"
          description={
            catalogLoading
              ? "Checking identity-service..."
              : "Session handling rules"
          }
          columns={policyColumns}
          data={sessionPolicyRows}
          getRowId={(row) => row.policy}
          minWidthClassName="min-w-140"
        />
        <DataTable
          title="Access Policy"
          description="Role, permission, and exception governance"
          columns={policyColumns}
          data={accessPolicyRows}
          getRowId={(row) => row.policy}
          minWidthClassName="min-w-140"
        />
      </div>

      <DataTable
        title="Integration Status"
        description="Runtime systems that support authentication and authorization"
        columns={integrationColumns}
        data={integrationRows}
        getRowId={(row) => row.service}
        minWidthClassName="min-w-180"
      />
    </div>
  );
}

export default function PoliciesAndConfiguration() {
  const { search: routeSearch, tab: routeTab } = useSectionParams();
  const catalog = useOrganizationCatalog(routeSearch);
  const activeCatalog = useActiveOrganizationCatalog();
  const { globalStates } = useGlobals();
  const requestedTab: ConfigurationTab =
    routeTab === "departments"
      ? "Departments"
      : routeTab === "job-profiles"
        ? "Job Profiles"
        : "System Policies";
  const [tab, setTab] = useState<ConfigurationTab>(requestedTab);
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
            <div className="text-style__small-text--bold">
              {department.name}
            </div>
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
                className="buttonize rounded-md p-2 hover:bg-(--terciary-grey)/30"
                onClick={() => {
                  setEditingDepartment(department);
                  setDepartmentFormOpen(true);
                }}
              >
                <FontAwesomeIcon icon={["fas", "pen"]} />
              </button>
              <button
                type="button"
                title={
                  department.status === "active"
                    ? "Deactivate department"
                    : "Activate department"
                }
                aria-label={`${department.status === "active" ? "Deactivate" : "Activate"} ${department.name}`}
                className={`buttonize rounded-md p-2 hover:bg-(--terciary-grey)/30 ${department.status === "active" ? "text-(--primary-red)" : "text-(--secondary-green)"}`}
                onClick={() =>
                  setStatusDialog({ type: "department", record: department })
                }
              >
                <FontAwesomeIcon
                  icon={[
                    "fas",
                    department.status === "active" ? "ban" : "check",
                  ]}
                />
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
      {
        id: "department",
        header: "DEPARTMENT",
        cell: (profile) => profile.department.name,
      },
      {
        id: "seniority",
        header: "SENIORITY",
        cell: (profile) => profile.seniorityLevel?.replaceAll("_", " ") ?? "-",
      },
      {
        id: "manager",
        header: "MANAGER POSITION",
        cell: (profile) => (profile.isPeopleManager ? "Yes" : "No"),
      },
      {
        id: "status",
        header: "STATUS",
        cell: (profile) => <StatusBadge status={profile.status} />,
      },
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
                className="buttonize rounded-md p-2 hover:bg-(--terciary-grey)/30"
                onClick={() => {
                  setEditingJobProfile(profile);
                  setJobProfileFormOpen(true);
                }}
              >
                <FontAwesomeIcon icon={["fas", "pen"]} />
              </button>
              <button
                type="button"
                title={
                  profile.status === "active"
                    ? "Deactivate job profile"
                    : "Activate job profile"
                }
                aria-label={`${profile.status === "active" ? "Deactivate" : "Activate"} ${profile.title}`}
                className={`buttonize rounded-md p-2 hover:bg-(--terciary-grey)/30 ${profile.status === "active" ? "text-(--primary-red)" : "text-(--secondary-green)"}`}
                onClick={() =>
                  setStatusDialog({ type: "jobProfile", record: profile })
                }
              >
                <FontAwesomeIcon
                  icon={["fas", profile.status === "active" ? "ban" : "check"]}
                />
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
        subtitle="System policy display and identity reference data"
      />

      <PageTabs tabs={configurationTabs} activeTab={tab} onChange={setTab} />

      {tab === "System Policies" ? (
        <SystemPolicies
          catalogError={catalog.error || activeCatalog.error}
          catalogLoading={catalog.isLoading || activeCatalog.isLoading}
        />
      ) : null}

      {tab !== "System Policies" ? (
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="w-48">
            <SearchableSelect
              value={catalog.status}
              options={[
                { value: "active", label: "Active" },
                { value: "inactive", label: "Inactive" },
                { value: "all", label: "All statuses" },
              ]}
              onChange={(status) =>
                catalog.setStatus(status as ReferenceDataStatus | "all")
              }
              searchPlaceholder="Search statuses"
            />
          </div>
          {canManage && (
            <Button
              buttonText={
                tab === "Departments" ? "Add Department" : "Add Job Profile"
              }
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
      ) : null}

      {tab !== "System Policies" && catalog.error && (
        <div className="rounded-lg border border-(--primary-red)/30 bg-(--primary-red)/10 p-3 text-(--primary-red)">
          {catalog.error}
        </div>
      )}
      {tab !== "System Policies" && catalog.successMessage && (
        <div className="rounded-lg border border-(--primary-green)/30 bg-(--primary-green)/10 p-3 text-(--primary-green)">
          {catalog.successMessage}
        </div>
      )}

      {tab !== "System Policies" && departmentFormOpen && (
        <DepartmentForm
          key={editingDepartment?.id ?? "new-department"}
          department={editingDepartment}
          departments={activeCatalog.departments}
          isSaving={catalog.isSaving}
          onCancel={() => setDepartmentFormOpen(false)}
          onSave={(input) => catalog.saveDepartment(input, editingDepartment)}
        />
      )}
      {tab !== "System Policies" && jobProfileFormOpen && (
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
          description={
            catalog.isLoading ? (
              <div className="horizontal-layout">
                <Loader />
                <span>Loading departments...</span>
              </div>
            ) : (
              `${catalog.departmentTotal} department${catalog.departmentTotal === 1 ? "" : "s"}`
            )
          }
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
      ) : tab === "Job Profiles" ? (
        <DataTable
          title="Job Profiles"
          description={
            catalog.isLoading ? (
              <div className="horizontal-layout">
                <Loader />
                <span>Loading job profiles...</span>
              </div>
            ) : (
              `${catalog.jobProfileTotal} job profile${catalog.jobProfileTotal === 1 ? "" : "s"}`
            )
          }
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
      ) : null}

      {statusDialog && (
        <CatalogStatusDialog
          recordName={
            statusDialog.type === "department"
              ? statusDialog.record.name
              : statusDialog.record.title
          }
          nextAction={
            statusDialog.record.status === "active" ? "deactivate" : "activate"
          }
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
