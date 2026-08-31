"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatLabel } from "@/features/employees/utils/formatLabel";
import { getInitials } from "@/global-components/layout/nav";
import Button from "@/global-components/ui/Button";
import Dotindicator from "@/global-components/ui/Dotindicator";
import SearchBar from "@/global-components/ui/SearchBar";
import { getRandomClassNameColor } from "@/globals";
import useMoverWorkflow from "../../../hooks/useMoverWorkflow";
import useMoverEmployeeSearch from "../../../hooks/useMoverEmployeeSearch";

export default function SelectPerson() {
  const workflow = useMoverWorkflow();
  const search = useMoverEmployeeSearch();
  const employee = workflow.selectedUser;
  const currentAccess = [
    ...workflow.keycloakGroups.map((group) => group.name),
    ...(employee?.access?.roles ?? []).map((role) => role.roleId),
  ];

  return (
    <div className="vertical-layout__outer">
      <div className="text-style__small-text text-(--primary-grey)">
        Search for an active staff member who is changing departments, roles, or
        reporting line. Only active accounts can be moved.
      </div>

      <div className="text-style__body">SEARCH STAFF</div>
      <SearchBar
        placeholder="Search name, email or employee ID"
        val={search.search}
        changeFunc={search.setSearch}
      />

      {search.isSearching && (
        <div className="text-style__small-text text-(--primary-grey)">
          Searching active employees...
        </div>
      )}

      {!employee && !search.isSearching && search.search.trim().length >= 2 && (
        <div className="vertical-layout__inner border border-(--terciary-grey) rounded-[10px] p-2.5">
          {search.results.map((candidate, index) => (
            <div
              key={candidate.id}
              className={`horizontal-layout ${index + 1 !== search.results.length ? "border-b border-(--terciary-grey) pb-2.5" : ""}`}
            >
              <div
                className={`w-8 h-8 grid items-center text-center ${getRandomClassNameColor(candidate.id)} rounded-[10px] text-style__body--bold`}
              >
                {getInitials(candidate.name)}
              </div>
              <div className="flex-1">
                <div className="text-style__body--bold">{candidate.name}</div>
                <div className="horizontal-layout text-style__small-text text-(--primary-grey)">
                  <div>{candidate.email}</div>
                  <Dotindicator />
                  <div>{formatLabel(candidate.employment?.departmentId)}</div>
                </div>
              </div>
              <Button
                buttonType="light"
                buttonText={search.isLoadingSelection ? "Loading..." : "Select"}
                disabled={search.isLoadingSelection}
                clickAction={() => search.selectUser(candidate)}
              />
            </div>
          ))}

          {!search.results.length && (
            <div className="py-5 text-center text-style__small-text text-(--primary-grey)">
              No active employees match that search.
            </div>
          )}
        </div>
      )}

      {employee && (
        <>
          <div className="horizontal-layout border border-(--secondary-blue) bg-(--secondary-blue)/10 rounded-[10px] p-2.5">
            <div
              className={`w-8 h-8 grid items-center text-center ${getRandomClassNameColor(employee.id)} rounded-[10px] text-style__body--bold`}
            >
              {getInitials(employee.name)}
            </div>
            <div className="flex-1">
              <div className="text-style__body--bold">{employee.name}</div>
              <div className="horizontal-layout text-style__small-text">
                <div>{employee.email}</div>
                <Dotindicator />
                <div>{formatLabel(employee.employment?.departmentId)}</div>
              </div>
            </div>
            <button
              type="button"
              aria-label="Clear selected employee"
              onClick={workflow.clearSelection}
              className="buttonize hover:text-(--primary-red) hover:bg-(--terciary-grey)/30 rounded-[10px] p-2.5"
            >
              <FontAwesomeIcon icon={["fas", "xmark"]} />
            </button>
          </div>

          <div className="vertical-layout__inner bg-(--terciary-grey)/30 p-2.5 rounded-[10px]">
            <div className="vertical-layout__inner border-b border-(--terciary-grey) pb-2.5">
              <div className="text-style__body">CURRENT ASSIGNMENT</div>
              {[
                ["Department", employee.employment?.departmentId],
                ["Title", employee.employment?.jobTitle],
                ["Manager", employee.employment?.managerId],
                ["Team", employee.employment?.teamIds?.join(", ")],
              ].map(([label, value]) => (
                <div key={label} className="horizontal-layout">
                  <div className="flex-1 text-(--primary-grey)">{label}</div>
                  <div>{formatLabel(value)}</div>
                </div>
              ))}
            </div>

            <div className="vertical-layout__inner">
              <div className="text-style__body">CURRENT ACCESS</div>
              <div className="horizontal-layout flex-wrap">
                {currentAccess.map((access) => (
                  <div
                    key={access}
                    className="text-style__small-text text-(--secondary-blue) bg-(--secondary-blue)/10 border border-(--secondary-blue) px-1 rounded-[10px]"
                  >
                    {access}
                  </div>
                ))}
                {!currentAccess.length && (
                  <div className="text-style__small-text text-(--primary-grey)">
                    No assigned groups or Powerdeed roles.
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
