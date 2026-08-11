"use client";

export default function Dotindicator({
  color = "bg-(--secondary-grey)",
}: {
  color?: string;
}) {
  return <div className={`w-1.5 h-1.5 rounded-full ${color}`}></div>;
}
