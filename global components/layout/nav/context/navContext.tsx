"use client";

import { createContext, Dispatch, SetStateAction } from "react";

interface NavContext {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
  profileOptions: boolean;
  setProfileOptions: Dispatch<SetStateAction<boolean>>;
  openNotifications: boolean;
  setOpenNotifications: Dispatch<SetStateAction<boolean>>;
}

export const navContext = createContext<NavContext | null>(null);
