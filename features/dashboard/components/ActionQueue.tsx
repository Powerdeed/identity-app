"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { DashboardAction, DashboardData } from "../hooks/useDashboardApi";
import Link from "next/link";
import ContainerTitle from "@/global-components/ui/ContainerTitle";

export default function ActionQueue({
  data,
  isLoading,
  error,
}: {
  data: DashboardData | null;
  isLoading: boolean;
  error: string;
}) {
  const actions = data?.actionQueue ?? [];

  return (
    <div className="feature-container-vertical">
      <div className="vertical-layout__inner text-style__small-text">
        <ContainerTitle
          title="Action Queue"
          el={
            <div className="text-(--primary-grey)">{actions.length} items</div>
          }
        />

        {error && <div className=" text-(--primary-red)">{error}</div>}

        {isLoading && (
          <div className="text-(--primary-grey)">Loading action queue...</div>
        )}

        {!isLoading && !error && !actions.length && (
          <div className="text-(--primary-grey)">
            No actions require attention.
          </div>
        )}

        {actions.map((action, i) => (
          <Action
            key={action.id}
            action={action}
            islastAction={i === actions.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function Action({
  action,
  islastAction,
}: {
  action: DashboardAction;
  islastAction: boolean;
}) {
  return (
    <div
      className={`pb-2.5 horizontal-layout ${!islastAction && "border-b border-(--secondary-grey)"}`}
    >
      <FontAwesomeIcon
        icon={
          action.type === "provision"
            ? ["fas", "user-plus"]
            : ["fas", "clipboard-check"]
        }
        className={
          action.type === "provision"
            ? "text-(--secondary-blue)"
            : "text-(--primary-yellow)"
        }
      />

      <div className="flex-1">
        <div className="text-style__body--bold">{action.title}</div>
        <div className="text-style__small-text">{action.summary}</div>
      </div>

      <Link
        href={action.href}
        className="horizontal-layout text-style__small-text text-(--secondary-blue)"
      >
        <div className="hover:underline">Open</div>
        &#10140;
      </Link>
    </div>
  );
}
