"use client";

import { ReactNode, useContext, useState } from "react";

import { globalContext } from "./GlobalContext";
import { DEFAULT_UNSAVED_CHANGES_NOTICE } from "../constants/unsavedChangesNotice";
import { userContext } from "@app/auth";

export default function GlobalProvider({ children }: { children: ReactNode }) {
  const authStates = useContext(userContext);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [unsavedChangesNoticeVisible, setUnsavedChangesNoticeVisible] =
    useState(false);
  const [unsavedChangesNoticeText, setUnsavedChangesNoticeText] = useState(
    DEFAULT_UNSAVED_CHANGES_NOTICE,
  );

  const [sideBarOpen, setSideBarOpen] = useState(true);

  return (
    <globalContext.Provider
      value={{
        unsavedChanges,
        setUnsavedChanges,
        unsavedChangesNoticeVisible,
        setUnsavedChangesNoticeVisible,
        unsavedChangesNoticeText,
        setUnsavedChangesNoticeText,
        sideBarOpen,
        setSideBarOpen,
        user: authStates?.user ?? null,
      }}
    >
      {children}
    </globalContext.Provider>
  );
}
