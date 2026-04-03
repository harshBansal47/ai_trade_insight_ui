import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { TaskStatusResponse, TradingMode } from "@/services/task.service";
import type { Coin } from "@/components/CoinSelector";

// ── Types ────────────────────────────────────────────────────────────────────

interface AnalysisSession {
  taskId: string | null;
  coin: Coin | null;
  mode: TradingMode | null;
  message: string;
  result: TaskStatusResponse | null;
  startedAt: string | null;
}

interface TaskState {
  // Current session
  session: AnalysisSession;

  // Recent task IDs (for quick access)
  recentTaskIds: string[];

  // Preferred coin/mode (remembered between sessions)
  lastUsedCoin: Coin | null;
  lastUsedMode: TradingMode | null;

  // Actions
  startSession: (taskId: string, coin: Coin, mode: TradingMode, message?: string) => void;
  setResult: (result: TaskStatusResponse) => void;
  resetSession: () => void;
  setLastUsed: (coin: Coin | null, mode: TradingMode | null) => void;
  clearRecent: () => void;
}

const EMPTY_SESSION: AnalysisSession = {
  taskId:    null,
  coin:      null,
  mode:      null,
  message:   "",
  result:    null,
  startedAt: null,
};

// ── Store ────────────────────────────────────────────────────────────────────

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      session:      EMPTY_SESSION,
      recentTaskIds: [],
      lastUsedCoin: null,
      lastUsedMode: null,

      startSession: (taskId, coin, mode, message = "") => {
        const ids = [taskId, ...get().recentTaskIds.filter((id) => id !== taskId)].slice(0, 20);
        set({
          session: {
            taskId,
            coin,
            mode,
            message,
            result:    null,
            startedAt: new Date().toISOString(),
          },
          recentTaskIds: ids,
          lastUsedCoin:  coin,
          lastUsedMode:  mode,
        });
      },

      setResult: (result) =>
        set((state) => ({
          session: { ...state.session, result },
        })),

      resetSession: () =>
        set({ session: EMPTY_SESSION }),

      setLastUsed: (coin, mode) =>
        set({ lastUsedCoin: coin, lastUsedMode: mode }),

      clearRecent: () =>
        set({ recentTaskIds: [] }),
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() =>
        typeof window !== "undefined" ? localStorage : ({} as Storage)
      ),
      partialize: (state) => ({
        recentTaskIds: state.recentTaskIds,
        lastUsedCoin:  state.lastUsedCoin,
        lastUsedMode:  state.lastUsedMode,
        // Don't persist the active session — polling state is transient
      }),
    }
  )
);
