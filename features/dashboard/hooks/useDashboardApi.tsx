"use client";

import { useEffect, useState } from "react";
import { getDashboardData } from "../services/getashboardData";
import { execute } from "@/lib";

export type DashboardMetric = {
  pendingActivation: number;
  activeWorkforce: number;
  suspended: number;
  expiringTemporaryAccess: number;
  activeSessions: number;
  overdueReviews: number;
};

export type DashboardAction = {
  id: string;
  type: "provision" | "review";
  title: string;
  summary: string;
  href: string;
};

export type DashboardChange = {
  id: string;
  category: "lifecycle" | "access" | "session" | "keycloak";
  eventType: string;
  occurredAt: string;
  actorName: string | null;
  targetName: string | null;
};

export type DashboardData = {
  metrics: DashboardMetric;
  actionQueue: DashboardAction[];
  recentChanges: DashboardChange[];
};

export default function useDashboardApi() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const fetchDashboardData = async () =>
      execute(getDashboardData, {
        setLoading: (loading) => active && setIsLoading(loading),
        setError: (error) => active && setError(error),
        onSuccess: (result) => {
          if (active) setData(result);
        },
      });

    fetchDashboardData();

    return () => {
      active = false;
    };
  }, []);

  return { data, isLoading, error };
}
