"use client";

import { Dispatch, SetStateAction } from "react";

export default function useClipboard() {
  const handleCopy = async (
    value: string,
    setCopying: Dispatch<SetStateAction<boolean>>,
  ) => {
    setCopying(true);

    try {
      await navigator.clipboard.writeText(value ?? "");

      setTimeout(() => {
        setCopying(false);
      }, 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
      setCopying(false);
    }
  };

  return { handleCopy };
}
