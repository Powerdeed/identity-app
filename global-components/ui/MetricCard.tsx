"use client";

import type { ReactNode } from "react";

export default function MetricCard({
  label,
  value,
  description,
  tone = "default",
}: {
  label: string;
  value: ReactNode;
  description?: ReactNode;
  tone?: "default" | "green" | "yellow" | "red" | "blue";
}) {
  const valueTone =
    tone === "green"
      ? "text-(--primary-green)"
      : tone === "yellow"
        ? "text-(--primary-yellow)"
        : tone === "red"
          ? "text-(--primary-red)"
          : tone === "blue"
            ? "text-(--secondary-blue)"
            : "text-(--primary-blue)";

  return (
    <section className="rounded-[10px] border border-(--terciary-grey) bg-white p-4">
      <div className="text-style__small-text--bold uppercase text-(--primary-grey)">
        {label}
      </div>
      <div className={`mt-2 text-style__heading ${valueTone}`}>{value}</div>
      {description ? (
        <div className="mt-2 text-style__small-text text-(--primary-grey)">
          {description}
        </div>
      ) : null}
    </section>
  );
}
