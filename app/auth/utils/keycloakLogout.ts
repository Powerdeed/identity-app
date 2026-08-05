import { KEYCLOAK_CLIENT_ID, KEYCLOAK_REALM, KEYCLOAK_URL } from "@env";

export const buildKeycloakLogoutUrl = () => {
  const logoutUrl = new URL(
    `${KEYCLOAK_URL}/realms/${KEYCLOAK_REALM}/protocol/openid-connect/logout`,
  );

  logoutUrl.searchParams.set("client_id", KEYCLOAK_CLIENT_ID);
  logoutUrl.searchParams.set("post_logout_redirect_uri", window.location.origin);

  return logoutUrl.toString();
};
