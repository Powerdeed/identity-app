export const AUTH_URL =
  process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3001/login";

export const KEYCLOAK_URL =
  process.env.NEXT_PUBLIC_KEYCLOAK_URL || "http://localhost:8081";

export const KEYCLOAK_REALM =
  process.env.NEXT_PUBLIC_KEYCLOAK_REALM || "powerdeed";

export const KEYCLOAK_CLIENT_ID =
  process.env.NEXT_PUBLIC_KEYCLOAK_CLIENT_ID || "identity-app";

export const IDENTITY_API_BASE_URL =
  process.env.NEXT_PUBLIC_IDENTITY_API_BASE_URL?.trim();
