"use client";

import { useContext } from "react";
import { ApiError } from "@lib/api/utils/apiError";
import { userContext } from "../context/userContext";
import { signOutIdentitySession } from "../services/authUser";
import { buildKeycloakLogoutUrl } from "../utils/keycloakLogout";

export default function useLogout() {
  const logoutStates = useContext(userContext);

  if (!logoutStates) throw new Error("Logout states must be within a provider");

  const { setUser } = logoutStates;

  const handleLogout = async () => {
    try {
      setUser(null);

      await signOutIdentitySession().catch(() => undefined);

      window.location.assign(buildKeycloakLogoutUrl());
    } catch (err: unknown) {
      if (err instanceof ApiError) {
        console.error(err.message);
      }
    }
  };

  return {
    handleLogout,
  };
}
