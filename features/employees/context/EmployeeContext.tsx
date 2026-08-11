"use client";

import { Dispatch, SetStateAction, createContext } from "react";
import type { EmployeeMenu } from "../constants/EMPLOYEE_NAV_MENU";

export type EmployeeContextValue = {
  currentMenu: EmployeeMenu;
  setCurrentMenu: Dispatch<SetStateAction<EmployeeMenu>>;
};

export const employeeContext = createContext<EmployeeContextValue | null>(null);
