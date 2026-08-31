import { apiRequest } from "@lib";
import { DashboardData } from "../hooks/useDashboardApi";

export const getDashboardData = async () =>
  apiRequest<DashboardData>({
    method: "GET",
    url: "/admin/dashboard",
  });
