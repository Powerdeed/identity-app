import type {
  AccessProfile,
  EmploymentProfile,
  User,
} from "@/globals/types/user.type";
import { apiRequest } from "@lib";

type UserResponse = { success: boolean; user: User };

export async function getEmployee(employeeId: string): Promise<User> {
  const response = await apiRequest<UserResponse>({
    method: "GET",
    url: `/users/${employeeId}`,
  });
  return response.user;
}

export async function updateEmployeeEmployment(
  employeeId: string,
  employment: EmploymentProfile,
): Promise<User> {
  const response = await apiRequest<UserResponse>({
    method: "PATCH",
    url: `/users/${employeeId}`,
    data: { employment },
  });
  return response.user;
}

export async function updateEmployeeAccess(
  employeeId: string,
  input: { access?: AccessProfile; permissions?: string[] },
): Promise<User> {
  const response = await apiRequest<UserResponse>({
    method: "PATCH",
    url: `/users/${employeeId}/access`,
    data: input,
  });
  return response.user;
}
