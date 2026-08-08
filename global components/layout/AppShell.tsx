"use client";

import { ReactNode } from "react";

import { AuthGuard } from "@app/auth";
import { GlobalProvider, UnsavedChangesGuard } from "@globals";
import Nav from "./nav/Nav";
import SideBar from "./SideBar";

export default function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <GlobalProvider>
        <Nav />
        <SideBar />
        <UnsavedChangesGuard />
        {children}
      </GlobalProvider>
    </AuthGuard>
  );
}
