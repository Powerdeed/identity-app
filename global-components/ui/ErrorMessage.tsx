"use client";

export default function ErrorMessage({
  error,
  customStyles,
}: {
  error: string;
  customStyles?: string;
}) {
  return <div className={`text-(--primary-red) ${customStyles}`}>{error}</div>;
}
