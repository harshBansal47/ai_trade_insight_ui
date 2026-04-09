"use client";

import { useState } from "react";
import { ArrowUp, Sparkles, ChevronDown, Zap, TrendingUp, Shield } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import CoinSelector, { type Coin } from "./CoinSelector";
import ModeSelector from "./ModeSelector";
import type { TradingMode, AnalyzeRequest } from "@/services/task.service";
import { POINTS_PER_QUERY } from "@/lib/api";

interface ChatInputProps {
  onSubmit: (data: AnalyzeRequest) => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const MODE_META: Record<TradingMode, { icon: React.ReactNode; label: string; color: string; bg: string; border: string }> = {
  SCALPER: {
    icon: <Zap className="w-3.5 h-3.5" />,
    label: "Scalper",
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/30",
  },
  SWING: {
    icon: <TrendingUp className="w-3.5 h-3.5" />,
    label: "Swing",
    color: "text-violet-400",
    bg: "bg-violet-400/10",
    border: "border-violet-400/30",
  },
  CONSERVATIVE: {
    icon: <Shield className="w-3.5 h-3.5" />,
    label: "Conservative",
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/30",
  },
};

export default function ChatInput({
  onSubmit,
  isLoading = false,
  disabled = false,
}: ChatInputProps) {
  const { points } = useAuthStore();
  const [coin, setCoin] = useState<Coin | null>(null);
  const [mode, setMode] = useState<TradingMode | null>(null);
  const [message, setMessage] = useState("");
  const [showModes, setShowModes] = useState(false);

  const canSubmit =
    !!coin && !!mode && !isLoading && !disabled && points >= POINTS_PER_QUERY;

  const handleSubmit = () => {
    if (!canSubmit || !coin || !mode) return;
    onSubmit({
      coin: coin.name,
      coin_symbol: coin.symbol,
      mode,
      message: message.trim() || undefined,
    });
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insufficientPoints = points < POINTS_PER_QUERY;
  const activeMeta = mode ? MODE_META[mode] : null;

  return (
    <div className="w-full space-y-2">

      {/* ── Mode selector panel (collapsible) ── */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          showModes ? "max-h-56 opacity-100" : "max-h-0 opacity-0 pointer-events-none"
        )}
      >
        {/* Solid background prevents text bleed-through */}
        <div className="rounded-2xl border border-white/[0.08] bg-[hsl(var(--background))] p-3 mb-1">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2.5 px-1">
            Trading Strategy
          </p>
          <ModeSelector value={mode} onChange={(m) => { setMode(m); setShowModes(false); }} disabled={isLoading} />
        </div>
      </div>

      {/* ── Main input card ── */}
      <div
        className={cn(
          "rounded-2xl border transition-all duration-300",
          /* solid bg so any dropdown/overlay above it has a real surface beneath */
          "bg-[hsl(var(--background))]",
          isLoading
            ? "border-cyan-400/30 shadow-[0_0_24px_rgba(0,212,255,0.07)]"
            : "border-white/[0.10] hover:border-white/[0.18] focus-within:border-cyan-400/35 focus-within:shadow-[0_0_0_3px_rgba(0,212,255,0.05)]"
        )}
      >

        {/* ── Row 1: Coin selector + mode button ── */}
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-3 border-b border-white/[0.06]">
          {/* 
            CoinSelector must render its dropdown with:
              background: hsl(var(--background)) OR a dark solid color
              z-index: 50
            so it doesn't leak the backdrop text through.
            Pass a className or wrap it below for the overlay fix.
          */}
          <div className="flex-1 [&_[role=listbox]]:bg-[hsl(var(--background))] [&_[role=listbox]]:border [&_[role=listbox]]:border-white/[0.12] [&_[role=listbox]]:shadow-xl [&_[role=listbox]]:rounded-xl [&_[role=option]]:text-foreground [&_[data-radix-popper-content-wrapper]]:z-50">
            <CoinSelector value={coin} onChange={setCoin} disabled={isLoading} />
          </div>

          <button
            type="button"
            onClick={() => setShowModes(!showModes)}
            disabled={isLoading}
            className={cn(
              "shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-200",
              activeMeta
                ? cn(activeMeta.bg, activeMeta.border, activeMeta.color)
                : showModes
                ? "border-white/[0.18] bg-white/[0.06] text-foreground"
                : "border-white/[0.08] bg-transparent text-muted-foreground hover:border-white/[0.18] hover:text-foreground"
            )}
          >
            {activeMeta ? (
              <>
                {activeMeta.icon}
                <span>{activeMeta.label}</span>
              </>
            ) : (
              <>
                <span>Strategy</span>
                <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", showModes && "rotate-180")} />
              </>
            )}
          </button>
        </div>

        {/* ── Row 2: Message textarea ── */}
        <div className="px-4 py-3">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder={
              !coin
                ? "Select a coin above to get started…"
                : !mode
                ? "Pick a strategy, then add any context…"
                : "Add extra requirements or questions for the analysis (optional)…"
            }
            rows={2}
            className="w-full bg-transparent text-[15px] text-foreground placeholder:text-muted-foreground/35 resize-none outline-none leading-relaxed disabled:opacity-50"
          />
        </div>

        {/* ── Row 3: Footer bar ── */}
        <div className="flex items-center justify-between px-4 pb-4 gap-3">

          {/* Points indicator */}
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium",
                insufficientPoints
                  ? "bg-red-400/10 text-red-400 border border-red-400/20"
                  : "bg-cyan-400/8 text-cyan-400 border border-cyan-400/15"
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="font-semibold">{points}</span>
              <span className="opacity-60">pts</span>
            </div>
            <span className="text-xs text-muted-foreground/50 hidden sm:block">
              {POINTS_PER_QUERY} per analysis
            </span>
          </div>

          {/* Submit button */}
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 shrink-0",
              canSubmit
                ? "bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_20px_rgba(0,212,255,0.25)] hover:shadow-[0_0_28px_rgba(0,212,255,0.45)] hover:scale-[1.03] active:scale-[0.97]"
                : "bg-white/[0.04] text-muted-foreground/50 border border-white/[0.06] cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-black/20 border-t-black/70 rounded-full animate-spin" />
                Analyzing…
              </>
            ) : (
              <>
                <ArrowUp className="w-4 h-4" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Validation hints ── */}
      {insufficientPoints && (
        <p className="text-xs text-red-400 text-center pt-0.5 animate-fade-in">
          Not enough points.{" "}
          <a href="/pricing" className="underline underline-offset-2 hover:text-red-300 font-medium">
            Top up →
          </a>
        </p>
      )}
    </div>
  );
}