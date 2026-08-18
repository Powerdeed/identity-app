import type { User } from "@/app/auth";
import { identityApiRequest } from "@/lib/api/identityApiRequest";

type UserResponse = { success: boolean; user: User };
type LifecycleAction = "activate" | "suspend" | "archive";

async function changeEmployeeStatus(
  employeeId: string,
  action: LifecycleAction,
  reason?: string,
): Promise<User> {
  const response = await identityApiRequest<UserResponse>({
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
