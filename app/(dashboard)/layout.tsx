"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import CommandPalette from "@/components/CommandPalette";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { PageLoader } from "@/components/Loader";
import { useAuthStore } from "@/store/useAuthStore";
import { useRefreshProfile } from "@/hooks/useAuth";

export default function DashboardGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isAuthenticated } = useAuthStore();
  const router = useRouter();

  // Silently refresh user profile + points on mount
  useRefreshProfile();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/auth");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return <PageLoader />;

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />
      <Navbar />
      <Sidebar />
      <main className="relative pt-14 lg:pl-56 min-h-[calc(100vh-3.5rem)]">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <MobileNav />
      <CommandPalette />
    </div>
  );
}
