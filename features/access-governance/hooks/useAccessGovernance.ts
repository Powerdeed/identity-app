import { useEffect, useMemo, useState } from "react";

import {
  getKeycloakClientRoles,
  getKeycloakClients,
  getKeycloakGroups,
  getKeycloakRealmRoles,
  type KeycloakGroup,
  type KeycloakRole,
} from "@/features/employees/services/keycloakAccess";
import {
  getAccessGovernanceSummary,
  getAccessRegistry,
  type AccessGovernanceSummary,
  type AccessRegistry,
} from "@/features/employees/services/permissions";

import { appLabels } from "../constants/governance";
import type {
  ApplicationRow,
  GovernanceTab,
  GroupRow,
  KeycloakRoleRow,
  PermissionRow,
  RoleRow,
} from "../types/governance";
import {
  buildApplicationRows,
  buildGroupRows,
  buildKeycloakRoleRows,
  buildPermissionRows,
  buildRoleRows,
  includesSearch,
} from "../utils/governance";

export type UseAccessGovernanceOptions = {
  defaultSearch?: string;
  defaultTab?: string;
};

function normalizeTab(tab?: string): GovernanceTab {
  switch (tab) {
    case "permissions":
      return "permissionRegistry";
    case "groups":
      return "keycloakGroups";
    case "keycloak-roles":
      return "keycloakRoles";
    case "applications":
      return "applicationCatalog";
    default:
      return "powerdeedRoles";
  }
}

export function useAccessGovernance({
  defaultSearch = "",
  defaultTab,
}: UseAccessGovernanceOptions = {}) {
  const [activeTab, setActiveTab] = useState<GovernanceTab>(() =>
    normalizeTab(defaultTab),
  );
  const [roleSearch, setRoleSearch] = useState(defaultSearch);
  const [permissionSearch, setPermissionSearch] = useState(defaultSearch);
  const [keycloakRoleSearch, setKeycloakRoleSearch] = useState(defaultSearch);
  const [groupSearch, setGroupSearch] = useState(defaultSearch);
  const [applicationSearch, setApplicationSearch] = useState(defaultSearch);
  const [registry, setRegistry] = useState<AccessRegistry>();
  const [summary, setSummary] = useState<AccessGovernanceSummary>();
  const [groups, setGroups] = useState<KeycloakGroup[]>([]);
  const [realmRoles, setRealmRoles] = useState<KeycloakRole[]>([]);
  const [clientRoles, setClientRoles] = useState<KeycloakRoleRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string>();

  useEffect(() => {
    let isMounted = true;

    async function loadGovernanceData() {
      setIsLoading(true);
      setError(undefined);

      try {
        const [
          nextRegistry,
          nextSummary,
          nextGroups,
          nextRealmRoles,
          nextClients,
        ] = await Promise.all([
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
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadGovernanceData();

    return () => {
      isMounted = false;
    };
  }, []);

  const roleRows = useMemo<RoleRow[]>(() => {
    if (!registry) return [];
    return buildRoleRows(registry, summary);
  }, [registry, summary]);

  const permissionRows = useMemo<PermissionRow[]>(() => {
    if (!registry) return [];
    return buildPermissionRows(registry, summary);
  }, [registry, summary]);

  const keycloakRoleRows = useMemo<KeycloakRoleRow[]>(() => {
    return buildKeycloakRoleRows(realmRoles, clientRoles);
  }, [clientRoles, realmRoles]);

  const groupRows = useMemo<GroupRow[]>(() => {
    return buildGroupRows(groups);
  }, [groups]);

  const applicationRows = useMemo<ApplicationRow[]>(() => {
    return buildApplicationRows(roleRows, permissionRows, summary, appLabels);
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
      (app) => includesSearch(app.name, query) || includesSearch(app.id, query),
    );
  }, [applicationRows, applicationSearch]);

  return {
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
  };
}

export default useAccessGovernance;
