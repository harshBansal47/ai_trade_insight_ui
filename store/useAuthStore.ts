import { create } from "zustand";
import { useEffect } from "react";
import { useSession } from "next-auth/react";


interface PointsState {
  points:       number;
  setPoints:    (p: number)      => void;
  deductPoints: (amount: number) => void;
  addPoints:    (amount: number) => void;
  reset:        ()               => void;
}

export const usePointsStore = create<PointsState>()((set, get) => ({
  points:       0,
  setPoints:    (p)      => set({ points: p }),
  deductPoints: (amount) => set({ points: Math.max(0, get().points - amount) }),
  addPoints:    (amount) => set({ points: get().points + amount }),
  reset:        ()       => set({ points: 0 }),
}));

// Backwards-compat alias
export const useAuthStore = usePointsStore;

/* ─────────────────────────────────────────────────────────────
   usePointsSync — call this ONCE in your root layout or
   top-level provider. It watches the session and keeps the
   store seeded with the latest server-side points value.

   Usage (e.g. app/layout.tsx or providers.tsx):
     function Providers({ children }) {
       usePointsSync();
       return <>{children}</>;
     }
───────────────────────────────────────────────────────────── */
export function usePointsSync() {
  const { data: session, status } = useSession();
  const setPoints = usePointsStore((s) => s.setPoints);

  useEffect(() => {
    if (status === "authenticated") {
      // Expects session.user.points to exist.
      // Extend next-auth types if needed (see bottom of this file).
      const serverPoints = session?.points;
      if (typeof serverPoints === "number") {
        setPoints(serverPoints);
      }

      console.log("Session authenticated. Synced points from session:", serverPoints);
    }

    if (status === "unauthenticated") {
      setPoints(0);
    }
  }, [status, session?.user, setPoints]);
}