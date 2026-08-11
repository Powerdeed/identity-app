"use client";

import { ReactNode, useState } from "react";
import { navContext } from "./navContext";

export default function NavProvider({ children }: { children: ReactNode }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [profileOptions, setProfileOptions] = useState(false);
  const [openNotifications, setOpenNotifications] = useState(false);
  return (
    <navContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        profileOptions,
        setProfileOptions,
        openNotifications,
        setOpenNotifications,
      }}
    >
      {children}
    </navContext.Provider>
  );
}
