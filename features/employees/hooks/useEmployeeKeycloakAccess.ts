"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { execute } from "@/lib";
import {
  addEmployeeKeycloakGroup,
  addEmployeeKeycloakRole,
  getEmployeeKeycloakAccess,
  getKeycloakClientRoles,
  getKeycloakClients,
  getKeycloakGroups,
  getKeycloakRealmRoles,
  removeEmployeeKeycloakGroup,
  removeEmployeeKeycloakRole,
  type KeycloakClient,
  type KeycloakGroup,
  type KeycloakRole,
  type KeycloakUserAccess,
} from "../services/keycloakAccess";
import useEmployees from "./useEmployees";

export type KeycloakPickerMode = "group" | "realm-role" | "client-role";

export type KeycloakRemovalTarget =
  | { type: "group"; id: string; name: string }
  | { type: "realm-role"; name: string }
  | { type: "client-role"; clientId: string; name: string };

export default function useEmployeeKeycloakAccess() {
  const { state } = useEmployees();
  const employee = state.selectedEmployee;
  const keycloakUserId = employee?.keycloakUserId;
  const [keycloakAccess, setKeycloakAccess] =
    useState<KeycloakUserAccess | null>(null);
  const [groups, setGroups] = useState<KeycloakGroup[]>([]);
  const [realmRoles, setRealmRoles] = useState<KeycloakRole[]>([]);
  const [clients, setClients] = useState<KeycloakClient[]>([]);
  const [clientRoles, setClientRoles] = useState<KeycloakRole[]>([]);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [pickerMode, setPickerMode] = useState<KeycloakPickerMode | null>(null);
  const [removalTarget, setRemovalTarget] =
    useState<KeycloakRemovalTarget | null>(null);
  const [search, setSearchValue] = useState("");
  const [pickerPage, setPickerPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isPickerLoading, setIsPickerLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [pickerError, setPickerError] = useState("");

  const refreshAccess = useCallback(() => {
    if (!keycloakUserId) return;

    void execute(() => getEmployeeKeycloakAccess(keycloakUserId), {
      setLoading: setIsLoading,
      setError,
      onSuccess: setKeycloakAccess,
    });
  }, [keycloakUserId]);

  useEffect(() => refreshAccess(), [refreshAccess]);

  useEffect(() => {
    if (pickerMode === "group") {
      void execute(getKeycloakGroups, {
        setLoading: setIsPickerLoading,
        setError: setPickerError,
        onSuccess: setGroups,
      });
    } else if (pickerMode === "realm-role") {
      void execute(getKeycloakRealmRoles, {
        setLoading: setIsPickerLoading,
        setError: setPickerError,
        onSuccess: setRealmRoles,
      });
    } else if (pickerMode === "client-role") {
      void execute(getKeycloakClients, {
        setLoading: setIsPickerLoading,
        setError: setPickerError,
        onSuccess: (availableClients) => {
          setClients(availableClients);
          const firstEnabled = availableClients.find(
            (client) => client.enabled,
          );
          setSelectedClientId(
            firstEnabled?.clientId ?? availableClients[0]?.clientId ?? "",
          );
        },
      });
    }
  }, [pickerMode]);

  useEffect(() => {
    if (pickerMode !== "client-role" || !selectedClientId) return;

    void execute(() => getKeycloakClientRoles(selectedClientId), {
      setLoading: setIsPickerLoading,
      setError: setPickerError,
      onSuccess: setClientRoles,
    });
  }, [pickerMode, selectedClientId]);

  const keycloakGroupMembershipList = keycloakAccess?.groups ?? [];
  const directRealmRolesList = keycloakAccess?.realmRoles ?? [];
  const clientRoleList = useMemo(
    () =>
      (keycloakAccess?.clientRoles ?? []).flatMap((clientRoleGroup) =>
        clientRoleGroup.roles.map((role) => ({
          id: `${clientRoleGroup.clientId}-${role.id}`,
          clientId: clientRoleGroup.clientId,
          role: role.name,
        })),
      ),
    [keycloakAccess?.clientRoles],
  );

  const closePicker = () => setPickerMode(null);
  const openPicker = (mode: KeycloakPickerMode) => {
    setSearchValue("");
    setPickerPage(1);
    setPickerError("");
    setClientRoles([]);
    setPickerMode(mode);
  };
  const setSearch = (value: string) => {
    setSearchValue(value);
    setPickerPage(1);
  };

  const afterMutation = () => {
    refreshAccess();
    closePicker();
  };

  const addGroup = (groupId: string) => {
    if (!keycloakUserId) return;
    void execute(() => addEmployeeKeycloakGroup(keycloakUserId, groupId), {
      setLoading: setIsSaving,
      setError: setPickerError,
      onSuccess: afterMutation,
    });
  };

  const addRealmRole = (roleName: string) => {
    if (!keycloakUserId) return;
    void execute(
      () =>
        addEmployeeKeycloakRole(keycloakUserId, { scope: "realm", roleName }),
      {
        setLoading: setIsSaving,
        setError: setPickerError,
        onSuccess: afterMutation,
      },
    );
  };

  const addClientRole = (roleName: string) => {
    if (!keycloakUserId || !selectedClientId) return;
    void execute(
      () =>
        addEmployeeKeycloakRole(keycloakUserId, {
          scope: "client",
          clientId: selectedClientId,
          roleName,
        }),
      {
        setLoading: setIsSaving,
        setError: setPickerError,
        onSuccess: afterMutation,
      },
    );
  };

  const confirmRemoval = () => {
    if (!keycloakUserId || !removalTarget) return;

    const action =
      removalTarget.type === "group"
        ? () => removeEmployeeKeycloakGroup(keycloakUserId, removalTarget.id)
        : removalTarget.type === "realm-role"
          ? () =>
              removeEmployeeKeycloakRole(keycloakUserId, {
                scope: "realm",
                roleName: removalTarget.name,
              })
          : () =>
              removeEmployeeKeycloakRole(keycloakUserId, {
                scope: "client",
                clientId: removalTarget.clientId,
                roleName: removalTarget.name,
              });

    void execute(action, {
      setLoading: setIsSaving,
      setError,
      onSuccess: () => {
        setRemovalTarget(null);
        refreshAccess();
      },
    });
  };

  const matchesSearch = (values: Array<string | undefined>) =>
    values.some((value) =>
      (value ?? "").toLowerCase().includes(search.toLowerCase()),
    );
  const groupRows = groups
    .filter((group) => matchesSearch([group.name, group.path]))
    .map((group) => ({
      ...group,
      assigned: keycloakGroupMembershipList.some(
        (assignedGroup) => assignedGroup.id === group.id,
      ),
    }));
  const realmRoleRows = realmRoles
    .filter((role) => matchesSearch([role.name, role.description]))
    .map((role) => ({
      ...role,
      assigned: directRealmRolesList.some(
        (assignedRole) => assignedRole.name === role.name,
      ),
    }));
  const assignedClientRoleNames = new Set(
    clientRoleList
      .filter((role) => role.clientId === selectedClientId)
      .map((role) => role.role),
  );
  const assignedClientRoles = clientRoleList.filter((role) =>
    matchesSearch([role.role]),
  );
  const clientRoleRows = clientRoles
    .filter((role) => matchesSearch([role.name, role.description]))
    .map((role) => ({
      ...role,
      assigned: assignedClientRoleNames.has(role.name),
    }));

  return {
    employee,
    clients,
    selectedClientId,
    setSelectedClientId,
    pickerMode,
    removalTarget,
    setRemovalTarget,
    search,
    setSearch,
    pickerPage,
    setPickerPage,
    isLoading,
    isPickerLoading,
    isSaving,
    error,
    pickerError,
    keycloakGroupMembershipList,
    directRealmRolesList,
    clientRoleList,
    assignedClientRoles,
    groupRows,
    realmRoleRows,
    clientRoleRows,
    openPicker,
    closePicker,
    addGroup,
    addRealmRole,
    addClientRole,
    confirmRemoval,
  };
}
