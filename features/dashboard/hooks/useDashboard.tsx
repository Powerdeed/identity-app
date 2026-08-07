"use client";

import useDashboardApi from "./useDashboardApi";

export default function useDashboard() {
  const api = useDashboardApi();

  return { actions: api };
}
