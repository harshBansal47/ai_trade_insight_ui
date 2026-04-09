"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  CheckCircle2,
  CreditCard,
  Loader2,
  Sparkles,
  TrendingUp,
  Zap,
  Star,
  Clock,
  Gift,
  Infinity,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { paymentService, POINTS_BUNDLES, type PointsBundle } from "@/services/payment.service";

/* ── Bundle Card ─────────────────────────────────────────────── */
function BundleCard({
  bundle,
  onBuy,
  loading,
}: {
  bundle: PointsBundle;
  onBuy: (b: PointsBundle) => void;
  loading: boolean;
}) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-3xl border transition-all duration-300 overflow-hidden",
        bundle.popular
          ? "border-cyan-400/40 bg-gradient-to-b from-cyan-500/[0.07] to-transparent shadow-[0_0_40px_rgba(0,212,255,0.1)]"
          : "border-white/[0.08] bg-white/[0.02] hover:border-white/[0.16] hover:bg-white/[0.04]"
      )}
    >
      {/* Popular ribbon */}
      {bundle.popular && (
        <div className="flex items-center justify-center gap-1.5 py-2 bg-gradient-to-r from-cyan-400 to-violet-500 text-black">
          <Star className="w-3 h-3 fill-black" />
          <span className="text-[11px] font-bold  uppercase">Most Popular</span>
          <Star className="w-3 h-3 fill-black" />
        </div>
      )}

      <div className="flex flex-col gap-6 p-6 flex-1">
        {/* Name + Price */}
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase  mb-3">
            {bundle.name}
          </p>
          <div className="flex items-end gap-1.5">
            <span className="text-5xl font-black text-foreground tracking-tight" style={{ fontFamily: "var(--font-display)" }}>
              ${bundle.price_usd}
            </span>
            <span className="text-sm text-muted-foreground mb-2 font-medium">USD</span>
          </div>
          <p className="text-xs text-muted-foreground/60 mt-1 font-mono">
            ${(bundle.price_usd / bundle.points).toFixed(2)} · per analysis
          </p>
        </div>

        {/* Points highlight */}
        <div className={cn(
          "flex items-center gap-3 px-4 py-3.5 rounded-2xl border",
          bundle.popular
            ? "bg-cyan-400/10 border-cyan-400/25"
            : "bg-white/[0.04] border-white/[0.07]"
        )}>
          <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0", bundle.popular ? "bg-cyan-400/20" : "bg-white/[0.06]")}>
            <Sparkles className={cn("w-4 h-4", bundle.popular ? "text-cyan-400" : "text-muted-foreground")} />
          </div>
          <div>
            <p className="text-xl font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
              {bundle.points} <span className="text-base font-semibold">pts</span>
            </p>
            <p className="text-xs text-muted-foreground">{bundle.points} AI analyses</p>
          </div>
        </div>

        {/* Features */}
        <div className="space-y-2.5 flex-1">
          {[
            "All 3 trading modes",
            "Full history access",
            "Never expires",
          ].map((feat) => (
            <div key={feat} className="flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-sm text-muted-foreground">{feat}</span>
            </div>
          ))}
        </div>

        {/* CTA */}
        <button
          onClick={() => onBuy(bundle)}
          disabled={loading}
          className={cn(
            "w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-bold text-sm transition-all duration-200",
            bundle.popular
              ? "bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,212,255,0.3)] hover:shadow-[0_0_32px_rgba(0,212,255,0.5)] hover:scale-[1.02] active:scale-[0.98]"
              : "bg-white/[0.07] text-foreground hover:bg-white/[0.12] border border-white/[0.10] hover:scale-[1.02] active:scale-[0.98]",
            loading && "opacity-60 cursor-not-allowed hover:scale-100"
          )}
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <CreditCard className="w-4 h-4" />
              Buy {bundle.points} Points
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────── */
export default function PricingPage() {
  const { points } = useAuthStore();
  const [buyingId, setBuyingId] = useState<string | null>(null);

  const { data: history } = useQuery({
    queryKey: ["payment-history"],
    queryFn: paymentService.getHistory,
  });

  const handleBuy = async (bundle: PointsBundle) => {
    setBuyingId(bundle.id);
    try {
      await paymentService.redirectToCheckout(bundle);
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : "Payment failed. Try again.");
      setBuyingId(null);
    }
  };

  const analysesRemaining = Math.floor(points / 10);
  const pointsPercent     = Math.min((points / 150) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-12">

      {/* ── Header ── */}
      <div>
        <h1
          className="text-3xl font-black text-foreground  "
          style={{ fontFamily: "var(--font-display)" }}
        >
          Points & Billing
        </h1>
        <p className="text-base text-muted-foreground mt-1.5">
          Pay only for what you use. No subscriptions, no surprises.
        </p>
      </div>

      {/* ── Balance card ── */}
      <div className="relative rounded-3xl border border-white/[0.08] overflow-hidden">
        {/* Subtle bg glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.05] via-transparent to-violet-500/[0.05] pointer-events-none" />

        <div className="relative p-7 flex flex-col sm:flex-row gap-8">
          {/* Left: balance + bar */}
          <div className="flex-1 space-y-5">
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase  mb-2">
                Your Balance
              </p>
             <div className="flex items-end gap-2">
      <span
        className="text-6xl font-black tracking-tight"
        style={{
          fontFamily: "var(--font-display)",
          background: "linear-gradient(135deg, #00D4FF 0%, #7B2FFF 60%, #FF6B6B 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          filter: "drop-shadow(0 0 24px rgba(0,212,255,0.35))",
        }}
      >
        {points}
      </span>
      <span className="text-lg text-muted-foreground mb-3 font-medium">pts</span>
    </div>
            <p className="text-sm text-muted-foreground mt-1">
      {analysesRemaining > 0
        ? `Enough for ${analysesRemaining} more ${analysesRemaining === 1 ? "analysis" : "analyses"}`
        : "Top up to continue analyzing"}
    </p> 
            
            </div>

            <div className="space-y-2">
              <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pointsPercent}%`,
                    background: "linear-gradient(90deg, #00D4FF, #7B2FFF)",
                    boxShadow: "0 0 12px rgba(0,212,255,0.5)",
                  }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground/50">
                <span>0 pts</span>
                <span>150 pts</span>
              </div>
            </div>
          </div>

          {/* Right: stat pills */}
          <div className="flex sm:flex-col gap-3 shrink-0">
            <div className="flex-1 sm:flex-none flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
              <div className="w-9 h-9 rounded-xl bg-cyan-400/10 flex items-center justify-center shrink-0">
                <Zap className="w-4.5 h-4.5 text-cyan-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  {analysesRemaining}
                </p>
                <p className="text-xs text-muted-foreground">analyses left</p>
              </div>
            </div>

            <div className="flex-1 sm:flex-none flex items-center gap-3.5 px-5 py-4 rounded-2xl bg-white/[0.04] border border-white/[0.07]">
              <div className="w-9 h-9 rounded-xl bg-emerald-400/10 flex items-center justify-center shrink-0">
                <TrendingUp className="w-4.5 h-4.5 text-emerald-400" />
              </div>
              <div>
                <p className="text-2xl font-black text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  10
                </p>
                <p className="text-xs text-muted-foreground">pts per analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bundle cards ── */}
      <div className="space-y-4">
        <h2
          className="text-xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Buy More Points
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {POINTS_BUNDLES.map((bundle) => (
            <BundleCard
              key={bundle.id}
              bundle={bundle}
              onBuy={handleBuy}
              loading={buyingId === bundle.id}
            />
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground/50 pt-1">
          🔒 Secure payment via Stripe · Points credited instantly
        </p>
      </div>

      {/* ── How points work ── */}
      <div className="rounded-3xl border border-white/[0.07] bg-white/[0.02] p-7 space-y-5">
        <h3
          className="text-base font-bold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How it works
        </h3>
        <div className="grid sm:grid-cols-3 gap-6">
          {[
            { Icon: Gift,     color: "text-violet-400", bg: "bg-violet-400/10", title: "50 free on signup",     desc: "Every new account starts with 50 free points — no card needed." },
            { Icon: Zap,      color: "text-cyan-400",   bg: "bg-cyan-400/10",   title: "10 pts per analysis",   desc: "Each AI analysis costs 10 points regardless of coin or strategy." },
            { Icon: Infinity, color: "text-emerald-400",bg: "bg-emerald-400/10",title: "Points never expire",   desc: "Top up and use at your own pace. No subscriptions ever." },
          ].map(({ Icon, color, bg, title, desc }) => (
            <div key={title} className="flex gap-3.5">
              <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5", bg)}>
                <Icon className={cn("w-4 h-4", color)} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Payment history ── */}
      {history && history.length > 0 && (
        <div className="space-y-4">
          <h3
            className="text-base font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Payment History
          </h3>
          <div className="rounded-3xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.05]">
            {history.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-3.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-400/10 flex items-center justify-center shrink-0">
                    <CreditCard className="w-4 h-4 text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">+{p.points} points</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <Clock className="w-3 h-3 text-muted-foreground/50" />
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <p className="text-sm font-bold text-foreground">${p.amount_usd}</p>
                  <span className={cn(
                    "text-xs px-2.5 py-1 rounded-full font-semibold",
                    p.status === "completed"
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "bg-yellow-400/10 text-yellow-400"
                  )}>
                    {p.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}