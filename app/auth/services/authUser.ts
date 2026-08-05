import { User, UserPermission, UserSession } from "../types/user.type";
import { identityApi } from "@lib/api/identityAxios";
import { identityApiRequest } from "@lib/api/identityApiRequest";

export const getCurrentUser = async () => {
  const session = await identityApiRequest<{
    user: User;
    permissions: UserPermission[];
    sessionId: string;
    keycloakUserId: string;
    expiresAt: string;
  }>({
    method: "GET",
    url: "/auth/session",
  });

  return {
    ...session.user,
    permissions: session.permissions,
    keycloakUserId: session.keycloakUserId,
  };
};

export const getSessions = async () => {
  const res = await identityApi.get<{
    success: boolean;
    data: { sessions: UserSession[] };
  }>("/auth/sessions");

  return res.data.data.sessions;
};

export const signOutIdentitySession = () => identityApi.post("/auth/sign-out");
