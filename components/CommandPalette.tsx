"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BarChart2,
  CreditCard,
  History,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  User,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useUIStore } from "@/store/useUIStore";
import { useLogout } from "@/hooks/useAuth";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  shortcut?: string;
  group: string;
}

export default function CommandPalette() {
  const router = useRouter();
  const { commandPaletteOpen: open, setCommandPaletteOpen: setOpen } = useUIStore();
  const handleLogout = useLogout();
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const nav = useCallback((path: string) => { router.push(path); setOpen(false); }, [router, setOpen]);

  const ITEMS: CommandItem[] = [
    { id: "dashboard", label: "Dashboard",        icon: LayoutDashboard, group: "Navigate", action: () => nav("/dashboard") },
    { id: "history",   label: "History",           icon: History,         group: "Navigate", action: () => nav("/history")   },
    { id: "pricing",   label: "Points & Pricing",  icon: CreditCard,      group: "Navigate", action: () => nav("/pricing")   },
    { id: "profile",   label: "Profile",           icon: User,            group: "Navigate", action: () => nav("/profile")   },
    { id: "settings",  label: "Settings",          icon: Settings,        group: "Navigate", action: () => nav("/settings")  },
    { id: "analyze",   label: "New Analysis",      icon: Zap,             group: "Actions",  action: () => nav("/dashboard"), shortcut: "⌘N" },
    { id: "logout",    label: "Sign Out",          icon: LogOut,          group: "Account",  action: async () => { await handleLogout(); router.push("/"); setOpen(false); } },
  ];

  const filtered = query
    ? ITEMS.filter((i) => i.label.toLowerCase().includes(query.toLowerCase()))
    : ITEMS;

  // Keyboard shortcut to open
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(!open);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, setOpen]);

  // Arrow key navigation
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter" && filtered[activeIndex]) {
        filtered[activeIndex].action();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, filtered, activeIndex]);

  useEffect(() => { setActiveIndex(0); }, [query]);
  useEffect(() => { if (!open) setQuery(""); }, [open]);

  if (!open) return null;

  const groups = [...new Set(filtered.map((i) => i.group))];

  return (
    <>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={() => setOpen(false)}
      />
      <div className="fixed left-1/2 top-[20%] -translate-x-1/2 w-full max-w-md z-50 animate-fade-in px-4">
        <div className="glass-strong rounded-2xl border border-white/[0.12] shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-white/[0.07]">
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
            />
            <kbd className="hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white/[0.06] text-[10px] text-muted-foreground/60 border border-white/[0.08]">
              ESC
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-72 overflow-y-auto py-2">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-8">
                No commands found for &ldquo;{query}&rdquo;
              </p>
            ) : (
              groups.map((group) => (
                <div key={group}>
                  <p className="px-4 py-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/40">
                    {group}
                  </p>
                  {filtered
                    .filter((i) => i.group === group)
                    .map((item) => {
                      const globalIdx = filtered.indexOf(item);
                      const Icon = item.icon;
                      return (
                        <button
                          key={item.id}
                          onClick={item.action}
                          onMouseEnter={() => setActiveIndex(globalIdx)}
                          className={cn(
                            "w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors",
                            activeIndex === globalIdx
                              ? "bg-white/[0.07] text-foreground"
                              : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <div
                            className={cn(
                              "w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                              activeIndex === globalIdx ? "bg-cyan-400/15" : "bg-white/[0.05]"
                            )}
                          >
                            <Icon
                              className={cn(
                                "w-3.5 h-3.5",
                                activeIndex === globalIdx ? "text-cyan-400" : "text-current"
                              )}
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium">{item.label}</p>
                            {item.description && (
                              <p className="text-[10px] text-muted-foreground/50">
                                {item.description}
                              </p>
                            )}
                          </div>
                          {item.shortcut && (
                            <kbd className="text-[10px] text-muted-foreground/40 bg-white/[0.05] px-1.5 py-0.5 rounded border border-white/[0.08]">
                              {item.shortcut}
                            </kbd>
                          )}
                        </button>
                      );
                    })}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-white/[0.06]">
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground/40">
              <span>↑↓ navigate</span>
              <span>↵ select</span>
              <span>esc close</span>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-muted-foreground/40">
              <kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">⌘</kbd>
              <kbd className="px-1 py-0.5 rounded bg-white/[0.05] border border-white/[0.08]">K</kbd>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
