"use client";

import { useEffect, useMemo, useState } from "react";

import {
  getKeycloakClients,
  getKeycloakClientRoles,
  getKeycloakGroups,
  getKeycloakRealmRoles,
  type KeycloakGroup,
  type KeycloakRole,
} from "@/features/employees/services/keycloakAccess";
import {
  getAccessGovernanceSummary,
  getAccessRegistry,
  type AccessRegistry,
  type AccessGovernanceSummary,
} from "@/features/employees/services/permissions";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";
import EmptyState from "@/global-components/ui/EmptyState";
import Notice from "@/global-components/ui/Notice";
import PageTabs, { type PageTab } from "@/global-components/ui/PageTabs";
import StatusChip from "@/global-components/ui/StatusChip";
import { SectionTitle } from "@/global-components/ui/Title";

type GovernanceTab =
  | "powerdeedRoles"
  | "permissionRegistry"
  | "keycloakRoles"
  | "keycloakGroups"
  | "applicationCatalog";

type RoleRow = {
  roleId: string;
  scope: string;
  risk: "low" | "medium" | "high" | "critical";
  permissionCount: number;
  assignedUsers: number;
  description: string;
};

type PermissionRow = {
  permissionId: string;
  domain: string;
  action: string;
  directAssignments: number;
  includedInRoles: string[];
};

type KeycloakRoleRow = {
  id: string;
  name: string;
  scope: string;
  description?: string;
};

type GroupRow = KeycloakGroup & {
  type: "baseline" | "access" | "role";
};

type ApplicationRow = {
  id: string;
  name: string;
  assignedUsers: number;
  roleCount: number;
  permissionCount: number;
};

const tabs: PageTab<GovernanceTab>[] = [
  { id: "powerdeedRoles", label: "Powerdeed Roles" },
  { id: "permissionRegistry", label: "Permission Registry" },
  { id: "keycloakRoles", label: "Keycloak Roles" },
  { id: "keycloakGroups", label: "Keycloak Groups" },
  { id: "applicationCatalog", label: "Application Catalog" },
];

const appLabels: Record<string, string> = {
  command_center: "Command Center",
  cms: "CMS",
  identity: "Workforce Identity",
  engineering: "Engineering",
  sales: "Sales",
  finance: "Finance",
  hr: "HR",
  operations: "Operations",
  analytics: "Analytics",
};

const riskTone = {
  low: "green",
  medium: "yellow",
  high: "yellow",
  critical: "red",
} as const;

function getPermissionDomain(permission: string) {
  return permission.split(".")[0]?.replaceAll("-", " ") || "platform";
}

function getPermissionAction(permission: string) {
  const parts = permission.split(".");
  return parts[parts.length - 1] || "access";
}

function getRoleRisk(roleId: string, permissions: string[]): RoleRow["risk"] {
  if (roleId.includes("super_admin")) return "critical";
  if (
    roleId.includes("admin") ||
    permissions.some((permission) => permission.includes(".manage"))
  ) {
    return "high";
  }
  if (
    permissions.some((permission) =>
      [".write", ".delete", ".approve", ".export"].some((action) =>
        permission.includes(action),
      ),
    )
  ) {
    return "medium";
  }
  return "low";
}

function describeRole(roleId: string) {
  if (roleId.includes("super_admin")) return "Emergency full-system access";
  if (roleId.includes("security_admin")) return "Security and access governance";
  if (roleId.startsWith("cms.")) return "CMS application access";
  if (roleId.startsWith("command_center.")) return "Command center access";
  if (roleId.startsWith("engineering.")) return "Engineering team access";
  if (roleId.startsWith("finance.")) return "Finance function access";
  if (roleId.startsWith("sales.")) return "Sales function access";
  if (roleId.startsWith("hr.")) return "HR people operations access";
  if (roleId.startsWith("executive.")) return "Executive reporting access";
  return "Platform access role";
}

function getGroupType(groupName: string): GroupRow["type"] {
  if (groupName.endsWith("-staff") || groupName === "company") {
    return "baseline";
  }
  if (["managers", "executives"].includes(groupName)) return "role";
  return "access";
}

function includesSearch(value: unknown, search: string) {
  if (!search) return true;
  return String(value ?? "").toLocaleLowerCase().includes(search);
}

function GovernanceError({ error }: { error?: string }) {
  if (!error) return null;
  return <Notice tone="danger">{error}</Notice>;
}

export default function AccessGovernance() {
  const [activeTab, setActiveTab] =
    useState<GovernanceTab>("powerdeedRoles");
  const [registry, setRegistry] = useState<AccessRegistry>();
  const [summary, setSummary] = useState<AccessGovernanceSummary>();
  const [groups, setGroups] = useState<KeycloakGroup[]>([]);
  const [realmRoles, setRealmRoles] = useState<KeycloakRole[]>([]);
  const [clientRoles, setClientRoles] = useState<KeycloakRoleRow[]>([]);
  const [roleSearch, setRoleSearch] = useState("");
  const [permissionSearch, setPermissionSearch] = useState("");
  const [keycloakRoleSearch, setKeycloakRoleSearch] = useState("");
  const [groupSearch, setGroupSearch] = useState("");
  const [applicationSearch, setApplicationSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let isMounted = true;

    async function loadGovernanceData() {
      setIsLoading(true);
      setError(undefined);
      try {
        const [nextRegistry, nextSummary, nextGroups, nextRealmRoles, nextClients] =
          await Promise.all([
            getAccessRegistry(),
            getAccessGovernanceSummary(),
            getKeycloakGroups(),
            getKeycloakRealmRoles(),
            getKeycloakClients(),
          ]);

        const nextClientRoles = (
          await Promise.all(
            nextClients.map(async (client) => {
              try {
                const roles = await getKeycloakClientRoles(client.id);
                return roles.map((role) => ({
                  ...role,
                  scope: client.clientId,
                }));
              } catch {
                return [];
              }
            }),
          )
        ).flat();

        if (!isMounted) return;
        setRegistry(nextRegistry);
        setSummary(nextSummary);
        setGroups(nextGroups);
        setRealmRoles(nextRealmRoles);
        setClientRoles(nextClientRoles);
      } catch (loadError) {
        if (!isMounted) return;
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Unable to load access governance data.",
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadGovernanceData();

    return () => {
      isMounted = false;
    };
  }, []);

  const roleRows = useMemo<RoleRow[]>(() => {
    if (!registry) return [];

    return Object.values(registry.roles)
      .sort()
      .map((roleId) => {
        const permissions = registry.rolePermissions[roleId] ?? [];
        return {
          roleId,
          scope: roleId.split(".")[0] || "global",
          risk: getRoleRisk(roleId, permissions),
          permissionCount: permissions.length,
          assignedUsers: summary?.roleAssignments[roleId] ?? 0,
          description: describeRole(roleId),
        };
      });
  }, [registry, summary]);

  const permissionRows = useMemo<PermissionRow[]>(() => {
    if (!registry) return [];

    return Object.values(registry.permissions)
      .sort()
      .map((permissionId) => ({
        permissionId,
        domain: getPermissionDomain(permissionId),
        action: getPermissionAction(permissionId),
        directAssignments: summary?.directPermissionAssignments[permissionId] ?? 0,
        includedInRoles: Object.entries(registry.rolePermissions)
          .filter(([, permissions]) => permissions.includes(permissionId))
          .map(([roleId]) => roleId),
      }));
  }, [registry, summary]);

  const keycloakRoleRows = useMemo<KeycloakRoleRow[]>(
    () => [
      ...realmRoles.map((role) => ({ ...role, scope: "realm" })),
      ...clientRoles,
    ],
    [clientRoles, realmRoles],
  );

  const groupRows = useMemo<GroupRow[]>(
    () =>
      groups
        .map((group) => ({ ...group, type: getGroupType(group.name) }))
        .sort((first, second) => first.name.localeCompare(second.name)),
    [groups],
  );

  const applicationRows = useMemo<ApplicationRow[]>(() => {
    const appIds = new Set<string>();
    Object.keys(summary?.appAssignments ?? {}).forEach((app) => appIds.add(app));
    roleRows.forEach((role) => appIds.add(role.scope));
    permissionRows.forEach((permission) => appIds.add(permission.domain));

    return [...appIds]
      .filter(Boolean)
      .sort()
      .map((id) => ({
        id,
        name: appLabels[id] ?? id.replaceAll("_", " "),
        assignedUsers: summary?.appAssignments[id] ?? 0,
        roleCount: roleRows.filter((role) => role.scope === id).length,
        permissionCount: permissionRows.filter((permission) => permission.domain === id).length,
      }));
  }, [permissionRows, roleRows, summary]);

  const filteredRoleRows = useMemo(() => {
    const query = roleSearch.trim().toLocaleLowerCase();
    return roleRows.filter(
      (role) =>
        includesSearch(role.roleId, query) ||
        includesSearch(role.scope, query) ||
        includesSearch(role.risk, query) ||
        includesSearch(role.description, query),
    );
  }, [roleRows, roleSearch]);

  const filteredPermissionRows = useMemo(() => {
    const query = permissionSearch.trim().toLocaleLowerCase();
    return permissionRows.filter(
      (permission) =>
        includesSearch(permission.permissionId, query) ||
        includesSearch(permission.domain, query) ||
        includesSearch(permission.action, query) ||
        permission.includedInRoles.some((role) => includesSearch(role, query)),
    );
  }, [permissionRows, permissionSearch]);

  const filteredKeycloakRoleRows = useMemo(() => {
    const query = keycloakRoleSearch.trim().toLocaleLowerCase();
    return keycloakRoleRows.filter(
      (role) =>
        includesSearch(role.name, query) ||
        includesSearch(role.scope, query) ||
        includesSearch(role.description, query),
    );
  }, [keycloakRoleRows, keycloakRoleSearch]);

  const filteredGroupRows = useMemo(() => {
    const query = groupSearch.trim().toLocaleLowerCase();
    return groupRows.filter(
      (group) =>
        includesSearch(group.name, query) ||
        includesSearch(group.path, query) ||
        includesSearch(group.type, query),
    );
  }, [groupRows, groupSearch]);

  const filteredApplicationRows = useMemo(() => {
    const query = applicationSearch.trim().toLocaleLowerCase();
    return applicationRows.filter(
      (app) =>
        includesSearch(app.name, query) ||
        includesSearch(app.id, query),
    );
  }, [applicationRows, applicationSearch]);

  const roleColumns: DataTableColumn<RoleRow>[] = [
    {
      id: "role",
      header: "ROLE",
      cell: (role) => <StatusChip tone="blue">{role.roleId}</StatusChip>,
    },
    { id: "scope", header: "SCOPE", accessorKey: "scope" },
    {
      id: "risk",
      header: "RISK",
      cell: (role) => <StatusChip tone={riskTone[role.risk]}>{role.risk}</StatusChip>,
    },
    { id: "permissions", header: "PERMISSIONS", accessorKey: "permissionCount" },
    { id: "assignedUsers", header: "ASSIGNED USERS", accessorKey: "assignedUsers" },
    { id: "description", header: "DESCRIPTION", accessorKey: "description" },
  ];

  const permissionColumns: DataTableColumn<PermissionRow>[] = [
    {
      id: "permission",
      header: "PERMISSION",
      cell: (permission) => <StatusChip tone="blue">{permission.permissionId}</StatusChip>,
    },
    { id: "domain", header: "DOMAIN", accessorKey: "domain" },
    {
      id: "action",
      header: "ACTION",
      cell: (permission) => <StatusChip tone="grey">{permission.action}</StatusChip>,
    },
    {
      id: "directAssignments",
      header: "DIRECT ASSIGNMENTS",
      accessorKey: "directAssignments",
    },
    {
      id: "roles",
      header: "INCLUDED IN ROLES",
      cell: (permission) => (
        <div className="flex flex-wrap gap-1.5">
          {permission.includedInRoles.length
            ? permission.includedInRoles.slice(0, 4).map((role) => (
                <StatusChip key={role} tone="blue">
                  {role}
                </StatusChip>
              ))
            : "-"}
          {permission.includedInRoles.length > 4 ? (
            <StatusChip tone="grey">+{permission.includedInRoles.length - 4}</StatusChip>
          ) : null}
        </div>
      ),
    },
  ];

  const keycloakRoleColumns: DataTableColumn<KeycloakRoleRow>[] = [
    {
      id: "role",
      header: "ROLE",
      cell: (role) => <StatusChip tone="blue">{role.name}</StatusChip>,
    },
    { id: "scope", header: "SCOPE", accessorKey: "scope" },
    { id: "description", header: "DESCRIPTION", accessorKey: "description" },
  ];

  const groupColumns: DataTableColumn<GroupRow>[] = [
    {
      id: "group",
      header: "GROUP",
      cell: (group) => <StatusChip tone="green">{group.name}</StatusChip>,
    },
    { id: "path", header: "PATH", accessorKey: "path" },
    {
      id: "type",
      header: "TYPE",
      cell: (group) => <StatusChip tone="green">{group.type}</StatusChip>,
    },
  ];

  const applicationColumns: DataTableColumn<ApplicationRow>[] = [
    { id: "name", header: "APPLICATION", accessorKey: "name" },
    { id: "id", header: "APP ID", accessorKey: "id" },
    { id: "assignedUsers", header: "ASSIGNED USERS", accessorKey: "assignedUsers" },
    { id: "roleCount", header: "ROLES", accessorKey: "roleCount" },
    { id: "permissionCount", header: "PERMISSIONS", accessorKey: "permissionCount" },
  ];

  return (
    <div className="uniform-page-display min-w-0 text-style__body">
      <SectionTitle
        title="Access Governance"
        subtitle="Read-only catalog of roles, permissions, and access structure"
      />

      <PageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <GovernanceError error={error} />

      {activeTab === "powerdeedRoles" ? (
        <DataTable
          title="Powerdeed Roles"
          description={
            isLoading
              ? "Loading roles..."
              : `${filteredRoleRows.length} of ${roleRows.length} roles from identity-service registry across ${summary?.totalUsers ?? 0} users`
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
            isLoading
              ? "Loading permissions..."
              : `${filteredPermissionRows.length} of ${permissionRows.length} permissions owned by identity-service`
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
            isLoading
              ? "Loading Keycloak roles..."
              : `${filteredKeycloakRoleRows.length} of ${keycloakRoleRows.length} realm and client roles from Keycloak`
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
            Keycloak groups are coarse baseline access. Changes to group membership affect session entitlements.
          </Notice>
          <DataTable
            title="Keycloak Groups"
            description={
              isLoading
                ? "Loading Keycloak groups..."
                : `${filteredGroupRows.length} of ${groupRows.length} groups from Keycloak`
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
