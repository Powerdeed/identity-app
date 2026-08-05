"use client";

import { createContext, Dispatch, SetStateAction } from "react";
import type { User } from "../types/user.type";

interface UserContext {
  user: User | null;
  setUser: Dispatch<SetStateAction<User | null>>;

  loadingUser: boolean;
  setLoadingUser: Dispatch<SetStateAction<boolean>>;

  userError: string;
  setUserError: Dispatch<SetStateAction<string>>;
}

export const userContext = createContext<UserContext | null>(null);
