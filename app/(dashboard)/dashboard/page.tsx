"use client";

import { useRef, useEffect, useState } from "react";
import {
  Brain,
  ChevronRight,
  Clock,
  History,
  RefreshCcw,
  Sparkles,
  TrendingUp,
  Zap,
  BarChart2,
  Shield,
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { useAnalyze } from "@/hooks/useAnalyze";
import { taskService } from "@/services/task.service";
import ChatInput from "@/components/ChatInput";
import ResultCard from "@/components/ResultCard";
import { Loader, SkeletonCard } from "@/components/Loader";
import type { AnalyzeRequest } from "@/services/task.service";
import { formatRelativeTime, getModeColor } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/store/useAuthStore";

const QUICK_PROMPTS = [
  {
    coin: "Bitcoin",
    symbol: "BTC",
    mode: "SCALPER" as const,
    label: "BTC Scalp",
    icon: Zap,
    color: "from-amber-500/15 to-orange-500/10 border-amber-500/20 hover:border-amber-500/40",
    iconColor: "text-amber-400",
    badgeColor: "bg-amber-500/10 text-amber-400",
  },
  {
    coin: "Ethereum",
    symbol: "ETH",
    mode: "SWING" as const,
    label: "ETH Swing",
    icon: TrendingUp,
    color: "from-violet-500/15 to-blue-500/10 border-violet-500/20 hover:border-violet-500/40",
    iconColor: "text-violet-400",
    badgeColor: "bg-violet-500/10 text-violet-400",
  },
  {
    coin: "Solana",
    symbol: "SOL",
    mode: "CONSERVATIVE" as const,
    label: "SOL Safe",
    icon: Shield,
    color: "from-cyan-500/15 to-teal-500/10 border-cyan-500/20 hover:border-cyan-500/40",
    iconColor: "text-cyan-400",
    badgeColor: "bg-cyan-500/10 text-cyan-400",
  },
  {
    coin: "BNB",
    symbol: "BNB",
    mode: "SWING" as const,
    label: "BNB Swing",
    icon: BarChart2,
    color: "from-yellow-500/15 to-amber-500/10 border-yellow-500/20 hover:border-yellow-500/40",
    iconColor: "text-yellow-400",
    badgeColor: "bg-yellow-500/10 text-yellow-400",
  },
];

const getGreeting = (hour: number) => {
  if (hour >= 5 && hour < 12) return "Good morning";
  if (hour >= 12 && hour < 17) return "Good afternoon";
  if (hour >= 17 && hour < 21) return "Good evening";
  return "Good night";
};

export default function DashboardPage() {
  const { points } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { data: sessionData } = useSession();
  const user = sessionData?.user;

  const { analyze, taskResult, isLoading, isCompleted, pollingState, attempts, reset } =
    useAnalyze();

  const { data: historyData, isLoading: historyLoading } = useQuery({
    queryKey: ["history", "recent"],
    queryFn: () => taskService.getHistory({ per_page: 4 }),
  });

  useEffect(() => {
    if (taskResult) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [taskResult]);

  const handleAnalyze = (data: AnalyzeRequest) => {
    setHasSubmitted(true);
    analyze(data);
  };

  const handleQuickPrompt = (prompt: (typeof QUICK_PROMPTS)[0]) => {
    setHasSubmitted(true);
    analyze({ coin: prompt.coin, coin_symbol: prompt.symbol, mode: prompt.mode });
  };

  const handleReset = () => {
    reset();
    setHasSubmitted(false);
  };

  const hour = new Date().getHours();
  const firstName = user?.name?.split(" ")[0];

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)]">
      {/* Scrollable area */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
        {!hasSubmitted ? (
          /* ── Idle / Welcome Screen ── */
          <div className="max-w-2xl mx-auto px-6 py-12 space-y-10">

            {/* Hero greeting */}
            <div className="space-y-5">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 via-violet-500/10 to-transparent border border-cyan-400/25 flex items-center justify-center shrink-0">
                  <Brain className="w-7 h-7 text-cyan-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold tracking-tight text-foreground leading-tight">
                    {getGreeting(hour)}{firstName ? `, ${firstName}` : ""}
                  </h1>
                  <p className="text-base text-muted-foreground mt-0.5">
                    What would you like to analyze today?
                  </p>
                </div>
              </div>

              {/* Points badge */}
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-400/20 bg-cyan-400/5 hover:bg-cyan-400/10 transition-all group"
              >
                <Sparkles className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-cyan-400">{points} points</span>
                <span className="text-sm text-muted-foreground">· 10 per analysis</span>
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40 group-hover:text-muted-foreground/70 transition-colors ml-0.5" />
              </Link>
            </div>

          
           {/* Quick prompts */}
<div className="space-y-3">
  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
    Quick Start
  </p>
  <div className="grid grid-cols-2 gap-2">
    {QUICK_PROMPTS.map((prompt) => {
      const Icon = prompt.icon;
      return (
        <button
          key={`${prompt.symbol}-${prompt.mode}`}
          onClick={() => handleQuickPrompt(prompt)}
          disabled={isLoading || points < 10}
          className={cn(
            "group flex items-center gap-3 px-3.5 py-3 rounded-2xl border bg-gradient-to-r transition-all duration-200 text-left disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]",
            prompt.color
          )}
        >
          <div className={cn("w-8 h-8 rounded-xl bg-black/20 flex items-center justify-center shrink-0", prompt.iconColor)}>
            <Icon className="w-4 h-4" strokeWidth={2} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-foreground leading-none">{prompt.symbol}</p>
            <p className={cn("text-[11px] font-medium mt-0.5", prompt.iconColor)}>{prompt.mode}</p>
          </div>
          <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground/30 group-hover:text-muted-foreground/60 group-hover:translate-x-0.5 transition-all shrink-0" />
        </button>
      );
    })}
  </div>
</div>

            {/* Recent history */}
            {historyLoading && (
              <div className="space-y-3">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Recent Analyses
                </p>
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={1} />)}
              </div>
            )}

            {!historyLoading && historyData && historyData.items.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                    Recent Analyses
                  </p>
                  <Link
                    href="/history"
                    className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
                  >
                    View all
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>

                <div className="rounded-2xl border border-white/[0.07] overflow-hidden divide-y divide-white/[0.05]">
                  {historyData.items.slice(0, 3).map((item) => {
                    const action = item.result?.action;
                    const actionStyle =
                      action === "LONG"  ? "text-emerald-400 bg-emerald-400/10" :
                      action === "SHORT" ? "text-red-400 bg-red-400/10" :
                      action === "WAIT"  ? "text-yellow-400 bg-yellow-400/10" :
                                          "text-muted-foreground bg-white/5";
                    return (
                      <Link
                        key={item.task_id}
                        href="/history"
                        className="flex items-center gap-4 px-4 py-3.5 bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl glass border border-white/[0.08] flex items-center justify-center text-xs font-bold text-foreground shrink-0">
                          {item.coin_symbol.slice(0, 3)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground">{item.coin}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3 h-3 text-muted-foreground/50" />
                            <span className="text-xs text-muted-foreground">
                              {formatRelativeTime(item.created_at)}
                            </span>
                          </div>
                        </div>
                        {action && (
                          <span className={cn("text-xs font-bold px-2.5 py-1 rounded-full shrink-0", actionStyle)}>
                            {action}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          /* ── Result / Polling Screen ── */
          <div className="max-w-2xl mx-auto px-6 py-8 space-y-5">

            {/* Status bar */}
            {isLoading && (
              <div className="flex items-center gap-4 px-5 py-4 glass rounded-2xl border border-cyan-400/15 animate-fade-in">
                <Loader variant="dots" size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">
                    AI is analyzing your request
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Attempt {attempts} · polling every 2s
                  </p>
                </div>
                <div className="shrink-0 flex items-end gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1.5 rounded-full bg-cyan-400 animate-bounce"
                      style={{ height: `${10 + i * 5}px`, animationDelay: `${i * 0.15}s` }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Result */}
            {taskResult && (
              <div className="animate-fade-in">
                <ResultCard task={taskResult} />
              </div>
            )}

            {/* Post-completion actions */}
            {isCompleted && (
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04] transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <RefreshCcw className="w-4 h-4" />
                  New Analysis
                </button>
                <Link
                  href="/history"
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-white/[0.08] hover:border-white/[0.16] hover:bg-white/[0.04] transition-all text-sm font-medium text-muted-foreground hover:text-foreground"
                >
                  <History className="w-4 h-4" />
                  View History
                </Link>
              </div>
            )}

            <div ref={bottomRef} className="h-2" />
          </div>
        )}
      </div>

      {/* Sticky bottom input */}
      <div className="shrink-0 border-t border-white/[0.06] bg-background/80 backdrop-blur-xl px-6 py-4 pb-safe">
        <div className="max-w-2xl mx-auto">
          <ChatInput onSubmit={handleAnalyze} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}