import { User } from "@/app/auth";
import { identityApiRequest } from "@/lib/api/identityApiRequest";

type rawUserData = {
  page: number;
  pageSize: number;
  total: number;
  users: User[];
};

export const getEmployees = async (): Promise<User[]> => {
  const userData = await identityApiRequest<rawUserData>({
    method: "GET",
    url: "/users",
  });

  return userData.users;
};
