import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// ── Types ────────────────────────────────────────────────────────────────────

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  points: number;
  isAuthenticated: boolean;

  // Actions
  setUser: (user: User) => void;
  setToken: (token: string) => void;
  setPoints: (points: number) => void;
  deductPoints: (amount: number) => void;
  addPoints: (amount: number) => void;
  login: (user: User, token: string, points?: number) => void;
  logout: () => void;
  updateUser: (partial: Partial<User>) => void;
}

// ── Store ────────────────────────────────────────────────────────────────────

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      points: 0,
      isAuthenticated: false,

      setUser: (user) => set({ user, isAuthenticated: true }),

      setToken: (token) => set({ token }),

      setPoints: (points) => set({ points }),

      deductPoints: (amount) => {
        const current = get().points;
        set({ points: Math.max(0, current - amount) });
      },

      addPoints: (amount) => {
        const current = get().points;
        set({ points: current + amount });
      },

      login: (user, token, points = 0) =>
        set({ user, token, points, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, points: 0, isAuthenticated: false }),

      updateUser: (partial) => {
        const current = get().user;
        if (current) {
          set({ user: { ...current, ...partial } });
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        points: state.points,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
