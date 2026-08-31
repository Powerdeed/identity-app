"use client";

import Loader from "@/global-components/ui/Loader";
import type { DashboardData } from "../hooks/useDashboardApi";

const cards = [
  ["PENDING ACTIVATION", "pendingActivation", "Awaiting activation", "text-(--secondary-red)"],
  ["ACTIVE WORKFORCE", "activeWorkforce", "Enabled staff accounts", "text-(--primary-green)"],
  ["SUSPENDED", "suspended", "Access blocked", "text-(--secondary-red)"],
  ["EXPIRING TEMP ACCESS", "expiringTemporaryAccess", "Within 7 days", "text-(--primary-yellow)"],
  ["ACTIVE SESSIONS", "activeSessions", "Across all devices", "text-(--secondary-blue)"],
  ["OPEN ACCESS REVIEWS", "overdueReviews", "Require attention", "text-(--primary-red)"],
] as const;

export default function DashboardCards({
  data,
  isLoading,
}: {
  data: DashboardData | null;
  isLoading: boolean;
}) {

  return (
    <div className="grid grid-cols-3 gap-5">
      {cards.map(([label, key, description, color]) => (
        <DashboardCard
          key={key}
          label={label}
          value={data?.metrics[key] ?? 0}
          description={description}
          color={color}
          isLoading={isLoading}
        />
      ))}
    </div>
  );
}

function DashboardCard({
  label,
  value,
  description,
  color,
  isLoading,
}: {
  label: string;
  value: number;
  description: string;
  color: string;
  isLoading: boolean;
}) {
  return (
    <div className="feature-container-vertical">
      <div className="text-style__body">{label}</div>
      <div className={`text-style__heading ${color}`}>
        {isLoading ? <Loader /> : value}
      </div>
      <div className="text-style__small-text">{description}</div>
    </div>
  );
}
