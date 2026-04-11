"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { CreditCard, History, LayoutDashboard, LogOut, Settings, Sparkles, User, X, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLogout } from "@/hooks/useAuth";
import { useSession } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/history",   icon: History,         label: "History"   },
  { href: "/pricing",   icon: CreditCard,       label: "Points"    },
  { href: "/settings",  icon: Settings,         label: "Settings"  },
  { href: "/profile",   icon: User,             label: "Profile"   },
];

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileNav({ open, onClose }: MobileNavProps) {
  const pathname = usePathname();
  const router   = useRouter();
  const { data: session } = useSession();
  const handleLogout = useLogout();

  const points = session?.points ?? 0;
  const user   = session?.user;

  const pointsColor = points > 30 ? "text-emerald-400" : points > 10 ? "text-amber-400" : "text-rose-400";
  const pointsBg    = points > 30
    ? "bg-emerald-500/10 border-emerald-500/30"
    : points > 10
    ? "bg-amber-500/10 border-amber-500/30"
    : "bg-rose-500/10 border-rose-500/30";

  const onLogout = async () => {
    onClose();
    await handleLogout();
    router.push("/");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={cn(
          "lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      />

      {/* Drawer */}
      <aside
        className={cn(
          "lg:hidden fixed top-0 left-0 bottom-0 z-50 w-72 flex flex-col",
          "bg-[#0a0a0f] border-r border-white/10",
          "transition-transform duration-300 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-400 to-violet-500 shadow-lg shadow-cyan-500/25">
              <Zap className="w-4 h-4 text-black" strokeWidth={2.5} />
            </div>
            <span className="text-sm font-bold tracking-tight bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">
              CryptoAI Insights
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex items-center justify-center w-8 h-8 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User info */}
        <div className="px-5 py-4 border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-sm font-bold text-black shadow-md shrink-0">
              {user?.name?.charAt(0)?.toUpperCase() ?? "U"}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name ?? "User"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email ?? ""}</p>
            </div>
          </div>
          <div className={cn(
            "inline-flex items-center gap-2 mt-3 px-3 py-1.5 rounded-xl border text-xs font-semibold",
            pointsBg
          )}>
            <Sparkles className={cn("w-3.5 h-3.5", pointsColor)} />
            <span className={pointsColor}>{points} points</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 overflow-y-auto py-3 px-3">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 mb-0.5",
                  active ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <Icon className={cn("w-4 h-4 shrink-0 transition-colors", active ? "text-cyan-400" : "text-current")} />
                {label}
                {active && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,212,255,0.8)]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-3 py-4 border-t border-white/10 shrink-0">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}