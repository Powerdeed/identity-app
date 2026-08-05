"use client";

export const getDefaultReturnTo = () => {
  if (typeof window === "undefined") return "/";

  const returnTo = `${window.location.pathname}${window.location.search}${window.location.hash}`;

  if (!returnTo.startsWith("/") || returnTo.startsWith("/login")) return "/";

  return returnTo;
};
