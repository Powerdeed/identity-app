"use client";

import { useSectionParams } from "@/app/[section]/SectionParamsContext";
import DataTable from "@/global-components/ui/DataTable";
import EmptyState from "@/global-components/ui/EmptyState";
import Loader from "@/global-components/ui/Loader";
import Notice from "@/global-components/ui/Notice";
import PageTabs from "@/global-components/ui/PageTabs";
import { SectionTitle } from "@/global-components/ui/Title";

import GovernanceError from "./components/GovernanceError";

import { governanceTabs } from "./constants/governance";
import {
  createApplicationColumns,
  createGroupColumns,
  createKeycloakRoleColumns,
  createPermissionColumns,
  createRoleColumns,
} from "./constants/tableColumns";

import useAccessGovernance from "./hooks/useAccessGovernance";

export default function AccessGovernance() {
  const { search: routeSearch, tab: routeTab } = useSectionParams();

  const {
    activeTab,
    setActiveTab,
    error,
    isLoading,
    roleRows,
    permissionRows,
    keycloakRoleRows,
    groupRows,
    applicationRows,
    filteredRoleRows,
    filteredPermissionRows,
    filteredKeycloakRoleRows,
    filteredGroupRows,
    filteredApplicationRows,
    roleSearch,
    setRoleSearch,
    permissionSearch,
    setPermissionSearch,
    keycloakRoleSearch,
    setKeycloakRoleSearch,
    groupSearch,
    setGroupSearch,
    applicationSearch,
    setApplicationSearch,
    summary,
  } = useAccessGovernance({
    defaultSearch: routeSearch,
    defaultTab: routeTab,
  });

  const roleColumns = createRoleColumns();
  const permissionColumns = createPermissionColumns();
  const keycloakRoleColumns = createKeycloakRoleColumns();
  const groupColumns = createGroupColumns();
  const applicationColumns = createApplicationColumns();

  return (
    <div className="uniform-page-display min-w-0 text-style__body">
      <SectionTitle
        title="Access Governance"
        subtitle="Read-only catalog of roles, permissions, and access structure"
      />

      <PageTabs
        tabs={governanceTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <GovernanceError error={error} />

      {activeTab === "powerdeedRoles" ? (
        <DataTable
          title="Powerdeed Roles"
          description={
            isLoading ? (
              <div className="horizontal-layout">
                <Loader />
                <span>Loading roles...</span>
              </div>
            ) : (
              `${filteredRoleRows.length} of ${roleRows.length} roles from identity-service registry across ${summary?.totalUsers ?? 0} users`
            )
          }
          columns={roleColumns}
          data={filteredRoleRows}
          getRowId={(role) => role.roleId}
          minWidthClassName="min-w-220"
          search={{
            value: roleSearch,
            onChange: setRoleSearch,
            placeholder: "Search roles, scope, risk",
          }}
        />
      ) : null}

      {activeTab === "permissionRegistry" ? (
        <DataTable
          title="Permission Registry"
          description={
            isLoading ? (
              <div className="horizontal-layout">
                <Loader />
                <span>Loading permissions...</span>
              </div>
            ) : (
              `${filteredPermissionRows.length} of ${permissionRows.length} permissions owned by identity-service`
            )
          }
          columns={permissionColumns}
          data={filteredPermissionRows}
          getRowId={(permission) => permission.permissionId}
          minWidthClassName="min-w-220"
          search={{
            value: permissionSearch,
            onChange: setPermissionSearch,
            placeholder: "Search permissions, domains, roles",
          }}
        />
      ) : null}

      {activeTab === "keycloakRoles" ? (
        <DataTable
          title="Keycloak Roles"
          description={
            isLoading ? (
              <div className="horizontal-layout">
                <Loader />
                <span>Loading Keycloak roles...</span>
              </div>
            ) : (
              `${filteredKeycloakRoleRows.length} of ${keycloakRoleRows.length} realm and client roles from Keycloak`
            )
          }
          columns={keycloakRoleColumns}
          data={filteredKeycloakRoleRows}
          getRowId={(role) => `${role.scope}:${role.name}:${role.id}`}
          minWidthClassName="min-w-180"
          search={{
            value: keycloakRoleSearch,
            onChange: setKeycloakRoleSearch,
            placeholder: "Search Keycloak roles",
          }}
          emptyState={
            <EmptyState
              icon="shield-halved"
              title="No Keycloak roles loaded"
              description="Realm and client roles will appear here when the Keycloak Admin API is reachable."
            />
          }
        />
      ) : null}

      {activeTab === "keycloakGroups" ? (
        <div className="vertical-layout__outer">
          <Notice tone="success">
            Keycloak groups are coarse baseline access. Changes to group
            membership affect session entitlements.
          </Notice>

          <DataTable
            title="Keycloak Groups"
            description={
              isLoading ? (
                <div className="horizontal-layout">
                  <Loader />
                  <span>Loading Keycloak groups...</span>
                </div>
              ) : (
                `${filteredGroupRows.length} of ${groupRows.length} groups from Keycloak`
              )
            }
            columns={groupColumns}
            data={filteredGroupRows}
            getRowId={(group) => group.id}
            minWidthClassName="min-w-160"
            search={{
              value: groupSearch,
              onChange: setGroupSearch,
              placeholder: "Search groups, paths, type",
            }}
          />
        </div>
      ) : null}

      {activeTab === "applicationCatalog" ? (
        <DataTable
          title="Application Catalog"
          description={`${filteredApplicationRows.length} of ${applicationRows.length} applications derived from current app access, roles, and permission domains`}
          columns={applicationColumns}
          data={filteredApplicationRows}
          getRowId={(app) => app.id}
          minWidthClassName="min-w-180"
          search={{
            value: applicationSearch,
            onChange: setApplicationSearch,
            placeholder: "Search applications",
          }}
          emptyState={
            <EmptyState
              icon="tv"
              title="No applications found"
              description="Application access will appear here once profiles have app assignments."
            />
          }
        />
      ) : null}
    </div>
  );
}
