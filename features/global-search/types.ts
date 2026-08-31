export type GlobalSearchResultType =
  | "employee"
  | "session"
  | "department"
  | "job-profile"
  | "team"
  | "location"
  | "role"
  | "permission"
  | "group"
  | "access-review"
  | "security-event";

export type GlobalSearchResult = {
  id: string;
  type: GlobalSearchResultType;
  title: string;
  subtitle: string;
  href: string;
};

export type GlobalSearchGroup = {
  type: GlobalSearchResultType;
  label: string;
  results: GlobalSearchResult[];
};

export type GlobalSearchResponse = {
  query: string;
  groups: GlobalSearchGroup[];
  total: number;
};
