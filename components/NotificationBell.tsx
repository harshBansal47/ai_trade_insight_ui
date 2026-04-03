"use client";

import { useState } from "react";
import { Bell, CheckCheck, Sparkles, TrendingUp, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  type: "analysis" | "points" | "system";
  title: string;
  body: string;
  time: string;
  read: boolean;
}

// Mock notifications — replace with real API
const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: "1",
    type: "analysis",
    title: "BTC analysis complete",
    body: "Your SCALPER analysis for BTC returned a LONG signal with 82% confidence.",
    time: "2m ago",
    read: false,
  },
  {
    id: "2",
    type: "points",
    title: "Low points warning",
    body: "You have 20 points remaining — enough for 2 more analyses.",
    time: "1h ago",
    read: false,
  },
  {
    id: "3",
    type: "system",
    title: "Welcome to CryptoAI Insights",
    body: "Your 50 free signup points have been credited. Start analyzing!",
    time: "2d ago",
    read: true,
  },
];

const TYPE_CONFIG = {
  analysis: { icon: TrendingUp, color: "text-cyan-400",   bg: "bg-cyan-400/10"  },
  points:   { icon: Sparkles,   color: "text-yellow-400", bg: "bg-yellow-400/10" },
  system:   { icon: Zap,        color: "text-violet-400", bg: "bg-violet-400/10" },
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(MOCK_NOTIFICATIONS);

  const unread = notifications.filter((n) => !n.read).length;

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

  const markRead = (id: string) =>
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-white/[0.06] transition-all"
      >
        <Bell className="w-4 h-4" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-cyan-400 text-black text-[9px] font-bold flex items-center justify-center shadow-[0_0_6px_rgba(0,212,255,0.6)]">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-80 glass rounded-2xl border border-white/[0.1] shadow-2xl z-50 overflow-hidden animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.06]">
              <p className="text-xs font-semibold text-foreground">
                Notifications
              </p>
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground transition-colors"
                >
                  <CheckCheck className="w-3 h-3" />
                  Mark all read
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="py-8 text-center text-xs text-muted-foreground">
                  No notifications
                </div>
              ) : (
                notifications.map((notif) => {
                  const cfg = TYPE_CONFIG[notif.type];
                  const Icon = cfg.icon;
                  return (
                    <button
                      key={notif.id}
                      onClick={() => markRead(notif.id)}
                      className={cn(
                        "w-full flex items-start gap-3 px-4 py-3 text-left transition-colors",
                        notif.read
                          ? "hover:bg-white/[0.02]"
                          : "bg-white/[0.03] hover:bg-white/[0.05]"
                      )}
                    >
                      <div
                        className={cn(
                          "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5",
                          cfg.bg
                        )}
                      >
                        <Icon className={cn("w-3.5 h-3.5", cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-medium text-foreground truncate">
                            {notif.title}
                          </p>
                          {!notif.read && (
                            <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                          {notif.body}
                        </p>
                        <p className="text-[10px] text-muted-foreground/40">
                          {notif.time}
                        </p>
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="border-t border-white/[0.06] px-4 py-2.5">
              <button className="w-full text-[10px] text-muted-foreground hover:text-foreground transition-colors text-center">
                View all notifications
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
