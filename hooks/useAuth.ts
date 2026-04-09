"use client";

import { useSession, signOut } from "next-auth/react";
import { useCallback } from "react";
import { authService } from "@/services/auth.service";

// ── Types ─────────────────────────────────────────────────────────────────────

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  createdAt?: string;
}

// ── Primary hook: everything in one place ─────────────────────────────────────

/**
 * useAuthUser — the single hook every component needs.
 *
 * Returns user, points, apiToken all from the NextAuth session.
 * Points are updated via session.update({ points: X }) which patches
 * the JWT cookie in-memory — instant, no Zustand, no extra provider.
 */
export function useAuthUser() {
  const { data: session, status, update } = useSession();

  const isLoading       = status === "loading";
  const isAuthenticated = status === "authenticated";

  const user: AuthUser | null = session
    ? {
        id:        session.user.id,
        name:      session.user.name  ?? "",
        email:     session.user.email ?? "",
        image:     session.user.image,
        createdAt: session.user.createdAt,
      }
    : null;

  const points   = session?.points   ?? 0;
  const apiToken = session?.apiToken ?? null;

  /**
   * Instantly subtract points in the session cookie.
   * Used by useAnalyze when a query is submitted.
   */
  const deductPoints = useCallback(
    (amount: number) => {
      const current = session?.points ?? 0;
      update({ points: Math.max(0, current - amount) });
    },
    [session?.points, update]
  );

  /**
   * Add points — used after a successful payment.
   */
  const addPoints = useCallback(
    (amount: number) => {
      const current = session?.points ?? 0;
      update({ points: current + amount });
    },
    [session?.points, update]
  );

  /**
   * Hard-set points — used after fetching profile from FastAPI.
   */
  const setPoints = useCallback(
    (amount: number) => {
      update({ points: amount });
    },
    [update]
  );

  return {
    user,
    points,
    apiToken,
    isLoading,
    isAuthenticated,
    deductPoints,
    addPoints,
    setPoints,
  };
}

// ── Profile refresh ───────────────────────────────────────────────────────────

/**
 * Silently re-fetches profile from FastAPI on mount and syncs points
 * into the session. Use this once in the dashboard layout.
 */
export function useRefreshProfile() {
  const { isAuthenticated, setPoints } = useAuthUser();

  // Called once when the dashboard layout mounts
  const refresh = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      const data = await authService.getProfile();
      setPoints(data.points);
    } catch {
      // Silently ignore — user keeps cached session data
    }
  }, [isAuthenticated, setPoints]);

  return { refresh };
}

// ── Logout ────────────────────────────────────────────────────────────────────

/**
 * Calls FastAPI logout (to invalidate server-side token),
 * then calls NextAuth signOut (clears the session cookie + redirects).
 */
export function useLogout() {
  return useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Ignore server errors
    }
    await signOut({ callbackUrl: "/" });
  }, []);
}

// ── Backwards-compat shims ────────────────────────────────────────────────────

/**
 * No-op: NextAuth manages its own cookies.
 * Kept so existing imports of useSyncAuthCookie don't break.
 */
export function useSyncAuthCookie() {}

/**
 * Old components that used useAuthStore() now get a session-backed version.
 */
export function useAuthStore() {
  const { points, setPoints, deductPoints, addPoints, isAuthenticated, user } =
    useAuthUser();
  return {
    points,
    setPoints,
    deductPoints,
    addPoints,
    isAuthenticated,
    user,
    // Legacy fields that old code might read
    token: null,                    // not exposed; use apiToken from useAuthUser
    logout: useLogout(),
  };
}