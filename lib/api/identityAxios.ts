import axios from "axios";
import { IDENTITY_API_BASE_URL } from "@env";

const getIdentityApiBaseUrl = () => {
  const baseUrl = IDENTITY_API_BASE_URL;

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_IDENTITY_API_BASE_URL is required.");
  }

  try {
    return new URL(baseUrl).origin;
  } catch {
    throw new Error("NEXT_PUBLIC_IDENTITY_API_BASE_URL must be a valid URL.");
  }
};

export const identityApi = axios.create({
  baseURL: `${getIdentityApiBaseUrl()}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

