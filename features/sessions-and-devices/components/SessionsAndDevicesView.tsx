"use client";

import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import Button from "@/global-components/ui/Button";
import DataTable from "@/global-components/ui/DataTable";
import EmptyState from "@/global-components/ui/EmptyState";
import Loader from "@/global-components/ui/Loader";
import Notice from "@/global-components/ui/Notice";
import Selector from "@/global-components/ui/Selector";
import { SectionTitle } from "@/global-components/ui/Title";

import { sessionFilters } from "../constants/sessions";
import { createSessionColumns } from "./sessionColumns";
import useSessionsAndDevices from "../hooks/useSessionsAndDevices";

export default function SessionsAndDevicesView({
  defaultSearch = "",
}: {
  defaultSearch?: string;
}) {
  const {
    rows,
    search,
    setSearch,
    status,
    setStatus,
    page,
    setPage,
    pageSize,
    setPageSize,
    total,
    isLoading,
    isMutating,
    error,
    canManageSessions,
    activeCount,
    revoke,
  } = useSessionsAndDevices(defaultSearch);

  const columns = createSessionColumns({
    canManageSessions,
    isMutating,
    onRevoke: revoke,
  });

  const activeStatusLabel =
    sessionFilters.find((filter) => filter.value === status)?.label ??
    sessionFilters[0].label;

  return (
    <div className="uniform-page-display min-w-0 text-style__body">
      <SectionTitle
        title="Sessions & Devices"
        subtitle="Active, revoked, and expired sessions across the workforce"
      />

      {error ? <Notice tone="danger">{error}</Notice> : null}

      <DataTable
        title="Workforce Sessions"
        description={
          isLoading ? (
            <div className="horizontal-layout">
              <Loader />
              {"Loading sessions..."}
            </div>
          ) : (
            `${total} session${total === 1 ? "" : "s"} found`
          )
        }
        headerAside={
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="text-style__small-text text-(--primary-grey)">
              <span className="text-(--primary-yellow)">●</span> Future signal:
              unfamiliar device and location risk can be added here.
            </div>

            <div className="min-w-[170px]">
              <Selector
                options={sessionFilters.map((filter) => filter.label)}
                selectedOption={activeStatusLabel}
                setSelectedOption={(nextValue) => {
                  const match = sessionFilters.find(
                    (filter) => filter.label === nextValue,
                  );

                  if (match) {
                    setStatus(match.value as typeof status);
                    setPage(1);
                  }
                }}
                selectFirstOption={false}
              />
            </div>
          </div>
        }
        search={{
          value: search,
          onChange: setSearch,
          placeholder: "Search person, email, or IP",
        }}
        columns={columns}
        data={rows}
        getRowId={(row) => row.id}
        minWidthClassName="min-w-260"
        emptyState={
          <EmptyState
            icon="tv"
            title="No sessions found"
            description="Sessions will appear after users sign in through Keycloak and identity-service creates session records."
          />
        }
        pagination={{
          totalItems: total,
          currentPage: page,
          pageSize,
          onPageChange: setPage,
          onPageSizeChange: setPageSize,
          dataType: "sessions",
        }}
      />

      {canManageSessions && activeCount > 0 ? (
        <div className="flex justify-end">
          <Button
            buttonText={`${activeCount} active on this page`}
            buttonType="light"
            disabled
            icon={<FontAwesomeIcon icon={faTrashCan} />}
          />
        </div>
      ) : null}
    </div>
  );
}
