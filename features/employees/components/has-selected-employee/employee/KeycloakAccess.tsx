"use client";

import useEmployeeKeycloakAccess from "@/features/employees/hooks/useEmployeeKeycloakAccess";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";
import ContainerTitle from "@/global-components/ui/ContainerTitle";
import DataTable, {
  type DataTableColumn,
} from "@/global-components/ui/DataTable";

const SESSION_IMPACT =
  "Session impact: Adding or removing Keycloak groups or roles will revoke all active Powerdeed sessions for this employee so they receive a fresh entitlement snapshot on next login. Always review active sessions before making changes.";

const pageSize = 8;

const paginate = <T,>(rows: T[], page: number) =>
  rows.slice((page - 1) * pageSize, page * pageSize);

export default function KeycloakAccess() {
  const {
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
    groupRows,
    realmRoleRows,
    clientRoleRows,
    openPicker,
    closePicker,
    addGroup,
    addRealmRole,
    addClientRole,
    confirmRemoval,
  } = useEmployeeKeycloakAccess();

  if (!employee) return null;

  const actionColumn = <T extends { assigned: boolean; name: string }>({
    onAdd,
  }: {
    onAdd: (row: T) => void;
  }): DataTableColumn<T> => ({
    id: "action",
    header: <span className="sr-only">Action</span>,
    cell: (row) => (
      <Button
        buttonText={row.assigned ? "Assigned" : "Add"}
        buttonType={row.assigned ? "light" : "primary"}
        disabled={row.assigned || isSaving}
        clickAction={() => onAdd(row)}
      />
    ),
  });

  const roleColumns = <T extends { name: string; description?: string; assigned: boolean }>(
    onAdd: (row: T) => void,
  ): DataTableColumn<T>[] => [
    {
      id: "name",
      header: "Role",
      cell: (role) => (
        <span className="rounded-[10px] border border-(--primary-blue)/20 bg-(--primary-blue)/10 px-2 py-1 text-(--primary-blue)">
          {role.name}
        </span>
      ),
    },
    {
      id: "description",
      header: "Description",
      cell: (role) => role.description || "-",
      cellClassName: "text-(--primary-grey)",
    },
    actionColumn({ onAdd }),
  ];

  return (
    <div className="vertical-layout__outer text-style__body">
      <div className="horizontal-layout p-5 rounded-[10px] text-style__small-text border border-(--primary-yellow) bg-(--primary-yellow)/30 text-(--primary-red)">
        <FontAwesomeIcon icon={["fas", "exclamation-triangle"]} />
        <div>{SESSION_IMPACT}</div>
      </div>

      {/* Keycloak Group Membership */}
      <div className="feature-container-vertical">
        <ContainerTitle
          title="Keycloak Group Membership"
          el={
            <Button
              buttonText="Add Group"
              icon={<FontAwesomeIcon icon={["fas", "plus"]} />}
              clickAction={() => openPicker("group")}
            />
          }
        />

        {isLoading && (
          <div className="text-style__small-text text-(--primary-grey)">
            Loading Keycloak groups...
          </div>
        )}

        {error && (
          <div className="text-style__small-text text-(--primary-red)">
            {error}
          </div>
        )}

        {keycloakGroupMembershipList.map((group, i) => (
          <div
            key={group.id}
            className={`${i !== keycloakGroupMembershipList.length - 1 ? "border-b border-(--terciary-grey) pb-2.5" : ""} horizontal-layout justify-between`}
          >
            <div>
              <div className="text-(--primary-green)">{group.name}</div>
              {group.path ? (
                <div className="text-style__small-text text-(--primary-grey)">
                  {group.path}
                </div>
              ) : null}
            </div>
            <FontAwesomeIcon
              icon={["fas", "xmark"]}
              className="buttonize text-style__small-text p-1.5 rounded-[10px] text-(--primary-grey) hover:bg-(--primary-red)/10 hover:text-(--primary-red)"
              onClick={() =>
                setRemovalTarget({
                  type: "group",
                  id: group.id,
                  name: group.name,
                })
              }
            />
          </div>
        ))}

        {!isLoading && !keycloakGroupMembershipList.length && (
          <div className="text-style__small-text text-(--primary-grey)">
            No Keycloak Group Memberships assigned.
          </div>
        )}
      </div>

      {/* Direct Realm Roles */}
      <div className="feature-container-vertical">
        <ContainerTitle
          title="Direct Realm Roles"
          el={
            <Button
              buttonText="Add Realm Role"
              icon={<FontAwesomeIcon icon={["fas", "plus"]} />}
              clickAction={() => openPicker("realm-role")}
            />
          }
        />

        {directRealmRolesList.map((role, i) => (
          <div
            key={role.id}
            className={`${i !== directRealmRolesList.length - 1 ? "border-b border-(--terciary-grey) pb-2.5" : ""} horizontal-layout justify-between`}
          >
            <div>
              <div className="text-(--primary-green)">{role.name}</div>
              {role.description ? (
                <div className="text-style__small-text text-(--primary-grey)">
                  {role.description}
                </div>
              ) : null}
            </div>
            <FontAwesomeIcon
              icon={["fas", "xmark"]}
              className="buttonize text-style__small-text p-1.5 rounded-[10px] text-(--primary-grey) hover:bg-(--primary-red)/10 hover:text-(--primary-red)"
              onClick={() =>
                setRemovalTarget({ type: "realm-role", name: role.name })
              }
            />
          </div>
        ))}

        {!directRealmRolesList.length && (
          <div className="text-style__small-text text-(--primary-grey)">
            No direct realm roles assigned.
          </div>
        )}
      </div>

      {/* Client Roles */}
      <div className="feature-container-vertical">
        <ContainerTitle
          title="Client Roles"
          el={
            <Button
              buttonText="Add Client Role"
              icon={<FontAwesomeIcon icon={["fas", "plus"]} />}
              clickAction={() => openPicker("client-role")}
            />
          }
        />

        {clientRoleList.map((clientRole, i) => (
          <div
            key={clientRole.id}
            className={`${i !== clientRoleList.length - 1 ? "border-b border-(--terciary-grey) pb-2.5" : ""} horizontal-layout justify-between`}
          >
            <div>
              <div className="text-(--primary-green)">{clientRole.role}</div>
              <div className="text-style__small-text text-(--primary-grey)">
                {clientRole.clientId}
              </div>
            </div>
            <FontAwesomeIcon
              icon={["fas", "xmark"]}
              className="buttonize text-style__small-text p-1.5 rounded-[10px] text-(--primary-grey) hover:bg-(--primary-red)/10 hover:text-(--primary-red)"
              onClick={() =>
                setRemovalTarget({
                  type: "client-role",
                  clientId: clientRole.clientId,
                  name: clientRole.role,
                })
              }
            />
          </div>
        ))}

        {!clientRoleList.length && (
          <div className="text-style__small-text text-(--primary-grey)">
            No direct client roles assigned.
          </div>
        )}
      </div>

      {pickerMode && (
        <div className="overlay" onClick={closePicker}>
          <div
            className="flex max-h-[calc(100vh-3rem)] w-full max-w-6xl flex-col rounded-[10px] border border-(--terciary-grey) bg-white p-5"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex shrink-0 items-center gap-3 border-b border-(--terciary-grey) pb-3">
              <div className="flex-1">
                <div className="text-style__big-text text-(--primary-blue)">
                  {pickerMode === "group"
                    ? "Group picker"
                    : pickerMode === "realm-role"
                      ? "Realm role picker"
                      : "Client role picker"}
                </div>
                <div className="text-style__small-text text-(--primary-grey)">
                  Changes here update Keycloak and revoke active Powerdeed
                  sessions for this employee.
                </div>
              </div>
              <button
                type="button"
                aria-label="Close Keycloak picker"
                className="buttonize rounded-[10px] p-2.5 text-(--primary-grey) hover:bg-(--terciary-grey)/30 hover:text-(--primary-blue)"
                onClick={closePicker}
              >
                <FontAwesomeIcon icon={["fas", "xmark"]} />
              </button>
            </div>

            {pickerError ? (
              <div className="mb-3 rounded-[10px] border border-(--primary-red)/30 bg-(--primary-red)/10 p-3 text-style__small-text text-(--primary-red)">
                {pickerError}
              </div>
            ) : null}

            {pickerMode === "client-role" ? (
              <div className="mb-3 flex flex-wrap items-center gap-2.5 text-style__small-text">
                <span className="text-(--primary-grey)">Client</span>
                <select
                  className="input-style"
                  value={selectedClientId}
                  onChange={(event) => {
                    setSelectedClientId(event.target.value);
                    setPickerPage(1);
                  }}
                >
                  {clients.map((client) => (
                    <option key={client.id} value={client.clientId}>
                      {client.clientId}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}

            <div className="section-scrollbar min-h-0 flex-1 overflow-auto pr-1">
              {isPickerLoading ? (
                <div className="grid min-h-40 place-items-center text-style__small-text text-(--primary-grey)">
                  Loading Keycloak options...
                </div>
              ) : pickerMode === "group" ? (
                <DataTable
                  title="Available Groups"
                  description={`${groupRows.length} groups`}
                  search={{
                    value: search,
                    onChange: (value) => {
                      setSearch(value);
                      setPickerPage(1);
                    },
                    placeholder: "Search groups",
                  }}
                  columns={[
                    { id: "name", header: "Group", accessorKey: "name" },
                    { id: "path", header: "Path", accessorKey: "path" },
                    actionColumn<typeof groupRows[number]>({
                      onAdd: (group) => addGroup(group.id),
                    }),
                  ]}
                  data={paginate(groupRows, pickerPage)}
                  getRowId={(group) => group.id}
                  pagination={{
                    currentPage: pickerPage,
                    pageSize,
                    totalItems: groupRows.length,
                    onPageChange: setPickerPage,
                    onPageSizeChange: () => undefined,
                  }}
                />
              ) : pickerMode === "realm-role" ? (
                <DataTable
                  title="Available Realm Roles"
                  description={`${realmRoleRows.length} roles`}
                  search={{
                    value: search,
                    onChange: (value) => {
                      setSearch(value);
                      setPickerPage(1);
                    },
                    placeholder: "Search realm roles",
                  }}
                  columns={roleColumns<typeof realmRoleRows[number]>((role) =>
                    addRealmRole(role.name),
                  )}
                  data={paginate(realmRoleRows, pickerPage)}
                  getRowId={(role) => role.id}
                  pagination={{
                    currentPage: pickerPage,
                    pageSize,
                    totalItems: realmRoleRows.length,
                    onPageChange: setPickerPage,
                    onPageSizeChange: () => undefined,
                  }}
                />
              ) : (
                <DataTable
                  title="Available Client Roles"
                  description={`${clientRoleRows.length} roles`}
                  search={{
                    value: search,
                    onChange: (value) => {
                      setSearch(value);
                      setPickerPage(1);
                    },
                    placeholder: "Search client roles",
                  }}
                  columns={roleColumns<typeof clientRoleRows[number]>((role) =>
                    addClientRole(role.name),
                  )}
                  data={paginate(clientRoleRows, pickerPage)}
                  getRowId={(role) => role.id}
                  pagination={{
                    currentPage: pickerPage,
                    pageSize,
                    totalItems: clientRoleRows.length,
                    onPageChange: setPickerPage,
                    onPageSizeChange: () => undefined,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {removalTarget && (
        <div className="overlay" onClick={() => setRemovalTarget(null)}>
          <div
            className="w-full max-w-xl rounded-[10px] border border-(--terciary-grey) bg-white p-5 shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-start gap-3">
              <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-(--primary-yellow)/30 text-(--primary-red)">
                <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-style__big-text text-(--primary-blue)">
                  Remove Keycloak access?
                </div>
                <div className="mt-1 text-style__small-text text-(--primary-grey)">
                  You are about to remove{" "}
                  <span className="font-bold text-(--primary-blue)">
                    {removalTarget.type === "group"
                      ? removalTarget.name
                      : removalTarget.type === "realm-role"
                        ? removalTarget.name
                        : `${removalTarget.clientId}: ${removalTarget.name}`}
                  </span>{" "}
                  from {employee.name}. This will revoke active Powerdeed
                  sessions so the next login uses a fresh Keycloak entitlement
                  snapshot.
                </div>
              </div>
              <button
                type="button"
                aria-label="Close removal confirmation"
                className="buttonize rounded-[10px] p-2.5 text-(--primary-grey) hover:bg-(--terciary-grey)/30 hover:text-(--primary-blue)"
                onClick={() => setRemovalTarget(null)}
              >
                <FontAwesomeIcon icon={["fas", "xmark"]} />
              </button>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                buttonText="Cancel"
                buttonType="light"
                clickAction={() => setRemovalTarget(null)}
              />
              <Button
                buttonText="Remove access"
                buttonType="red"
                disabled={isSaving}
                clickAction={confirmRemoval}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
