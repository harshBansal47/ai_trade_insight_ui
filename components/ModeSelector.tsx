"use client";

import { cn } from "@/lib/utils";
import type { TradingMode } from "@/services/task.service";

interface Mode {
  id: TradingMode;
  icon: string;
  label: string;
  description: string;
  timeframe: string;
  color: string;
  border: string;
  activeBg: string;
  badge: string;
}

const MODES: Mode[] = [
  {
    id: "SCALPER",
    icon: "⚡",
    label: "Scalper",
    description: "High-frequency, fast decisions",
    timeframe: "1m – 15m",
    color: "text-orange-400",
    border: "border-orange-400/20",
    activeBg: "bg-orange-400/10",
    badge: "bg-orange-400/10 text-orange-400",
  },
  {
    id: "SWING",
    icon: "📈",
    label: "Swing",
    description: "Balanced momentum trading",
    timeframe: "1h – 1D",
    color: "text-cyan-400",
    border: "border-cyan-400/20",
    activeBg: "bg-cyan-400/10",
    badge: "bg-cyan-400/10 text-cyan-400",
  },
  {
    id: "CONSERVATIVE",
    icon: "🛡️",
    label: "Conservative",
    description: "Low-risk, high-confidence only",
    timeframe: "1D – 1W",
    color: "text-green-400",
    border: "border-green-400/20",
    activeBg: "bg-green-400/10",
    badge: "bg-green-400/10 text-green-400",
  },
];

interface ModeSelectorProps {
  value: TradingMode | null;
  onChange: (mode: TradingMode) => void;
  disabled?: boolean;
  compact?: boolean;
}

export default function ModeSelector({
  value,
  onChange,
  disabled = false,
  compact = false,
}: ModeSelectorProps) {
  if (compact) {
    return (
      <div className="flex gap-1.5">
        {MODES.map((mode) => {
          const active = value === mode.id;
          return (
            <button
              key={mode.id}
              type="button"
              disabled={disabled}
              onClick={() => onChange(mode.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all duration-200",
                active
                  ? `${mode.activeBg} ${mode.border} ${mode.color}`
                  : "border-white/[0.08] text-muted-foreground hover:border-white/[0.16] hover:text-foreground",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <span>{mode.icon}</span>
              {mode.label}
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {MODES.map((mode) => {
        const active = value === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            disabled={disabled}
            onClick={() => onChange(mode.id)}
            className={cn(
              "relative flex flex-col items-start gap-2 p-3 rounded-xl border text-left transition-all duration-200 group",
              active
                ? `${mode.activeBg} ${mode.border} shadow-[0_0_16px_rgba(0,0,0,0.2)]`
                : "bg-white/[0.02] border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.04]",
              disabled && "opacity-50 cursor-not-allowed pointer-events-none"
            )}
          >
            {/* Active indicator */}
            {active && (
              <div
                className={cn(
                  "absolute top-2 right-2 w-1.5 h-1.5 rounded-full",
                  mode.color.replace("text-", "bg-")
                )}
              />
            )}

            <span className="text-xl leading-none">{mode.icon}</span>

            <div className="space-y-0.5">
              <p
                className={cn(
                  "text-xs font-semibold transition-colors",
                  active ? mode.color : "text-foreground"
                )}
              >
                {mode.label}
              </p>
              <p className="text-[10px] text-muted-foreground leading-snug">
                {mode.description}
              </p>
            </div>

            <span
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded-md font-mono font-medium",
                active ? mode.badge : "bg-white/[0.05] text-muted-foreground"
              )}
            >
              {mode.timeframe}
            </span>
          </button>
        );
      })}
    </div>
  );
}
