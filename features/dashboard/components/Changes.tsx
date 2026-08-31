"use client";

import { useState } from "react";

import Sort from "@/global-components/ui/Sort";

import type { DashboardChange, DashboardData } from "../hooks/useDashboardApi";
import ContainerTitle from "@/global-components/ui/ContainerTitle";
import Dotindicator from "@/global-components/ui/Dotindicator";

export default function Changes({
  data,
  isLoading,
  error,
}: {
  data: DashboardData | null;
  isLoading: boolean;
  error: string;
}) {
  const [selectedFilters, setSelectedFilters] = useState([
    "Access",
    "Lifecycle",
    "Session",
    "Keycloak",
  ]);

  const changes = data?.recentChanges ?? [];

  return (
    <div className="feature-container-vertical">
      <div className="text-style__small-text vertical-layout__inner">
        <ContainerTitle
          title="Recent Changes"
          el={
            <Sort
              sortOptions={["Lifecycle", "Access", "Session", "Keycloak"]}
              selectedSortOptions={selectedFilters}
              setSelectedSortOptions={setSelectedFilters}
              flipDirection
            />
          }
        />

        {error && <div className="text-(--primary-red)">{error}</div>}
        {isLoading && (
          <div className="text-(--primary-grey)">Loading recent changes...</div>
        )}
        {!isLoading && !error && !changes.length && (
          <div className="text-(--primary-grey)">
            No audit events recorded yet.
          </div>
        )}
        {changes
          .filter((changes) =>
            selectedFilters.includes(
              `${changes.category.charAt(0).toUpperCase()}${changes.category.slice(1)}`,
            ),
          )
          .map((change, i) => (
            <Change
              key={change.id}
              change={change}
              islastChange={i === changes.length - 1}
            />
          ))}
      </div>
    </div>
  );
}

function Change({
  change,
  islastChange,
}: {
  change: DashboardChange;
  islastChange: boolean;
}) {
  const colorClass = {
    lifecycle: "bg-(--primary-blue)",
    access: "bg-(--primary-green)",
    session: "bg-(--primary-yellow)",
    keycloak: "bg-(--primary-grey)",
  }[change.category];

  return (
    <div
      className={`text-style__body pb-2.5 horizontal-layout ${!islastChange && "border-b border-(--secondary-grey)"}`}
    >
      <Dotindicator color={colorClass} />

      <div>
        <div>
          {change.targetName
            ? `${change.eventType} - ${change.targetName}`
            : change.eventType}
        </div>

        <div className="text-style__small-text">
          {new Date(change.occurredAt).toLocaleString()}

          {change.actorName ? ` by ${change.actorName}` : ""}
        </div>
      </div>
    </div>
  );
}
