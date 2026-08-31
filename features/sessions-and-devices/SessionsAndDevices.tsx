"use client";

import { useSectionParams } from "@/app/[section]/SectionParamsContext";
import SessionsAndDevicesView from "./components/SessionsAndDevicesView";

export default function SessionsAndDevices() {
  const { search } = useSectionParams();

  return <SessionsAndDevicesView defaultSearch={search} />;
}
