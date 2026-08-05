"use client";

import "@global components/icons/icons";
import NavView from "./components/NavView";

import NavProvider from "./context/navProvider";

export default function Nav() {
  return (
    <NavProvider>
      <NavView />
    </NavProvider>
  );
}
