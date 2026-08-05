import { getAuthRedirect } from "@app/auth";
import axios from "axios";

const getApiBaseUrl = () => {
  const baseUrl = process.env.NEXT_PUBLIC_CMS_API_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_CMS_API_BASE_URL is required.");
  }

  try {
    return new URL(baseUrl).origin;
  } catch {
    throw new Error("NEXT_PUBLIC_CMS_API_BASE_URL must be a valid URL.");
  }
};

export const api = axios.create({
  baseURL: `${getApiBaseUrl()}/api/v1`,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  async (err) => {
    if (typeof window !== "undefined" && err.response?.status === 401) {
      window.location.href = getAuthRedirect();
    }

    return Promise.reject(err);
  },
);

api.interceptors.request.use((config) => {
  if (
    typeof FormData !== "undefined" &&
    config.data instanceof FormData &&
    config.headers
  ) {
    delete config.headers["Content-Type"];
    delete config.headers["content-type"];
  }

  return config;
});
