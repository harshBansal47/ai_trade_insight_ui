"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  History,
  HelpCircle,
  LayoutDashboard,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_ITEMS = [
  {
    group: "Main",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/history", icon: History, label: "History" },
    ],
  },
  {
    group: "Account",
    items: [
      { href: "/pricing", icon: CreditCard, label: "Points & Plans" },
      { href: "/settings", icon: HelpCircle, label: "Help & Support" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { points } = useAuthStore();

  const pointsPercent = Math.min((points / 50) * 100, 100);
  const pointsColor =
    points > 30 ? "#22c55e" : points > 10 ? "#eab308" : "#ef4444";

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-14 bottom-0 w-56 border-r border-white/[0.06] bg-[hsl(220_20%_6%)] z-30">
      <div className="flex-1 overflow-y-auto py-4 px-3">
        {NAV_ITEMS.map((group) => (
          <div key={group.group} className="mb-5">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50 px-2 mb-2">
              {group.group}
            </p>
            <ul className="space-y-0.5">
              {group.items.map(({ href, icon: Icon, label }) => {
                const active = pathname === href;
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150",
                        active
                          ? "bg-white/[0.07] text-foreground font-medium"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                      )}
                    >
                      <Icon
                        className={cn(
                          "w-4 h-4 shrink-0",
                          active ? "text-cyan-400" : "text-current"
                        )}
                      />
                      {label}
                      {active && (
                        <div className="ml-auto w-1 h-4 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,212,255,0.6)]" />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Points Widget ──────────────────────────────────── */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="glass rounded-xl p-3.5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span className="text-xs font-medium text-foreground">
                {points} points
              </span>
            </div>
            <Link
              href="/pricing"
              className="text-[10px] text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
            >
              Buy more →
            </Link>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pointsPercent}%`,
                  background: `linear-gradient(90deg, ${pointsColor}88, ${pointsColor})`,
                  boxShadow: `0 0 8px ${pointsColor}44`,
                }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground">
              {Math.floor(points / 10)} analyses remaining
            </p>
          </div>

          {/* Stat row */}
          <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <Zap className="w-3 h-3 text-orange-400" />
              10 pts / query
            </div>
            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
              <TrendingUp className="w-3 h-3 text-green-400" />
              50 pts = $5
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
