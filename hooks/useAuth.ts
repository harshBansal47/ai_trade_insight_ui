"use client";

import { useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { authService } from "@/services/auth.service";
import { useAuthStore } from "@/store/useAuthStore";

/**
 * Silently refreshes the user profile and points from the server on mount.
 * Only runs when the user is authenticated.
 */
export function useRefreshProfile() {
  const { isAuthenticated, setPoints, updateUser, token } = useAuthStore();

  useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const data = await authService.getProfile();
      setPoints(data.points);
      updateUser(data.user);
      return data;
    },
    enabled: isAuthenticated && !!token,
    staleTime: 1000 * 60 * 5, // Refetch every 5 minutes
    retry: false,
  });
}

/**
 * Sync auth token to cookie (for middleware) whenever it changes.
 */
export function useSyncAuthCookie() {
  const { token, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && token) {
      document.cookie = `auth-token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
    } else {
      document.cookie = "auth-token=; path=/; max-age=0";
    }
  }, [token, isAuthenticated]);
}

/**
 * Returns a logout handler that clears auth state + cookie.
 */
export function useLogout() {
  const { logout } = useAuthStore();

  return useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // ignore server errors
    } finally {
      logout();
      document.cookie = "auth-token=; path=/; max-age=0";
    }
  }, [logout]);
}
