"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CreditCard, History, LayoutDashboard, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/history",   icon: History,         label: "History"   },
  { href: "/pricing",   icon: CreditCard,       label: "Points"    },
  { href: "/settings",  icon: Settings,         label: "Settings"  },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 h-16 border-t border-white/[0.06] bg-[hsl(220_20%_6%/0.92)] backdrop-blur-xl safe-area-bottom">
      <div className="flex h-full items-center justify-around px-2">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all duration-200 min-w-[4rem]",
                active ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "w-6 h-6 flex items-center justify-center transition-all",
                  active && "drop-shadow-[0_0_6px_rgba(0,212,255,0.8)]"
                )}
              >
                <Icon
                  className={cn(
                    "w-5 h-5 transition-colors",
                    active ? "text-cyan-400" : "text-current"
                  )}
                />
              </div>
              <span
                className={cn(
                  "text-[10px] font-medium tracking-wide transition-colors",
                  active ? "text-foreground" : "text-muted-foreground/60"
                )}
              >
                {label}
              </span>
              {active && (
                <div className="absolute bottom-0 w-6 h-0.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,212,255,0.8)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
