"use client";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useDashboard from "../hooks/useDashboard";
import type { Action } from "../hooks/useDashboardApi";
import Link from "next/link";

export default function ActionQueue() {
  const { actions } = useDashboard();

  return (
    <div className="feature-container-vertical">
      <div className="vertical-layout__inner">
        <div className="p-2.5 border-b border-(--secondary-grey) horizontal-layout">
          <div className="flex-1 text-style__big-text">Action Queue</div>

          <div className="text-style__small-text text-(--primary-grey)">
            6 items
          </div>
        </div>

        {actions.actionQueue &&
          actions.actionQueue.map((action, i) => (
            <Action
              key={i}
              action={action}
              islastAction={i === actions.actionQueue.length - 1}
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
  action: Action;
  islastAction: boolean;
}) {
  return (
    <div
      className={`pb-2.5 horizontal-layout ${!islastAction && "border-b border-(--secondary-grey)"}`}
    >
      <FontAwesomeIcon icon={action.icon} className={action.color} />

      <div className="flex-1">
        <div className="text-style__body--bold">{action.action}</div>
        <div className="text-style__small-text">{action.summary}</div>
      </div>

      <Link
        href="/"
        className="horizontal-layout text-style__small-text text-(--secondary-blue)"
      >
        <div className="hover:underline">{action.actionType}</div>
        &#10140;
      </Link>
    </div>
  );
}
