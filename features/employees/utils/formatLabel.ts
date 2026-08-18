export const formatLabel = (value?: string) =>
  value
    ? value
        .replace(/[._-]+/g, " ")
        .replace(/\b\w/g, (character) => character.toUpperCase())
    : "Not assigned";
