import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getSession } from "next-auth/react";

export const API_BASE_URL       = process.env.NEXT_PUBLIC_API_BASE_URL       ?? "http://localhost:8000";
export const POLL_INTERVAL_MS   = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS   ?? 2000);
export const POLL_MAX_ATTEMPTS  = Number(process.env.NEXT_PUBLIC_POLL_MAX_ATTEMPTS  ?? 60);
export const POINTS_PER_QUERY   = Number(process.env.NEXT_PUBLIC_POINTS_PER_QUERY   ?? 10);
export const FREE_SIGNUP_POINTS = Number(process.env.NEXT_PUBLIC_FREE_SIGNUP_POINTS ?? 50);

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30_000,
  headers: { "Content-Type": "application/json", Accept: "application/json" },
});

// Attach NextAuth apiToken as Bearer on every request
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const session = await getSession();
      if (session?.apiToken && config.headers) {
        config.headers.Authorization = `Bearer ${session.apiToken}`;
      }
    }
    return config;
  },
  (err) => Promise.reject(err)
);

// Global 401 handler → NextAuth signOut
apiClient.interceptors.response.use(
  (res) => res,
  async (error: AxiosError<{ detail?: string; message?: string }>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      const { signOut } = await import("next-auth/react");
      await signOut({ callbackUrl: "/auth" });
    }
    const message =
      error.response?.data?.detail  ??
      error.response?.data?.message ??
      error.message                  ??
      "An unexpected error occurred";
    return Promise.reject(new Error(message));
  }
);

export type ApiResponse<T> = { data: T; message?: string; status: "success" | "error" };