"use client";

import { ReactNode } from "react";

export default function ContainerTitle({
  title,
  el,
}: {
  title: string;
  el?: ReactNode;
}) {
  return (
    <div className="border-b border-(--terciary-grey) horizontal-layout justify-between pb-2.5">
      <div className="text-style__big-text">{title}</div>
      {el}
    </div>
  );
}
