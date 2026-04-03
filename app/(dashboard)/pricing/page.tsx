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
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { paymentService, POINTS_BUNDLES, type PointsBundle } from "@/services/payment.service";

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
        "relative glass rounded-2xl p-6 border flex flex-col gap-5 transition-all duration-300 hover:scale-[1.02]",
        bundle.popular
          ? "border-cyan-400/40 shadow-[0_0_30px_rgba(0,212,255,0.12)]"
          : "border-white/[0.08] hover:border-white/[0.16]"
      )}
    >
      {bundle.popular && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2">
          <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-gradient-to-r from-cyan-400 to-violet-400 text-black shadow-[0_0_12px_rgba(0,212,255,0.4)]">
            BEST VALUE
          </span>
        </div>
      )}

      <div className="space-y-1">
        <p className="text-xs text-muted-foreground uppercase tracking-widest">{bundle.name}</p>
        <div className="flex items-end gap-1">
          <span
            className="text-4xl font-bold gradient-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ${bundle.price_usd}
          </span>
          <span className="text-muted-foreground text-xs mb-1.5">USD</span>
        </div>
      </div>

      <div className="space-y-2.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-cyan-400/10 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <span className="text-sm font-semibold text-foreground">
            {bundle.points} points
          </span>
        </div>
        {[
          `${bundle.points} AI analyses`,
          "All 3 trading modes",
          "Full history access",
          "Never expires",
        ].map((feat) => (
          <div key={feat} className="flex items-center gap-2 text-xs text-muted-foreground">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
            {feat}
          </div>
        ))}
      </div>

      <div className="text-xs text-muted-foreground/50 text-center font-mono">
        ${(bundle.price_usd / bundle.points).toFixed(2)} per analysis
      </div>

      <button
        onClick={() => onBuy(bundle)}
        disabled={loading}
        className={cn(
          "w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all",
          bundle.popular
            ? "bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_16px_rgba(0,212,255,0.3)] hover:shadow-[0_0_24px_rgba(0,212,255,0.5)]"
            : "bg-white/[0.06] text-foreground hover:bg-white/[0.10] border border-white/[0.08]",
          loading && "opacity-70 cursor-not-allowed"
        )}
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <CreditCard className="w-4 h-4" />
            Buy {bundle.points} points
          </>
        )}
      </button>
    </div>
  );
}

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
  const pointsPercent = Math.min((points / 150) * 100, 100);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
      {/* ── Header ─────────────────────────────────────────── */}
      <div className="space-y-1">
        <h1
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Points & Billing
        </h1>
        <p className="text-sm text-muted-foreground">
          Pay only for what you use. Points never expire.
        </p>
      </div>

      {/* ── Current balance card ───────────────────────────── */}
      <div className="glass rounded-2xl p-6 border border-white/[0.08] relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/[0.04] to-violet-500/[0.04]" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-6">
          {/* Balance */}
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest mb-2">
                Current Balance
              </p>
              <div className="flex items-end gap-2">
                <span
                  className="text-5xl font-bold gradient-text"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {points}
                </span>
                <span className="text-muted-foreground text-sm mb-2">points</span>
              </div>
            </div>

            {/* Progress bar */}
            <div className="space-y-1.5">
              <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${pointsPercent}%`,
                    background: "linear-gradient(90deg, #00D4FF, #7B2FFF)",
                    boxShadow: "0 0 10px rgba(0,212,255,0.4)",
                  }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-muted-foreground">
                <span>0 pts</span>
                <span>150 pts</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="flex sm:flex-col gap-4 sm:gap-3 shrink-0">
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                <Zap className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  {analysesRemaining}
                </p>
                <p className="text-[10px] text-muted-foreground">analyses left</p>
              </div>
            </div>
            <div className="glass rounded-xl p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-green-400" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                  10 pts
                </p>
                <p className="text-[10px] text-muted-foreground">per analysis</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Bundle cards ───────────────────────────────────── */}
      <div>
        <h2
          className="text-base font-semibold text-foreground mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Buy more points
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

        <p className="text-center text-xs text-muted-foreground mt-6">
          Secure payment via Stripe · Points credited instantly after payment
        </p>
      </div>

      {/* ── How points work ────────────────────────────────── */}
      <div className="glass rounded-2xl p-6 border border-white/[0.06] space-y-4">
        <h3
          className="text-sm font-semibold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          How points work
        </h3>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { icon: "🎁", title: "50 free on signup", desc: "Every new account starts with 50 free points — no card needed." },
            { icon: "⚡", title: "10 pts per analysis", desc: "Each AI analysis costs 10 points regardless of coin or mode." },
            { icon: "♾️", title: "Points never expire", desc: "Top up and use at your own pace. No subscriptions." },
          ].map((item) => (
            <div key={item.title} className="space-y-1.5">
              <span className="text-xl">{item.icon}</span>
              <p className="text-xs font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Payment history ─────────────────────────────────── */}
      {history && history.length > 0 && (
        <div className="space-y-3">
          <h3
            className="text-sm font-semibold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Payment History
          </h3>
          <div className="space-y-2">
            {history.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between px-4 py-3 glass rounded-xl border border-white/[0.06]"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-400/10 flex items-center justify-center">
                    <CreditCard className="w-3.5 h-3.5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground">
                      +{p.points} points
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      {new Date(p.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-foreground">${p.amount_usd}</p>
                  <span className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-medium",
                    p.status === "completed" ? "bg-green-400/10 text-green-400" : "bg-yellow-400/10 text-yellow-400"
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
