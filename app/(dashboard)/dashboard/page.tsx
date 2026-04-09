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
  { coin: "Bitcoin",  symbol: "BTC", mode: "SCALPER"      as const, label: "⚡ BTC Scalp"    },
  { coin: "Ethereum", symbol: "ETH", mode: "SWING"         as const, label: "📈 ETH Swing"    },
  { coin: "Solana",   symbol: "SOL", mode: "CONSERVATIVE"  as const, label: "🛡️ SOL Conservative" },
  { coin: "BNB",      symbol: "BNB", mode: "SWING"         as const, label: "📈 BNB Swing"    },
];

export default function DashboardPage() {
  const { points } = useAuthStore();
  const bottomRef = useRef<HTMLDivElement>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const { data: sessionData } = useSession();
  const user = sessionData?.user; 

  const { analyze, taskResult, isLoading, isCompleted, pollingState, attempts, reset } =
    useAnalyze();

  // Recent history for quick reference
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

  const isIdle = !hasSubmitted;
  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "morning" : greetingHour < 18 ? "afternoon" : "evening";

  return (
    <div className="flex flex-col h-[calc(100vh-3.5rem)] lg:h-[calc(100vh-3.5rem)]">
      {/* ── Scrollable area ─────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto">
        {isIdle ? (
          /* ─── Welcome / idle screen ─────────────────────── */
          <div className="max-w-xl mx-auto px-4 py-10 space-y-8">
            {/* Greeting */}
            <div className="text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-400/20 to-violet-400/20 border border-cyan-400/20 flex items-center justify-center mx-auto">
                <Brain className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <h1
                  className="text-xl font-bold text-foreground"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Good {greeting}
                  {user?.name ? `, ${user.name.split(" ")[0]}` : ""}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  Pick a coin and strategy to start your analysis
                </p>
              </div>
              {/* Points pill */}
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 text-xs transition-all hover:bg-cyan-400/10"
              >
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span className="text-cyan-400 font-semibold">{points}</span>
                <span className="text-muted-foreground">pts · 10 per analysis</span>
              </Link>
            </div>

            {/* Quick prompts */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium">
                Quick start
              </p>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={`${prompt.symbol}-${prompt.mode}`}
                    onClick={() => handleQuickPrompt(prompt)}
                    disabled={isLoading || points < 10}
                    className="flex items-center gap-2.5 p-3.5 glass rounded-xl border border-white/[0.07] hover:border-white/[0.14] hover:bg-white/[0.04] transition-all text-left group disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-lg leading-none">{prompt.label.split(" ")[0]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">
                        {prompt.symbol}
                      </p>
                      <p className={cn("text-[10px] mt-0.5", getModeColor(prompt.mode).split(" ")[0])}>
                        {prompt.mode}
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/30 group-hover:text-muted-foreground/60 transition-colors" />
                  </button>
                ))}
              </div>
            </div>

            {/* Recent history preview */}
            {!historyLoading && historyData && historyData.items.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-muted-foreground font-medium">Recent analyses</p>
                  <Link
                    href="/history"
                    className="text-xs text-cyan-400 hover:text-cyan-300 transition-colors flex items-center gap-0.5"
                  >
                    View all <ChevronRight className="w-3 h-3" />
                  </Link>
                </div>
                <div className="space-y-1.5">
                  {historyData.items.slice(0, 3).map((item) => {
                    const action = item.result?.action;
                    const actionColor =
                      action === "LONG"  ? "text-green-400" :
                      action === "SHORT" ? "text-red-400" :
                      action === "WAIT"  ? "text-yellow-400" : "text-muted-foreground";
                    return (
                      <Link
                        key={item.task_id}
                        href="/history"
                        className="flex items-center gap-3 px-3.5 py-2.5 glass rounded-xl border border-white/[0.06] hover:border-white/[0.12] transition-all group"
                      >
                        <div className="w-7 h-7 rounded-lg glass flex items-center justify-center text-[10px] font-bold text-foreground shrink-0">
                          {item.coin_symbol.slice(0, 3)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">{item.coin}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-2.5 h-2.5 text-muted-foreground/50" />
                            <span className="text-[10px] text-muted-foreground">
                              {formatRelativeTime(item.created_at)}
                            </span>
                          </div>
                        </div>
                        {action && (
                          <span className={cn("text-xs font-bold", actionColor)}>
                            {action}
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}

            {historyLoading && (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium">Recent analyses</p>
                {[...Array(3)].map((_, i) => <SkeletonCard key={i} lines={1} />)}
              </div>
            )}
          </div>
        ) : (
          /* ─── Result / polling screen ──────────────────── */
          <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
            {/* Polling status bar */}
            {isLoading && (
              <div className="flex items-center gap-3 px-4 py-3 glass rounded-xl border border-cyan-400/15 animate-fade-in">
                <Loader variant="dots" size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground">
                    AI is analyzing your request
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Attempt {attempts} · polling every 2s
                  </p>
                </div>
                <div className="shrink-0 flex items-center gap-1">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-cyan-400 animate-bounce"
                      style={{
                        height: `${8 + i * 4}px`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Result card */}
            {taskResult && (
              <div className="animate-fade-in">
                <ResultCard task={taskResult} />
              </div>
            )}

            {/* Post-completion actions */}
            {isCompleted && (
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleReset}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.08] text-xs text-muted-foreground hover:text-foreground hover:border-white/[0.16] transition-all"
                >
                  <RefreshCcw className="w-3.5 h-3.5" />
                  New analysis
                </button>
                <Link
                  href="/history"
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/[0.08] text-xs text-muted-foreground hover:text-foreground hover:border-white/[0.16] transition-all"
                >
                  <History className="w-3.5 h-3.5" />
                  View history
                </Link>
              </div>
            )}

            <div ref={bottomRef} className="h-1" />
          </div>
        )}
      </div>

      {/* ── Sticky bottom input ─────────────────────────────── */}
      <div className="shrink-0 border-t border-white/[0.05] bg-background/80 backdrop-blur-xl px-4 py-3 pb-safe">
        <div className="max-w-2xl mx-auto">
          <ChatInput
            onSubmit={handleAnalyze}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}
