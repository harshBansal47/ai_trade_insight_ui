"use client";

import { type ReactNode } from "react";
import QueryProvider from "./QueryProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useSyncAuthCookie } from "@/hooks/useAuth";


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
    <QueryProvider>
      <TooltipProvider delayDuration={300}>
        <InnerProviders>{children}</InnerProviders>
      </TooltipProvider>
    </QueryProvider>
  );
}
