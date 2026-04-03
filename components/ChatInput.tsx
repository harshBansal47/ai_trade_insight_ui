"use client";

import { useState } from "react";
import { ArrowUp, Sparkles } from "lucide-react";
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

    // Clear message after submit (keep coin/mode for convenience)
    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const insufficientPoints = points < POINTS_PER_QUERY;

  return (
    <div className="w-full space-y-3">
      {/* ── Mode Selector (collapsible) ────────────────────── */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          showModes ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        )}
      >
        <div className="pb-1">
          <ModeSelector value={mode} onChange={setMode} disabled={isLoading} />
        </div>
      </div>

      {/* ── Main Input Box ─────────────────────────────────── */}
      <div
        className={cn(
          "glass rounded-2xl border transition-all duration-300",
          isLoading
            ? "border-cyan-400/30 shadow-[0_0_20px_rgba(0,212,255,0.08)]"
            : "border-white/[0.08] hover:border-white/[0.14] focus-within:border-cyan-400/40 focus-within:shadow-[0_0_0_3px_rgba(0,212,255,0.06)]"
        )}
      >
        {/* Top row: Coin selector + mode pill */}
        <div className="flex items-center gap-2 px-3 pt-3 pb-2 border-b border-white/[0.05]">
          <div className="flex-1">
            <CoinSelector
              value={coin}
              onChange={setCoin}
              disabled={isLoading}
            />
          </div>

          <button
            type="button"
            onClick={() => setShowModes(!showModes)}
            className={cn(
              "shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium border transition-all duration-200",
              mode
                ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-400"
                : showModes
                ? "border-white/[0.16] text-foreground bg-white/[0.06]"
                : "border-white/[0.08] text-muted-foreground hover:border-white/[0.16] hover:text-foreground"
            )}
          >
            {mode ? (
              <>
                <span>
                  {mode === "SCALPER"
                    ? "⚡"
                    : mode === "SWING"
                    ? "📈"
                    : "🛡️"}
                </span>
                {mode}
              </>
            ) : (
              <>Select mode</>
            )}
          </button>
        </div>

        {/* Message input */}
        <div className="px-3 py-2">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            placeholder="Add context or specific questions... (optional)"
            rows={2}
            className="w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 resize-none outline-none leading-relaxed disabled:opacity-50"
          />
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between px-3 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs">
              <Sparkles
                className={cn(
                  "w-3.5 h-3.5",
                  insufficientPoints ? "text-red-400" : "text-cyan-400"
                )}
              />
              <span
                className={cn(
                  "font-medium",
                  insufficientPoints ? "text-red-400" : "text-cyan-400"
                )}
              >
                {points}
              </span>
              <span className="text-muted-foreground">pts</span>
            </div>
            <span className="text-muted-foreground/40 text-xs">·</span>
            <span className="text-xs text-muted-foreground">
              {POINTS_PER_QUERY} pts per analysis
            </span>
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!canSubmit}
            className={cn(
              "flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200",
              canSubmit
                ? "bg-cyan-400 text-black hover:bg-cyan-300 shadow-[0_0_16px_rgba(0,212,255,0.3)] hover:shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:scale-105 active:scale-95"
                : "bg-white/[0.05] text-muted-foreground cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <div className="w-3 h-3 border border-black/30 border-t-black/80 rounded-full animate-spin" />
                Analyzing
              </>
            ) : (
              <>
                <ArrowUp className="w-3.5 h-3.5" />
                Analyze
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Validation hints ───────────────────────────────── */}
      {insufficientPoints && (
        <p className="text-xs text-red-400 text-center animate-fade-in">
          Insufficient points.{" "}
          <a href="/pricing" className="underline underline-offset-2 hover:text-red-300">
            Buy more →
          </a>
        </p>
      )}
      {!coin && !isLoading && (
        <p className="text-[10px] text-muted-foreground/40 text-center">
          Select a coin to get started
        </p>
      )}
    </div>
  );
}
