"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import type { ReactNode } from "react";
import type { Session } from "next-auth";

/**
 * Thin wrapper that makes next-auth's useSession() available
 * throughout the React tree. Must be a client component.
 */
export default function SessionProvider({
  children,
  session,
}: {
  children: ReactNode;
  session?: Session | null;
}) {
  return (
    <NextAuthSessionProvider
      session={session}
      // Re-fetch session silently every 5 minutes to keep token fresh
      refetchInterval={5 * 60}
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
}