import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

// ── Config ───────────────────────────────────────────────────────────────────

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

export const POLL_INTERVAL_MS = Number(
  process.env.NEXT_PUBLIC_POLL_INTERVAL_MS || 2000
);
export const POLL_MAX_ATTEMPTS = Number(
  process.env.NEXT_PUBLIC_POLL_MAX_ATTEMPTS || 60
);

export const POINTS_PER_QUERY = Number(
  process.env.NEXT_PUBLIC_POINTS_PER_QUERY || 10
);
export const FREE_SIGNUP_POINTS = Number(
  process.env.NEXT_PUBLIC_FREE_SIGNUP_POINTS || 50
);

// ── Axios instance ───────────────────────────────────────────────────────────

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ── Request interceptor: attach auth token ───────────────────────────────────

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("auth-storage");
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          const token: string | null = parsed?.state?.token ?? null;
          if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch {
          // ignore
        }
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: global error handling ──────────────────────────────

apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ detail?: string; message?: string }>) => {
    if (error.response?.status === 401) {
      // Clear auth state and redirect
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth-storage");
        window.location.href = "/auth";
      }
    }
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

// ── Type helpers ─────────────────────────────────────────────────────────────

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status: "success" | "error";
};
