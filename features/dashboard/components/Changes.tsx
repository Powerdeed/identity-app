"use client";

import { useState } from "react";

import Sort from "@/global-components/ui/Sort";

import useDashboard from "../hooks/useDashboard";
import type { Change } from "../hooks/useDashboardApi";
import ContainerTitle from "@/global-components/ui/ContainerTitle";

export default function Changes() {
  const [selectedFilters, setSelectedFilters] = useState([
    "Access",
    "Lifecycle",
  ]);

  const { actions } = useDashboard();

  return (
    <div className="feature-container-vertical">
      <div className="vertical-layout__inner">
        <ContainerTitle
          title="Recent Changes"
          el={
            <Sort
              sortOptions={["Lifecycle", "Access"]}
              selectedSortOptions={selectedFilters}
              setSelectedSortOptions={setSelectedFilters}
              flipDirection
            />
          }
        />

        {actions.recentChanges
          .filter((changes) =>
            selectedFilters.includes(changes.changeType.split("-")[0]),
          )
          .map((change, i) => (
            <Change
              key={i}
              change={change}
              islastChange={i === actions.recentChanges.length - 1}
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
  change: Change;
  islastChange: boolean;
}) {
  const { actions } = useDashboard();

  const colorClass =
    actions.changeTypeColor[
      change.changeType as keyof typeof actions.changeTypeColor
    ];

  return (
    <div
      className={`pb-2.5 horizontal-layout ${!islastChange && "border-b border-(--secondary-grey)"}`}
    >
      <div className={`w-2 h-2 rounded-full ${colorClass}`}></div>

      <div>
        <div className="text-style__body">{change.change}</div>
        <div className="text-style__small-text">{change.time}</div>
      </div>
    </div>
  );
}
