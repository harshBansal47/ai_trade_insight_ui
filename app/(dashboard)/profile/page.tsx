"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart2,
  CheckCircle2,
  History,
  Loader2,
  Pencil,
  Sparkles,
  TrendingUp,
  User,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/useAuthStore";
import { authService } from "@/services/auth.service";
import { taskService } from "@/services/task.service";
import { formatDate } from "@/lib/utils";
import StatCard from "@/components/StatCard";
import { SkeletonCard } from "@/components/Loader";

export default function ProfilePage() {
  const { user, points, updateUser } = useAuthStore();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? "");
  const [saving, setSaving] = useState(false);

  // Fetch history for stats
  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["history", "profile"],
    queryFn: () => taskService.getHistory({ per_page: 100 }),
  });

  const items = historyData?.items ?? [];
  const completed = items.filter((i) => i.status === "completed");
  const longs  = completed.filter((i) => i.result?.action === "LONG").length;
  const shorts = completed.filter((i) => i.result?.action === "SHORT").length;
  const waits  = completed.filter((i) => i.result?.action === "WAIT").length;

  // Most used coin
  const coinCounts = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.coin_symbol] = (acc[item.coin_symbol] ?? 0) + 1;
    return acc;
  }, {});
  const topCoin = Object.entries(coinCounts).sort((a, b) => b[1] - a[1])[0];

  const handleSaveName = async () => {
    if (!name.trim() || name === user?.name) { setEditing(false); return; }
    setSaving(true);
    try {
      await authService.getProfile(); // placeholder — real app: PATCH /auth/me
      updateUser({ name: name.trim() });
      toast.success("Profile updated");
      setEditing(false);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const avatarLetter = user?.name?.charAt(0)?.toUpperCase() ?? "U";

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-8">
      {/* ── Header ─────────────────────────────────────────── */}
      <div>
        <h1
          className="text-2xl font-bold"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Profile
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Manage your account details and view your trading stats
        </p>
      </div>

      {/* ── Profile Card ───────────────────────────────────── */}
      <div className="glass rounded-2xl p-6 border border-white/[0.08] space-y-6">
        <div className="flex items-start gap-5">
          {/* Avatar */}
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 to-violet-500 flex items-center justify-center text-2xl font-bold text-black shadow-[0_0_20px_rgba(0,212,255,0.3)]">
              {avatarLetter}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-green-400 border-2 border-background flex items-center justify-center">
              <CheckCircle2 className="w-2.5 h-2.5 text-black" />
            </div>
          </div>

          {/* Name + Email */}
          <div className="flex-1 min-w-0 space-y-3">
            {editing ? (
              <div className="flex items-center gap-2">
                <input
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveName()}
                  className="flex-1 px-3 py-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/5 text-sm text-foreground outline-none"
                />
                <button
                  onClick={handleSaveName}
                  disabled={saving}
                  className="px-3 py-1.5 rounded-lg bg-cyan-400 text-black text-xs font-semibold hover:bg-cyan-300 transition-colors disabled:opacity-70 flex items-center gap-1.5"
                >
                  {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : "Save"}
                </button>
                <button
                  onClick={() => { setEditing(false); setName(user?.name ?? ""); }}
                  className="px-3 py-1.5 rounded-lg border border-white/[0.1] text-xs text-muted-foreground hover:text-foreground"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  {user?.name}
                </h2>
                <button
                  onClick={() => setEditing(true)}
                  className="text-muted-foreground/40 hover:text-muted-foreground transition-colors"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                <span>{user?.email}</span>
              </div>
              {user?.createdAt && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
                  <span>Member since {formatDate(user.createdAt)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Points row */}
        <div className="flex items-center justify-between p-4 bg-white/[0.03] rounded-xl border border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-cyan-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {points} points
              </p>
              <p className="text-xs text-muted-foreground">
                {Math.floor(points / 10)} analyses remaining
              </p>
            </div>
          </div>
          <a
            href="/pricing"
            className="text-xs text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Buy more →
          </a>
        </div>
      </div>

      {/* ── Stats ──────────────────────────────────────────── */}
      <div>
        <h2
          className="text-base font-semibold mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Trading Statistics
        </h2>

        {historyLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[...Array(4)].map((_, i) => <SkeletonCard key={i} lines={2} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <StatCard
              icon={History}
              iconColor="text-cyan-400"
              iconBg="bg-cyan-400/10"
              label="Total analyses"
              value={items.length}
              sub="All time"
            />
            <StatCard
              icon={TrendingUp}
              iconColor="text-green-400"
              iconBg="bg-green-400/10"
              label="LONG signals"
              value={longs}
              sub={`${completed.length ? Math.round((longs / completed.length) * 100) : 0}% of signals`}
            />
            <StatCard
              icon={BarChart2}
              iconColor="text-red-400"
              iconBg="bg-red-400/10"
              label="SHORT signals"
              value={shorts}
              sub={`${completed.length ? Math.round((shorts / completed.length) * 100) : 0}% of signals`}
            />
            <StatCard
              icon={Zap}
              iconColor="text-orange-400"
              iconBg="bg-orange-400/10"
              label="Top coin"
              value={topCoin ? topCoin[0] : "—"}
              sub={topCoin ? `${topCoin[1]} analyses` : "No data yet"}
            />
          </div>
        )}
      </div>

      {/* ── Mode usage breakdown ───────────────────────────── */}
      {!historyLoading && items.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-white/[0.08] space-y-4">
          <h3
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Strategy usage
          </h3>
          {(["SCALPER", "SWING", "CONSERVATIVE"] as const).map((mode) => {
            const count = items.filter((i) => i.mode === mode).length;
            const pct = items.length ? Math.round((count / items.length) * 100) : 0;
            const colors: Record<string, string> = {
              SCALPER: "#FF6B35",
              SWING: "#00D4FF",
              CONSERVATIVE: "#22c55e",
            };
            return (
              <div key={mode} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">{mode}</span>
                  <span className="text-foreground font-mono font-medium">
                    {count} <span className="text-muted-foreground">({pct}%)</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/[0.05]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${pct}%`,
                      background: colors[mode],
                      boxShadow: `0 0 8px ${colors[mode]}66`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Signal distribution ────────────────────────────── */}
      {!historyLoading && completed.length > 0 && (
        <div className="glass rounded-2xl p-6 border border-white/[0.08] space-y-4">
          <h3
            className="text-sm font-semibold"
            style={{ fontFamily: "var(--font-display)" }}
          >
            AI signal distribution
          </h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "LONG",  value: longs,  color: "#22c55e", bg: "bg-green-400/10"  },
              { label: "SHORT", value: shorts, color: "#ef4444", bg: "bg-red-400/10"    },
              { label: "WAIT",  value: waits,  color: "#eab308", bg: "bg-yellow-400/10" },
            ].map(({ label, value, color, bg }) => (
              <div key={label} className={`${bg} rounded-xl p-4 text-center space-y-1`}>
                <p
                  className="text-2xl font-bold"
                  style={{ color, fontFamily: "var(--font-display)" }}
                >
                  {value}
                </p>
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="text-[10px] text-muted-foreground/60">
                  {completed.length ? Math.round((value / completed.length) * 100) : 0}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
