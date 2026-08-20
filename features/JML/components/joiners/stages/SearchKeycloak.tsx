"use client";

import { getInitials } from "@/global-components/layout/nav";
import Button from "@/global-components/ui/Button";
import Dotindicator from "@/global-components/ui/Dotindicator";
import SearchBar from "@/global-components/ui/SearchBar";
import { getRandomClassNameColor } from "@/globals/helper functions/getRandomColor";
import useKeycloakUserSearch from "../../../hooks/useKeycloakUserSearch";

export default function SearchKeycloak() {
  const search = useKeycloakUserSearch();

  return (
    <div className="vertical-layout__inner">
      <div className="text-style__small-text text-(--primary-grey)">
        Search for an existing Keycloak user to provision into Powerdeed. The
        user must already exist in Keycloak before a Powerdeed profile can be
        created.
      </div>

      <SearchBar
        placeholder="Search by name, email, or Keycloak ID"
        val={search.search}
        changeFunc={search.setSearch}
      />

      {search.isSearching && (
        <div className="text-style__small-text text-(--primary-grey)">
          Searching Keycloak...
        </div>
      )}

      {!search.isSearching && search.search.trim().length >= 2 && (
        <div className="vertical-layout__inner bg-white border border-(--terciary-grey) rounded-[10px] p-2.5">
          {search.results.map((employee, i) => {
            const initialBackgroundColor = getRandomClassNameColor(employee.id);
            const isSelected = search.selectedUserId === employee.id;
            const isProvisioned = Boolean(employee.powerdeedUserId);

            return (
              <div
                key={employee.id}
                className={`${search.results.length !== i + 1 ? "border-b border-(--terciary-grey) pb-2.5" : ""}`}
              >
                <div className="horizontal-layout">
                  <div
                    className={`w-8 h-8 grid items-center text-center ${initialBackgroundColor} rounded-[10px] text-style__body--bold`}
                  >
                    {getInitials(employee.name)}
                  </div>

                  <div className="flex-1">
                    <div className="text-style__body--bold">
                      {employee.name}
                    </div>
                    <div className="horizontal-layout text-style__small-text">
                      <div>{employee.email}</div>
                      <Dotindicator />
                      <div>{employee.id}</div>
                    </div>
                  </div>

                  <Button
                    buttonType="light"
                    buttonText={
                      isProvisioned
                        ? "Already provisioned"
                        : isSelected
                          ? "Selected"
                          : "Select"
                    }
                    disabled={isProvisioned || isSelected}
                    clickAction={() => {
                      search.selectUser(employee);
                    }}
                  />
                </div>
              </div>
            );
          })}

          {!search.results.length && (
            <div className="py-5 text-center text-style__small-text text-(--primary-grey)">
              No matching Keycloak users found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
