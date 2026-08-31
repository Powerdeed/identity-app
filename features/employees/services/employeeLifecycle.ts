import type { User } from "@/globals/types/user.type";
import { apiRequest } from "@lib";

type UserResponse = { success: boolean; user: User };
type LifecycleAction = "activate" | "suspend" | "archive";

async function changeEmployeeStatus(
  employeeId: string,
  action: LifecycleAction,
  reason?: string,
): Promise<User> {
  const response = await apiRequest<UserResponse>({
    method: "POST",
    url: `/users/${employeeId}/${action}`,
    data: { reason },
  });
  return response.user;
}

export const activateEmployee = (employeeId: string, reason?: string) =>
  changeEmployeeStatus(employeeId, "activate", reason);

export const suspendEmployee = (employeeId: string, reason?: string) =>
  changeEmployeeStatus(employeeId, "suspend", reason);

export const archiveEmployee = (employeeId: string, reason?: string) =>
  changeEmployeeStatus(employeeId, "archive", reason);
