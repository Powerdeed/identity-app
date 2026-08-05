"use client";

import { useContext, useEffect } from "react";
import { usePathname } from "next/navigation";

import { getCurrentUser } from "../services/authUser";
import { userContext } from "../context/userContext";
import { execute } from "@lib";

export default function useUser() {
  const pathname = usePathname();
  const authStates = useContext(userContext);

  if (!authStates) throw new Error("Global context must be within a provider");

  const { setUser, setLoadingUser, setUserError } = authStates;

  useEffect(() => {
    if (pathname.startsWith("/login")) return;

    execute(getCurrentUser, {
      setLoading: setLoadingUser,
      setError: setUserError,
      onSuccess: (currentUser) => {
        console.log(currentUser);
        setUser(currentUser);
      },
    });
  }, [pathname, setLoadingUser, setUser, setUserError]);

  return {};
}
