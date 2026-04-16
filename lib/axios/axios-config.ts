import axios, { type AxiosError, type AxiosRequestConfig } from "axios";

import type { RefreshTokenResponseInterface } from "@/domain/interfaces";
import { clearAuthSession, refreshAuthSession } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import { AUTH_ROUTES } from "@/shared/constants";
import { isValidAccessToken } from "@/shared/utils";

const API_URL_BACKEND = process.env.NEXT_PUBLIC_API_URL_BACKEND;

const axiosInstance = axios.create({
  baseURL: API_URL_BACKEND,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window === "undefined") {
      return config;
    }

    const token = useAuthStore.getState().session?.token;

    if (isValidAccessToken(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let refreshSessionPromise: Promise<RefreshTokenResponseInterface> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (typeof window === "undefined") {
      return Promise.reject(normalizeBackendError(error));
    }

    const axiosError = error as AxiosError;
    const originalRequest = axiosError.config as
      | (AxiosRequestConfig & { _retry?: boolean })
      | undefined;
    const requestUrl = String(originalRequest?.url ?? "");
    const isAuthRequest =
      requestUrl.includes("/login") ||
      requestUrl.includes("/register") ||
      requestUrl.includes("/refresh");

    if (
      axiosError.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthRequest
    ) {
      originalRequest._retry = true;

      try {
        refreshSessionPromise ??= refreshAuthSession();
        const refreshResponse = await refreshSessionPromise;
        useAuthStore.getState().setSession(refreshResponse.data);

        originalRequest.headers = originalRequest.headers ?? {};
        originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.token}`;

        return axiosInstance(originalRequest);
      } catch {
        useAuthStore.getState().clearSession();
        await clearAuthSession();
        window.location.href = AUTH_ROUTES.login;
      } finally {
        refreshSessionPromise = null;
      }
    }

    return Promise.reject(normalizeBackendError(error));
  },
);

function normalizeBackendError(error: unknown) {
  const axiosError = error as AxiosError<{
    message?: string;
    error?: string;
    rule_code?: string;
  }>;
  const responseData = axiosError.response?.data;
  const backendMessage =
    responseData?.message ||
    responseData?.error ||
    "No se pudo completar la solicitud.";

  return {
    ...responseData,
    status: axiosError.response?.status,
    message: backendMessage,
    rule_code: responseData?.rule_code,
    retryAfter: axiosError.response?.headers?.["retry-after"],
  };
}

export default axiosInstance;
