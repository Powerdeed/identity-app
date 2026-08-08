"use client";

import { useContext, useEffect } from "react";

import { getCurrentUser } from "../services/authUser";
import { userContext } from "../context/userContext";
import { execute } from "@lib";

export default function useUser() {
  const authStates = useContext(userContext);

  if (!authStates) throw new Error("Global context must be within a provider");

  const { setUser, setLoadingUser, setUserError } = authStates;

  useEffect(() => {
    execute(getCurrentUser, {
      setLoading: setLoadingUser,
      setError: setUserError,
      onSuccess: (currentUser) => setUser(currentUser),
    });
  }, [setLoadingUser, setUser, setUserError]);

  return {};
}
