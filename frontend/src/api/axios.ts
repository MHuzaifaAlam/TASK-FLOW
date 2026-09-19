import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { tokenStore } from "../lib/tokenStore";

const baseURL = import.meta.env.VITE_API_BASE_URL || "/api";

export const api = axios.create({ baseURL });

// Attach the access token to every outgoing request.
api.interceptors.request.use((config) => {
  const token = tokenStore.getAccess();
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/**
 * Custom error thrown when the API throttles a request (HTTP 429),
 * so the UI can show a specific "slow down" message instead of a
 * generic failure.
 */
export class ThrottledError extends Error {
  retryAfterSeconds?: number;
  constructor(retryAfterSeconds?: number) {
    super("Too many requests");
    this.name = "ThrottledError";
    this.retryAfterSeconds = retryAfterSeconds;
  }
}

let isRefreshing = false;
let pendingQueue: Array<() => void> = [];

function onRefreshed() {
  pendingQueue.forEach((cb) => cb());
  pendingQueue = [];
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (status === 429) {
      const retryAfterHeader = error.response?.headers?.["retry-after"];
      const retryAfterSeconds = retryAfterHeader ? Number(retryAfterHeader) : undefined;
      return Promise.reject(new ThrottledError(retryAfterSeconds));
    }

    const isAuthEndpoint = originalRequest?.url?.includes("/token/");

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      const refresh = tokenStore.getRefresh();
      if (!refresh) {
        tokenStore.clear();
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      if (isRefreshing) {
        // Wait for the in-flight refresh to finish, then retry this request.
        return new Promise((resolve, reject) => {
          pendingQueue.push(() => {
            api(originalRequest).then(resolve).catch(reject);
          });
        });
      }

      isRefreshing = true;
      try {
        const { data } = await axios.post(`${baseURL}/token/refresh/`, { refresh });
        tokenStore.setAccess(data.access);
        isRefreshing = false;
        onRefreshed();
        return api(originalRequest);
      } catch (refreshError) {
        isRefreshing = false;
        pendingQueue = [];
        tokenStore.clear();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

/** Extracts DRF-style field errors ({ field: ["msg"] }) from a caught error. */
export function extractFieldErrors(err: unknown): Record<string, string[]> | null {
  if (axios.isAxiosError(err) && err.response?.data && typeof err.response.data === "object") {
    return err.response.data as Record<string, string[]>;
  }
  return null;
}

/** A human-readable fallback message for any API error. */
export function extractErrorMessage(err: unknown): string {
  if (err instanceof ThrottledError) {
    return err.retryAfterSeconds
      ? `You're doing that too often. Try again in ${err.retryAfterSeconds}s.`
      : "You're doing that too often. Please wait a moment and try again.";
  }
  if (axios.isAxiosError(err)) {
    const data = err.response?.data as Record<string, unknown> | undefined;
    if (data?.detail && typeof data.detail === "string") return data.detail;
    if (data && typeof data === "object") {
      const firstKey = Object.keys(data)[0];
      const value = firstKey ? data[firstKey] : undefined;
      if (Array.isArray(value) && typeof value[0] === "string") return value[0];
    }
    if (err.message === "Network Error") return "Can't reach the server. Check your connection.";
  }
  return "Something went wrong. Please try again.";
}
