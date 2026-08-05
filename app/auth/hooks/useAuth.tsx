"use client";

import UseAuthStates from "./useAuthStates";
import useLogout from "./useLogout";
import useUser from "./useUser";

export default function UseAuth() {
  const authStates = UseAuthStates();
  const logout = useLogout();
  const user = useUser();

  return { authStates, authActions: { ...logout, ...user } };
}
