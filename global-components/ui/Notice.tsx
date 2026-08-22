"use client";

import { ReactNode } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

type NoticeTone = "info" | "success" | "warning" | "danger";

const toneClassNames: Record<NoticeTone, string> = {
  info: "border-(--secondary-blue) bg-(--secondary-blue)/10 text-(--secondary-blue)",
  success:
    "border-(--primary-green) bg-(--primary-green-faded)/30 text-(--primary-green)",
  warning:
    "border-(--primary-yellow) bg-(--primary-yellow-faded)/10 text-(--primary-yellow)",
  danger:
    "border-(--primary-red) bg-(--primary-red-faded)/10 text-(--primary-red)",
};

const toneIconNames: Record<NoticeTone, "info-circle" | "check-circle" | "exclamation-triangle"> = {
  info: "info-circle",
  success: "check-circle",
  warning: "exclamation-triangle",
  danger: "exclamation-triangle",
};

export default function Notice({
  tone = "info",
  children,
  className = "",
}: {
  tone?: NoticeTone;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`horizontal-layout rounded-[10px] border p-2.5 text-style__small-text ${toneClassNames[tone]} ${className}`}
    >
      <FontAwesomeIcon icon={["fas", toneIconNames[tone]]} />
      <div>{children}</div>
    </div>
  );
}
