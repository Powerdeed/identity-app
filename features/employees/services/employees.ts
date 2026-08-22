import { User } from "@/app/auth";
import { identityApiRequest } from "@/lib/api/identityApiRequest";

type rawUserData = {
  page: number;
  pageSize: number;
  total: number;
  users: User[];
};

type GetEmployeesParams = {
  search?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export const getEmployees = async (
  params: GetEmployeesParams = {},
): Promise<User[]> => {
  const userData = await identityApiRequest<rawUserData>({
    method: "GET",
    url: "/users",
    params: {
      page: params.page ?? 1,
      pageSize: params.pageSize ?? 100,
      search: params.search || undefined,
      status: params.status || undefined,
    },
  });

  return userData.users;
};
