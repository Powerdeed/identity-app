export const getInitials = (name: string) => {
  const names = name.trim().split(/\s+/).filter(Boolean);

  if (names.length === 0) return "?";
  if (names.length === 1) return names[0].slice(0, 2).toUpperCase();

  return `${names[0][0]}${names.at(-1)?.[0]}`.toUpperCase();
};
