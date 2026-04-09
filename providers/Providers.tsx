"use client";

import { type ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import QueryProvider from "./QueryProvider";
import { useSyncAuthCookie } from "@/hooks/useAuth";
import SessionProvider from "./SessionProvider";

/**
 * Inner component so hooks can run inside QueryProvider
 */
function InnerProviders({ children }: { children: ReactNode }) {
  // Sync auth token to cookie whenever store changes
  useSyncAuthCookie();
  return <>{children}</>;
}

/**
 * Wraps the whole app in all required providers.
 * Import this in app/layout.tsx.
 */
export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
    <QueryProvider>
      <TooltipProvider delayDuration={300}>
        <InnerProviders>{children}</InnerProviders>
      </TooltipProvider>
    </QueryProvider>
    </SessionProvider>
  );
}