export const companyThemeColors = {
  "--primary-blue": "#0a1f44",
  "--secondary-blue": "#0043b9",
  "--secondary-yellow": "#ffd600",
  "--primary-red": "#ff0000",
  "--primary-green": "#00c896",
  "--primary-purple": "#9932cc",
  "--primary-grey": "#838383",
} as const;

const companyThemeColorClassNames = [
  "bg-(--primary-blue)/15 text-(--primary-blue)",
  "bg-(--secondary-blue)/15 text-(--secondary-blue)",
  "bg-(--secondary-yellow)/15 text-(--secondary-yellow)",
  "bg-(--primary-red)/15 text-(--primary-red)",
  "bg-(--primary-green)/15 text-(--primary-green)",
  "bg-(--primary-purple)/15 text-(--primary-purple)",
  "bg-(--primary-grey)/15 text-(--primary-grey)",
] as const;

function getColorIndex(length: number, seed?: string): number {
  if (!seed) return Math.floor(Math.random() * length);

  const hash = Array.from(seed).reduce(
    (value, character) => (value * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );

  return hash % length;
}

export function getRandomClassNameColor(seed?: string): string {
  return companyThemeColorClassNames[
    getColorIndex(companyThemeColorClassNames.length, seed)
  ];
}

export function getRandomColor(seed?: string): string {
  const colors = Object.values(companyThemeColors);
  return colors[getColorIndex(colors.length, seed)];
}
