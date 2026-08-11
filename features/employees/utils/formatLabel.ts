export const formatLabel = (value?: string) =>
  value
    ? value
        .replaceAll("_", " ")
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : "Not assigned";
