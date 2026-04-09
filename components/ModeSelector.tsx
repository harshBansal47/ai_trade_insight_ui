"use client";

import { cn } from "@/lib/utils";
import { Zap, TrendingUp, Shield } from "lucide-react";
import type { TradingMode } from "@/services/task.service";

interface Mode {
  id:          TradingMode;
  Icon:        React.ElementType;
  label:       string;
  description: string;
  timeframe:   string;
  iconColor:   string;
  iconBg:      string;
  activeBorder:string;
  activeBg:    string;
  glow:        string;
  badgeColor:  string;
}

const MODES: Mode[] = [
  {
    id:           "SCALPER",
    Icon:         Zap,
    label:        "Scalper",
    description:  "High-frequency fast decisions",
    timeframe:    "1m – 15m",
    iconColor:    "text-amber-400",
    iconBg:       "bg-amber-400/15",
    activeBorder: "border-amber-400/40",
    activeBg:     "bg-amber-400/[0.07]",
    glow:         "shadow-[0_0_20px_rgba(251,191,36,0.12)]",
    badgeColor:   "bg-amber-400/10 text-amber-400",
  },
  {
    id:           "SWING",
    Icon:         TrendingUp,
    label:        "Swing",
    description:  "Balanced momentum trading",
    timeframe:    "1h – 1D",
    iconColor:    "text-cyan-400",
    iconBg:       "bg-cyan-400/15",
    activeBorder: "border-cyan-400/40",
    activeBg:     "bg-cyan-400/[0.07]",
    glow:         "shadow-[0_0_20px_rgba(34,211,238,0.12)]",
    badgeColor:   "bg-cyan-400/10 text-cyan-400",
  },
  {
    id:           "CONSERVATIVE",
    Icon:         Shield,
    label:        "Conservative",
    description:  "Low-risk, high-confidence only",
    timeframe:    "1D – 1W",
    iconColor:    "text-emerald-400",
    iconBg:       "bg-emerald-400/15",
    activeBorder: "border-emerald-400/40",
    activeBg:     "bg-emerald-400/[0.07]",
    glow:         "shadow-[0_0_20px_rgba(52,211,153,0.12)]",
    badgeColor:   "bg-emerald-400/10 text-emerald-400",
  },
];

interface ModeSelectorProps {
  value:     TradingMode | null;
  onChange:  (mode: TradingMode) => void;
  disabled?: boolean;
  compact?:  boolean;
}

export default function ModeSelector({
  value,
  onChange,
  disabled = false,
  compact  = false,
}: ModeSelectorProps) {

  /* ── Compact pill row (used inside ChatInput button area) ── */
  if (compact) {
    return (
      <div className="flex gap-2">
        {MODES.map((mode) => {
          const active = value === mode.id;
          const { Icon } = mode;
          return (
            <button
              key={mode.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(mode.id)}
              className={cn(
                "flex items-center gap-2 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all duration-200",
                active
                  ? cn(mode.activeBg, mode.activeBorder, mode.iconColor, mode.glow)
                  : "border-white/[0.08] text-muted-foreground hover:border-white/[0.16] hover:text-foreground hover:bg-white/[0.04]",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <Icon className="w-3.5 h-3.5" strokeWidth={2.5} />
              {mode.label}
            </button>
          );
        })}
      </div>
    );
  }

  /* ── Full card grid ── */
  return (
    <div className="grid grid-cols-3 gap-2.5">
      {MODES.map((mode) => {
        const active      = value === mode.id;
        const { Icon }    = mode;
        return (
          <button
            key={mode.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(mode.id)}
            className={cn(
              "relative flex flex-col gap-3.5 p-4 rounded-2xl border text-left transition-all duration-200",
              active
                ? cn(mode.activeBg, mode.activeBorder, mode.glow, "scale-[1.02]")
                : "bg-white/[0.02] border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04] hover:scale-[1.01]",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            {/* Active dot */}
            {active && (
              <span className={cn("absolute top-3 right-3 w-2 h-2 rounded-full", mode.iconColor.replace("text-", "bg-"))} />
            )}

            {/* Icon */}
            <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center", mode.iconBg)}>
              <Icon className={cn("w-4.5 h-4.5", mode.iconColor)} strokeWidth={2} />
            </div>

            {/* Label + description */}
            <div className="space-y-1">
              <p className={cn("text-sm font-bold leading-none transition-colors", active ? mode.iconColor : "text-foreground")}>
                {mode.label}
              </p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {mode.description}
              </p>
            </div>

            {/* Timeframe badge */}
            <span className={cn(
              "self-start text-[11px] font-semibold font-mono px-2 py-1 rounded-lg",
              active ? mode.badgeColor : "bg-white/[0.05] text-muted-foreground/70"
            )}>
              {mode.timeframe}
            </span>
          </button>
        );
      })}
    </div>
  );
}