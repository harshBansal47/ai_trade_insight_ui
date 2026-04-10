"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  History,
  HelpCircle,
  LayoutDashboard,
  Sparkles,
  Zap,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";

const NAV_ITEMS = [
  {
    group: "Main",
    items: [
      { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
      { href: "/history",   icon: History,         label: "History"   },
    ],
  },
  {
    group: "Account",
    items: [
      { href: "/pricing",  icon: CreditCard, label: "Points & Plans" },
      { href: "/settings", icon: HelpCircle, label: "Help & Support"  },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { points } = useAuthStore();

  const analysesLeft  = Math.floor(points / 10);
  const pointsPercent = Math.min((points / 150) * 100, 100);
  const barColor      = points > 60 ? "#34d399" : points > 20 ? "#fbbf24" : "#f87171";

  return (
    <aside className="hidden lg:flex flex-col fixed left-0 top-14 bottom-0 w-60 border-r border-white/[0.06] z-30"
      style={{ backgroundColor: "hsl(var(--background))" }}
    >
      {/* ── Nav ── */}
      <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
        {NAV_ITEMS.map((group) => (
          <div key={group.group}>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 px-3 mb-2">
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
                        "relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group",
                        active
                          ? "bg-white/[0.07] text-foreground"
                          : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                      )}
                    >
                      {/* Active left bar */}
                      {active && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(0,212,255,0.7)]" />
                      )}

                      <div className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                        active
                          ? "bg-cyan-400/15"
                          : "bg-white/[0.04] group-hover:bg-white/[0.07]"
                      )}>
                        <Icon className={cn(
                          "w-3.5 h-3.5",
                          active ? "text-cyan-400" : "text-muted-foreground group-hover:text-foreground"
                        )} />
                      </div>

                      {label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* ── Points widget ── */}
      <div className="p-3 border-t border-white/[0.06]">
        <div className="rounded-2xl border border-white/[0.08] overflow-hidden"
          style={{ background: "hsl(var(--background))" }}
        >
          {/* Header row */}
          <div className="flex items-center justify-between px-4 pt-4 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground leading-none">{points}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">points left</p>
              </div>
            </div>
            <Link
              href="/pricing"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-400/10 border border-cyan-400/20 text-[11px] font-semibold text-cyan-400 hover:bg-cyan-400/15 transition-colors"
            >
              <Plus className="w-3 h-3" />
              Top up
            </Link>
          </div>

          {/* Progress bar */}
          <div className="px-4 pb-3 space-y-1.5">
            <div className="h-1.5 rounded-full bg-white/[0.06] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${pointsPercent}%`,
                  background: `linear-gradient(90deg, ${barColor}99, ${barColor})`,
                  boxShadow: `0 0 10px ${barColor}55`,
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-muted-foreground">
                {analysesLeft} {analysesLeft === 1 ? "analysis" : "analyses"} remaining
              </p>
              <p className="text-[10px] text-muted-foreground/50">150 max</p>
            </div>
          </div>

          {/* Footer stat row */}
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.02]">
            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>10 pts / query</span>
            </div>
            <div className="text-[11px] text-muted-foreground">
              <span className="text-emerald-400 font-semibold">$5</span>
              <span className="mx-1 opacity-40">=</span>
              <span>50 pts</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}