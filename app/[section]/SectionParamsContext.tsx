"use client";

import { createContext, useContext, type ReactNode } from "react";

type SectionParamsValue = {
  search: string;
  tab?: string;
};

const SectionParamsContext = createContext<SectionParamsValue>({
  search: "",
  tab: undefined,
});

export function SectionParamsProvider({
  children,
  search,
  tab,
}: {
  children: ReactNode;
  search?: string;
  tab?: string;
}) {
  return (
    <SectionParamsContext.Provider value={{ search: search ?? "", tab }}>
      {children}
    </SectionParamsContext.Provider>
  );
}

export function useSectionParams() {
  return useContext(SectionParamsContext);
}
