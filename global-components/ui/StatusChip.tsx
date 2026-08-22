"use client";

import type { ReactNode } from "react";

type StatusTone = "blue" | "green" | "yellow" | "red" | "purple" | "grey";

const toneClassNames: Record<StatusTone, string> = {
  blue: "border-(--secondary-blue) bg-(--secondary-blue)/10 text-(--secondary-blue)",
  green:
    "border-(--primary-green) bg-(--primary-green-faded)/20 text-(--primary-green)",
  yellow:
    "border-(--primary-yellow) bg-(--primary-yellow-faded)/10 text-(--primary-yellow)",
  red: "border-(--primary-red) bg-(--primary-red-faded)/10 text-(--primary-red)",
  purple:
    "border-(--primary-purple) bg-(--primary-purple-faded)/10 text-(--primary-purple)",
  grey: "border-(--terciary-grey) bg-(--terciary-grey)/20 text-(--primary-grey)",
};

export default function StatusChip({
  children,
  tone = "grey",
  className = "",
}: {
  children: ReactNode;
  tone?: StatusTone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex w-fit items-center rounded-[10px] border px-2 py-1 text-style__small-text--bold ${toneClassNames[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
