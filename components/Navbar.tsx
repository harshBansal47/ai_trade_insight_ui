"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  BarChart3, ChevronDown, CreditCard, History,
  LayoutDashboard, LogOut, Settings, Sparkles, User, Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { useLogout } from "@/hooks/useAuth";
import NotificationBell from "./NotificationBell";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history",   label: "History",   icon: History },
  { href: "/pricing",   label: "Points",    icon: CreditCard },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, points } = useAuthStore();
  const handleLogout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = async () => { await handleLogout(); router.push("/"); };

  const pointsColor = points > 30 ? "text-green-400" : points > 10 ? "text-yellow-400" : "text-red-400";
  const pointsBorder = points > 30
    ? "border-green-400/20 bg-green-400/5 hover:bg-green-400/10"
    : points > 10
    ? "border-yellow-400/20 bg-yellow-400/5 hover:bg-yellow-400/10"
    : "border-red-400/20 bg-red-400/5 hover:bg-red-400/10";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-14 border-b border-white/[0.06] bg-[hsl(220_20%_6%/0.88)] backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-4 lg:px-6">
        <Link href="/dashboard" className="flex items-center gap-2.5 shrink-0">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 to-violet-500 shadow-[0_0_12px_rgba(0,212,255,0.4)]">
            <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-sm font-bold tracking-tight hidden sm:block" style={{ fontFamily: "var(--font-display)" }}>
            CryptoAI <span className="gradient-text">Insights</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href}
              className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200",
                pathname === href ? "bg-white/[0.08] text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]")}>
              <Icon className="w-3.5 h-3.5" />{label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link href="/pricing" className={cn("hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:scale-105", pointsBorder)}>
            <Sparkles className={cn("w-3 h-3", pointsColor)} />
            <span className={pointsColor}>{points}</span>
            <span className="text-muted-foreground text-[10px]">pts</span>
          </Link>

          <NotificationBell />

          <div className="relative">
            <button onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/[0.06] transition-all">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-[10px] font-bold text-black shrink-0">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <span className="hidden lg:block text-xs text-muted-foreground max-w-[72px] truncate">{user?.name ?? "User"}</span>
              <ChevronDown className={cn("hidden lg:block w-3 h-3 text-muted-foreground transition-transform duration-200", menuOpen && "rotate-180")} />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1.5 w-52 glass rounded-xl border border-white/[0.08] shadow-2xl z-50 overflow-hidden animate-fade-in">
                  <div className="px-3 py-3 border-b border-white/[0.06]">
                    <p className="text-xs font-semibold text-foreground truncate">{user?.name}</p>
                    <p className="text-[10px] text-muted-foreground truncate mt-0.5">{user?.email}</p>
                    <div className="flex items-center gap-1 mt-2">
                      <Sparkles className={cn("w-3 h-3", pointsColor)} />
                      <span className={cn("text-[10px] font-semibold", pointsColor)}>{points} pts</span>
                    </div>
                  </div>
                  <div className="py-1.5">
                    {[
                      { icon: User,       label: "Profile",          href: "/profile"   },
                      { icon: BarChart3,  label: "Dashboard",        href: "/dashboard" },
                      { icon: History,    label: "History",          href: "/history"   },
                      { icon: CreditCard, label: "Points & Billing", href: "/pricing"   },
                      { icon: Settings,   label: "Settings",         href: "/settings"  },
                    ].map(({ icon: Icon, label, href }) => (
                      <Link key={href} href={href} onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:bg-white/[0.04] transition-colors">
                        <Icon className="w-3.5 h-3.5" />{label}
                      </Link>
                    ))}
                  </div>
                  <div className="border-t border-white/[0.06] py-1.5">
                    <button onClick={onLogout}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs text-red-400 hover:bg-red-400/5 transition-colors">
                      <LogOut className="w-3.5 h-3.5" />Sign out
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
