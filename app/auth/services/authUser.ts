import {
  User,
  UserPermission,
  UserSession,
} from "../../../globals/types/user.type";
import { api } from "@/lib/api/axios";
import { apiRequest } from "@lib";

export const getCurrentUser = async () => {
  const session = await apiRequest<{
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
  const res = await api.get<{
    success: boolean;
    data: { sessions: UserSession[] };
  }>("/auth/sessions");

  return res.data.data.sessions;
};

export const signOutIdentitySession = () => api.post("/auth/sign-out");
