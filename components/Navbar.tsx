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
import { useSession } from "next-auth/react";

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/history",   label: "History",   icon: History },
  { href: "/pricing",   label: "Points",    icon: CreditCard },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const points = session?.points ?? 0;
  const user = session?.user;
  const handleLogout = useLogout();
  const [menuOpen, setMenuOpen] = useState(false);

  const onLogout = async () => { await handleLogout(); router.push("/"); };

  const pointsColor = points > 30 ? "text-emerald-400" : points > 10 ? "text-amber-400" : "text-rose-400";
  const pointsBorder = points > 30
    ? "border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/15"
    : points > 10
    ? "border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/15"
    : "border-rose-500/30 bg-rose-500/10 hover:bg-rose-500/15";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/10 bg-black/80 backdrop-blur-xl">
      <div className="flex h-full items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-3 shrink-0 group">
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/25 transition-transform group-hover:scale-105">
            <Zap className="w-5 h-5 text-black" strokeWidth={2.5} />
          </div>
          <span className="text-base font-bold tracking-tight hidden sm:block bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
            CryptoAI Insights
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-1">
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

        {/* Right section */}
        <div className="flex items-center gap-3">
          {/* Points Badge */}
          <Link 
            href="/pricing" 
            className={cn(
              "hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-semibold transition-all hover:scale-105",
              pointsBorder
            )}
          >
            <Sparkles className={cn("w-4 h-4", pointsColor)} />
            <span className={pointsColor}>{points}</span>
            <span className="text-gray-400 text-xs">points</span>
          </Link>

          <NotificationBell />

          {/* User Menu */}
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 transition-all duration-200"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold text-black shadow-md">
                {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-white">{user?.name ?? "User"}</p>
                <p className="text-xs text-gray-400">{user?.email?.split('@')[0] ?? ""}</p>
              </div>
              <ChevronDown className={cn(
                "hidden lg:block w-4 h-4 text-gray-400 transition-transform duration-200",
                menuOpen && "rotate-180"
              )} />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-2 w-64 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                  {/* User Info Section */}
                  <div className="px-4 py-3 border-b border-white/10 bg-white/5">
                    <p className="text-sm font-semibold text-white">{user?.name}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-3 pt-1">
                      <div className={cn("flex items-center gap-1.5 px-2 py-1 rounded-lg", pointsBorder.replace('hover:', ''))}>
                        <Sparkles className={cn("w-3.5 h-3.5", pointsColor)} />
                        <span className={cn("text-sm font-semibold", pointsColor)}>{points}</span>
                        <span className="text-gray-400 text-xs">points</span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Menu Items */}
                  <div className="py-2">
                    {[
                      { icon: User, label: "Profile", href: "/profile", color: "text-white" },
                      { icon: BarChart3, label: "Dashboard", href: "/dashboard", color: "text-white" },
                      { icon: History, label: "History", href: "/history", color: "text-white" },
                      { icon: CreditCard, label: "Points & Billing", href: "/pricing", color: "text-white" },
                      { icon: Settings, label: "Settings", href: "/settings", color: "text-white" },
                    ].map(({ icon: Icon, label, href, color }) => (
                      <Link 
                        key={href} 
                        href={href} 
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Icon className="w-4 h-4 text-gray-400" />
                        {label}
                      </Link>
                    ))}
                  </div>
                  
                  {/* Logout Button */}
                  <div className="border-t border-white/10 py-2">
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
  );
}