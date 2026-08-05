"use client";

import { createContext, Dispatch, SetStateAction } from "react";
import type { User } from "@app/auth";

export type UnsavedChangesNoticeText = {
  title: string;
  message: string;
};

type GlobalStates = {
  unsavedChanges: boolean;
  setUnsavedChanges: Dispatch<SetStateAction<boolean>>;
  unsavedChangesNoticeVisible: boolean;
  setUnsavedChangesNoticeVisible: Dispatch<SetStateAction<boolean>>;
  unsavedChangesNoticeText: UnsavedChangesNoticeText;
  setUnsavedChangesNoticeText: Dispatch<
    SetStateAction<UnsavedChangesNoticeText>
  >;
  sideBarOpen: boolean;
  setSideBarOpen: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  loadingUser?: boolean;
  userError?: string;
};

export const globalContext = createContext<GlobalStates | null>(null);
