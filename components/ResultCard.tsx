"use client";

import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  BarChart2,
  CheckCircle2,
  Clock,
  Minus,
  Shield,
  Target,
  TrendingDown,
  TrendingUp,
  XCircle,
} from "lucide-react";
import { cn, formatDate, getModeColor } from "@/lib/utils";
import type { TaskStatusResponse, AIInsight } from "@/services/task.service";
import { Loader } from "./Loader";

interface ResultCardProps {
  task: TaskStatusResponse;
  className?: string;
}

export default function ResultCard({ task, className }: ResultCardProps) {
  if (task.status === "pending" || task.status === "processing") {
    return <ProcessingCard task={task} className={className} />;
  }

  if (task.status === "failed") {
    return <ErrorCard task={task} className={className} />;
  }

  if (task.status === "completed" && task.result) {
    return <InsightCard task={task} insight={task.result} className={className} />;
  }

  return null;
}

// ── Processing State ──────────────────────────────────────────────────────────

function ProcessingCard({
  task,
  className,
}: {
  task: TaskStatusResponse;
  className?: string;
}) {
  const steps = ["Fetching market data", "Running AI analysis", "Generating insights"];
  const isProcessing = task.status === "processing";

  return (
    <div className={cn("glass rounded-2xl p-6 space-y-5 animate-fade-in", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Loader variant="orbit" size="sm" />
          <div>
            <p className="text-sm font-semibold text-foreground">
              {isProcessing ? "Analyzing..." : "Queued"}
            </p>
            <p className="text-xs text-muted-foreground">
              {task.coin} · {task.mode}
            </p>
          </div>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-400/10 text-blue-400 border border-blue-400/20">
          {task.status}
        </span>
      </div>

      <div className="space-y-2">
        {steps.map((step, i) => {
          const done = i === 0 && isProcessing;
          const active = i === 1 && isProcessing;
          return (
            <div key={step} className="flex items-center gap-2.5">
              <div
                className={cn(
                  "w-4 h-4 rounded-full flex items-center justify-center shrink-0",
                  done
                    ? "bg-green-400/20"
                    : active
                    ? "bg-cyan-400/20"
                    : "bg-white/[0.04]"
                )}
              >
                {done ? (
                  <CheckCircle2 className="w-3 h-3 text-green-400" />
                ) : active ? (
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                ) : (
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/20" />
                )}
              </div>
              <span
                className={cn(
                  "text-xs",
                  done
                    ? "text-green-400 line-through opacity-60"
                    : active
                    ? "text-cyan-400"
                    : "text-muted-foreground"
                )}
              >
                {step}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Error State ───────────────────────────────────────────────────────────────

function ErrorCard({
  task,
  className,
}: {
  task: TaskStatusResponse;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5 border border-red-400/20 bg-red-400/5 animate-fade-in",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-400">Analysis Failed</p>
          <p className="text-xs text-muted-foreground mt-1">
            {task.error || "An unexpected error occurred. Please try again."}
          </p>
          <p className="text-xs text-muted-foreground/60 mt-2">
            {task.coin} · {task.mode}
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Completed Insight ─────────────────────────────────────────────────────────

function InsightCard({
  task,
  insight,
  className,
}: {
  task: TaskStatusResponse;
  insight: AIInsight;
  className?: string;
}) {
  const actionConfig = {
    LONG: {
      icon: ArrowUpRight,
      color: "text-green-400",
      bg: "bg-green-400/10",
      border: "border-green-400/30",
      glow: "shadow-[0_0_20px_rgba(34,197,94,0.15)]",
      label: "LONG",
    },
    SHORT: {
      icon: ArrowDownRight,
      color: "text-red-400",
      bg: "bg-red-400/10",
      border: "border-red-400/30",
      glow: "shadow-[0_0_20px_rgba(239,68,68,0.15)]",
      label: "SHORT",
    },
    WAIT: {
      icon: Minus,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10",
      border: "border-yellow-400/30",
      glow: "shadow-[0_0_20px_rgba(234,179,8,0.15)]",
      label: "WAIT",
    },
  };

  const trendConfig = {
    UPTREND: { icon: TrendingUp, color: "text-green-400", label: "Uptrend" },
    DOWNTREND: { icon: TrendingDown, color: "text-red-400", label: "Downtrend" },
    SIDEWAYS: { icon: BarChart2, color: "text-yellow-400", label: "Sideways" },
  };

  const riskConfig = {
    low: { color: "text-green-400", bg: "bg-green-400/10" },
    medium: { color: "text-yellow-400", bg: "bg-yellow-400/10" },
    high: { color: "text-red-400", bg: "bg-red-400/10" },
  };

  const action = actionConfig[insight.action as keyof typeof actionConfig] || actionConfig.WAIT;
  const trend = trendConfig[insight.trend as keyof typeof trendConfig] || trendConfig.SIDEWAYS;
  const TrendIcon = trend.icon;
  const ActionIcon = action.icon;
  const risk = riskConfig[insight.risk_level] || riskConfig.medium;

  return (
    <div className={cn("space-y-3 animate-fade-in", className)}>
      {/* Header row */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <span className={cn("px-2 py-0.5 rounded-md border text-[10px] font-medium", getModeColor(task.mode))}>
            {task.mode}
          </span>
          <span className="font-mono">{task.coin_symbol}/USDT</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          {task.completed_at ? formatDate(task.completed_at) : ""}
        </div>
      </div>

      {/* ── Main Decision Card ─────────────────────────────── */}
      <div
        className={cn(
          "glass rounded-2xl p-5 border",
          action.border,
          action.glow
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground uppercase tracking-widest">
              AI Decision
            </p>
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center",
                  action.bg
                )}
              >
                <ActionIcon className={cn("w-6 h-6", action.color)} />
              </div>
              <div>
                <p
                  className={cn(
                    "text-3xl font-bold tracking-tight",
                    action.color
                  )}
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {action.label}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <TrendIcon className={cn("w-3 h-3", trend.color)} />
                  <span className={cn("text-xs font-medium", trend.color)}>
                    {trend.label}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Confidence ring */}
          <div className="flex flex-col items-center gap-1">
            <ConfidenceRing value={insight.confidence} color={action.color} />
            <p className="text-[10px] text-muted-foreground">confidence</p>
          </div>
        </div>

        {/* Summary */}
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed border-t border-white/[0.06] pt-4">
          {insight.summary}
        </p>
      </div>

      {/* ── Price Targets ──────────────────────────────────── */}
      {(insight.entry_price || insight.target_price || insight.stop_loss) && (
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "Entry", value: insight.entry_price, color: "text-cyan-400" },
            { label: "Target", value: insight.target_price, color: "text-green-400" },
            { label: "Stop Loss", value: insight.stop_loss, color: "text-red-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="glass rounded-xl p-3 text-center space-y-1">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{label}</p>
              <p className={cn("text-sm font-bold font-mono", value ? color : "text-muted-foreground/40")}>
                {value ? `$${value.toLocaleString()}` : "—"}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Risk + Timeframe ──────────────────────────────── */}
      <div className="grid grid-cols-2 gap-2">
        <div className="glass rounded-xl p-3 flex items-center gap-2.5">
          <Shield className={cn("w-4 h-4 shrink-0", risk.color)} />
          <div>
            <p className="text-[10px] text-muted-foreground">Risk Level</p>
            <p className={cn("text-xs font-semibold capitalize", risk.color)}>
              {insight.risk_level}
            </p>
          </div>
        </div>
        {insight.timeframe && (
          <div className="glass rounded-xl p-3 flex items-center gap-2.5">
            <Clock className="w-4 h-4 shrink-0 text-cyan-400" />
            <div>
              <p className="text-[10px] text-muted-foreground">Timeframe</p>
              <p className="text-xs font-semibold text-foreground">{insight.timeframe}</p>
            </div>
          </div>
        )}
      </div>

      {/* ── Key Factors ───────────────────────────────────── */}
      {insight.key_factors?.length > 0 && (
        <div className="glass rounded-2xl p-4 space-y-3">
          <p className="text-xs font-semibold text-foreground flex items-center gap-2">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            Key Factors
          </p>
          <ul className="space-y-2">
            {insight.key_factors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 mt-1.5 shrink-0" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Risk Factors ──────────────────────────────────── */}
      {insight.risk_factors?.length > 0 && (
        <div className="glass rounded-2xl p-4 space-y-3">
          <p className="text-xs font-semibold text-foreground flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />
            Risk Factors
          </p>
          <ul className="space-y-2">
            {insight.risk_factors.map((factor, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-orange-400 mt-1.5 shrink-0" />
                {factor}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Recommendation ────────────────────────────────── */}
      {insight.recommendation && (
        <div className="glass rounded-2xl p-4 border border-cyan-400/10">
          <p className="text-xs font-semibold text-cyan-400 mb-2">
            AI Recommendation
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {insight.recommendation}
          </p>
        </div>
      )}

      {/* ── Technical Indicators ──────────────────────────── */}
      {insight.technical_indicators && insight.technical_indicators.length > 0 && (
        <div className="glass rounded-2xl p-4 space-y-3">
          <p className="text-xs font-semibold text-foreground flex items-center gap-2">
            <BarChart2 className="w-3.5 h-3.5 text-violet-400" />
            Technical Indicators
          </p>
          <div className="grid grid-cols-2 gap-2">
            {insight.technical_indicators.map((indicator) => (
              <div
                key={indicator.name}
                className="flex items-center justify-between bg-white/[0.02] rounded-lg px-2.5 py-2"
              >
                <span className="text-[10px] text-muted-foreground">{indicator.name}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono font-medium text-foreground">
                    {indicator.value}
                  </span>
                  <div
                    className={cn(
                      "w-1.5 h-1.5 rounded-full",
                      indicator.signal === "bullish"
                        ? "bg-green-400"
                        : indicator.signal === "bearish"
                        ? "bg-red-400"
                        : "bg-yellow-400"
                    )}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Confidence Ring SVG ───────────────────────────────────────────────────────

function ConfidenceRing({
  value,
  color,
}: {
  value: number;
  color: string;
}) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;

  const strokeColor =
    color === "text-green-400"
      ? "#22c55e"
      : color === "text-red-400"
      ? "#ef4444"
      : "#eab308";

  return (
    <div className="relative w-14 h-14">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 48 48">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth="4"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            filter: `drop-shadow(0 0 4px ${strokeColor}88)`,
            transition: "stroke-dashoffset 0.8s ease",
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span
          className={cn("text-sm font-bold", color)}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {value}
        </span>
      </div>
    </div>
  );
}
