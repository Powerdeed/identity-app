import { AUTH_URL } from "@env";
import { getDefaultReturnTo } from "./returnTo";

export const CLIENT = "identity";

export const getAuthRedirect = () =>
  `${AUTH_URL}?client=${CLIENT}&returnTo=${encodeURIComponent(getDefaultReturnTo())}`;
