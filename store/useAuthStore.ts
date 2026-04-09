
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface PointsState {
  points: number;
  setPoints:     (p: number)      => void;
  deductPoints:  (amount: number) => void;
  addPoints:     (amount: number) => void;
  reset:         ()               => void;
}

export const usePointsStore = create<PointsState>()(
  persist(
    (set, get) => ({
      points: 0,
      setPoints:    (p)      => set({ points: p }),
      deductPoints: (amount) => set({ points: Math.max(0, get().points - amount) }),
      addPoints:    (amount) => set({ points: get().points + amount }),
      reset:        ()       => set({ points: 0 }),
    }),
    {
      name: "points-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
    }
  )
);

// Backwards-compat alias — existing components that do useAuthStore().points still work
export const useAuthStore = usePointsStore;