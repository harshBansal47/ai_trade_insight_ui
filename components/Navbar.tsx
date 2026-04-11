"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  CreditCard, History, LayoutDashboard,
  LogOut, Settings, Sparkles, User, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useAuth";
import NotificationBell from "./NotificationBell";
import MobileNav from "./MobileNav";
import { useSession } from "next-auth/react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history",   label: "History",   icon: History },
  { href: "/pricing",   label: "Points",    icon: CreditCard },
];

// Animated two-line mark — morphs into × when open
function MenuMark({ open }: { open: boolean }) {
  return (
    <div className="flex flex-col justify-center items-start w-5 h-5 gap-[5px]">
      <span className={cn(
        "block h-[1.5px] bg-current rounded-full transition-all duration-300 origin-left",
        open ? "w-5 rotate-[40deg] translate-x-[1px]" : "w-5"
      )} />
      <span className={cn(
        "block h-[1.5px] bg-current rounded-full transition-all duration-300 origin-left",
        open ? "w-5 -rotate-[40deg] translate-x-[1px]" : "w-3"
      )} />
    </div>
  );
}

export default function Navbar() {
  const pathname = usePathname();
  const router   = useRouter();
  const { data: session } = useSession();
  const points   = session?.points ?? 0;
  const user     = session?.user;
  const handleLogout = useLogout();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen,  setSidebarOpen]  = useState(false);

  const onLogout = async () => {
    setDropdownOpen(false);
    await handleLogout();
    router.push("/");
  };

  const pointsColor  = points > 30 ? "text-emerald-400" : points > 10 ? "text-amber-400" : "text-rose-400";
  const pointsBorder = points > 30
    ? "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15"
    : points > 10
    ? "border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15"
    : "border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/15";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl">
        <div className="flex h-full items-center justify-between px-4 lg:px-8">

          {/* ── Mobile menu trigger ── */}
          <button
            onClick={() => setSidebarOpen(v => !v)}
            aria-label="Toggle menu"
            className={cn(
              "lg:hidden relative flex items-center justify-center w-9 h-9 rounded-xl transition-all duration-200",
              "border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
            )}
          >
            <MenuMark open={sidebarOpen} />
          </button>

          {/* ── Logo ── */}
          <Link href="/dashboard" className="flex items-center gap-3 shrink-0 group">
            <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/25 transition-transform group-hover:scale-105">
              <Zap className="w-5 h-5 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold tracking-tight hidden sm:block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              CryptoAI Insights
            </span>
          </Link>

          {/* ── Desktop nav ── */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                  pathname === href
                    ? "bg-white/10 text-white shadow-sm"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className="w-4 h-4" />
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Right section ── */}
          <div className="flex items-center gap-2">
            {/* Points badge — desktop */}
            <Link
              href="/pricing"
              className={cn(
                "hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all hover:scale-105",
                pointsBorder
              )}
            >
              <Sparkles className={cn("w-4 h-4", pointsColor)} />
              <span className={pointsColor}>{points}</span>
              <span className="text-gray-400 text-xs">pts</span>
            </Link>

            <NotificationBell />

            {/* ── User avatar ── */}
            <div className="relative">

              {/* Mobile: tapping avatar also opens sidebar */}
              <button
                onClick={() => setSidebarOpen(v => !v)}
                className="lg:hidden w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold text-black shadow-md ring-2 ring-transparent hover:ring-white/20 transition-all"
              >
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </button>

              {/* Desktop: slim pill — first name + dot indicator */}
              <button
                onClick={() => setDropdownOpen(v => !v)}
                className="hidden lg:flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full hover:bg-white/5 transition-all duration-200 group"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold text-black shadow-md">
                  {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
                </div>
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  {user?.name?.split(" ")[0] ?? "User"}
                </span>
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full transition-all duration-200",
                  dropdownOpen
                    ? "bg-cyan-400 shadow-[0_0_5px_rgba(0,212,255,0.8)]"
                    : "bg-gray-600"
                )} />
              </button>

              {/* ── Desktop dropdown — account actions only, no nav repetition ── */}
              {dropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-48 bg-[#0d0d14]/95 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="py-1.5">
                      <Link
                        href="/profile"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <User className="w-4 h-4 text-gray-500" />
                        Your profile
                      </Link>
                      <Link
                        href="/settings"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-gray-500" />
                        Settings
                      </Link>
                    </div>
                    <div className="border-t border-white/10 py-1.5">
                      <button
                        onClick={onLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-rose-400 hover:bg-rose-500/10 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <MobileNav open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
    </>
  );
}