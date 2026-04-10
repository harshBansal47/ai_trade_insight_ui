"use client";

import { useState } from "react";
import {
  ArrowDownRight, ArrowUpRight, ChevronRight,
  Clock, History, Minus, Search, X, SlidersHorizontal,
  Zap, TrendingUp, Shield,
} from "lucide-react";
import { cn, formatRelativeTime, getModeColor } from "@/lib/utils";
import { useHistory } from "@/hooks/useHistory";
import type { HistoryItem, TradingMode } from "@/services/task.service";
import ResultCard from "@/components/ResultCard";
import EmptyState from "@/components/EmptyState";
import { SkeletonCard } from "@/components/Loader";
import { useDebounce } from "@/hooks/useDebounce";

/* ── Config ────────────────────────────────────────────────── */
const ACTION_CFG = {
  LONG:  { icon: ArrowUpRight,   color: "text-emerald-400", bg: "bg-emerald-400/10", border: "border-emerald-400/20" },
  SHORT: { icon: ArrowDownRight, color: "text-red-400",     bg: "bg-red-400/10",     border: "border-red-400/20"    },
  WAIT:  { icon: Minus,          color: "text-amber-400",   bg: "bg-amber-400/10",   border: "border-amber-400/20"  },
} as const;

const MODE_FILTERS: { label: string; value: TradingMode | null; Icon?: React.ElementType }[] = [
  { label: "All",          value: null           },
  { label: "Scalper",      value: "SCALPER",      Icon: Zap        },
  { label: "Swing",        value: "SWING",        Icon: TrendingUp },
  { label: "Conservative", value: "CONSERVATIVE", Icon: Shield     },
];

/* ── History Row ───────────────────────────────────────────── */
function HistoryRow({
  item,
  selected,
  onClick,
}: {
  item:     HistoryItem;
  selected: boolean;
  onClick:  () => void;
}) {
  const action = item.result?.action as keyof typeof ACTION_CFG | undefined;
  const cfg    = action ? ACTION_CFG[action] : null;
  const Icon   = cfg?.icon;

  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3.5 px-4 py-3.5 text-left transition-all duration-150 group border-b border-white/[0.04] last:border-0",
        selected
          ? "bg-cyan-400/[0.05] border-l-2 border-l-cyan-400"
          : "hover:bg-white/[0.03] border-l-2 border-l-transparent"
      )}
    >
      {/* Coin avatar */}
      <div className={cn(
        "w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 text-[11px] font-bold border transition-colors",
        selected
          ? "bg-cyan-400/10 border-cyan-400/25 text-cyan-400"
          : "bg-white/[0.05] border-white/[0.08] text-muted-foreground group-hover:border-white/[0.14]"
      )}>
        {item.coin_symbol.slice(0, 3)}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-foreground truncate leading-tight">
          {item.coin}
        </p>
        <div className="flex items-center gap-2 mt-1">
          <span className={cn(
            "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
            item.mode === "SCALPER"     ? "bg-amber-400/10  text-amber-400" :
            item.mode === "SWING"       ? "bg-cyan-400/10   text-cyan-400" :
                                          "bg-emerald-400/10 text-emerald-400"
          )}>
            {item.mode}
          </span>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/50">
            <Clock className="w-2.5 h-2.5" />
            {formatRelativeTime(item.created_at)}
          </div>
        </div>
      </div>

      {/* Action badge */}
      <div className="shrink-0">
        {cfg && Icon ? (
          <div className={cn(
            "flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold border",
            cfg.bg, cfg.color, cfg.border
          )}>
            <Icon className="w-3.5 h-3.5" />
            {action}
          </div>
        ) : (
          <span className={cn(
            "text-[10px] px-2 py-1 rounded-lg font-medium",
            item.status === "completed" ? "bg-emerald-400/10 text-emerald-400" :
            item.status === "failed"    ? "bg-red-400/10 text-red-400" :
                                          "bg-blue-400/10 text-blue-400"
          )}>
            {item.status}
          </span>
        )}
      </div>

      <ChevronRight className={cn(
        "w-3.5 h-3.5 shrink-0 transition-all",
        selected
          ? "text-cyan-400 translate-x-0.5"
          : "text-muted-foreground/20 group-hover:text-muted-foreground/50"
      )} />
    </button>
  );
}

/* ── Page ───────────────────────────────────────────────────── */
export default function HistoryPage() {
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [rawSearch,    setRawSearch]    = useState("");
  const [modeFilter,   setModeFilter]   = useState<TradingMode | null>(null);
  const [mobileDetail, setMobileDetail] = useState(false);

  const search  = useDebounce(rawSearch, 250);
  const { data, isLoading, isError, refetch } = useHistory();

  const items    = data?.items ?? [];
  const filtered = items.filter((item) => {
    const matchSearch =
      !search ||
      item.coin.toLowerCase().includes(search.toLowerCase()) ||
      item.coin_symbol.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (!modeFilter || item.mode === modeFilter);
  });

  const selectedItem = filtered.find((i) => i.task_id === selectedId);
  const isFiltered   = !!search || !!modeFilter;

  const handleSelect = (id: string) => {
    setSelectedId(selectedId === id ? null : id);
    setMobileDetail(true);
  };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">

      {/* ── List panel ── */}
      <div className={cn(
        "flex flex-col w-full lg:w-[22rem] shrink-0 border-r border-white/[0.06]",
        mobileDetail && selectedItem ? "hidden lg:flex" : "flex"
      )}>

        {/* Header */}
        <div className="px-5 pt-5 pb-4 space-y-4 border-b border-white/[0.06]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-cyan-400/10 flex items-center justify-center">
                <History className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <h1 className="text-base font-bold text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                History
              </h1>
            </div>
            {data && (
              <span className="text-xs font-medium text-muted-foreground bg-white/[0.05] border border-white/[0.07] px-2.5 py-1 rounded-full">
                {data.total} total
              </span>
            )}
          </div>

          {/* Search */}
          <div className={cn(
            "flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border transition-all",
            rawSearch
              ? "border-cyan-400/30 bg-cyan-400/[0.03]"
              : "border-white/[0.08] bg-white/[0.02] focus-within:border-cyan-400/25"
          )}>
            <Search className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
            <input
              type="text"
              value={rawSearch}
              onChange={(e) => setRawSearch(e.target.value)}
              placeholder="Search by coin…"
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
            />
            {rawSearch && (
              <button onClick={() => setRawSearch("")} className="text-muted-foreground/50 hover:text-muted-foreground transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Mode filters */}
          <div className="flex items-center gap-1.5">
            <SlidersHorizontal className="w-3 h-3 text-muted-foreground/40 shrink-0" />
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {MODE_FILTERS.map(({ label, value, Icon }) => (
                <button
                  key={label}
                  onClick={() => setModeFilter(value)}
                  className={cn(
                    "shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap border",
                    modeFilter === value
                      ? "bg-cyan-400/10 text-cyan-400 border-cyan-400/25"
                      : "text-muted-foreground border-transparent hover:text-foreground hover:bg-white/[0.05]"
                  )}
                >
                  {Icon && <Icon className="w-3 h-3" />}
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto">
          {isLoading && (
            <div className="p-3 space-y-1.5">
              {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} lines={2} />)}
            </div>
          )}

          {isError && (
            <div className="py-12 text-center space-y-3 px-6">
              <p className="text-sm font-medium text-foreground">Failed to load history</p>
              <p className="text-xs text-muted-foreground">Something went wrong on our end.</p>
              <button
                onClick={() => refetch()}
                className="text-xs text-cyan-400 hover:text-cyan-300 font-medium underline underline-offset-2"
              >
                Try again
              </button>
            </div>
          )}

          {!isLoading && !isError && filtered.length === 0 && (
            <div className="p-4">
              <EmptyState
                icon={isFiltered ? undefined : History}
                emoji={isFiltered ? "🔍" : undefined}
                title={isFiltered ? "No results found" : "No analyses yet"}
                description={
                  isFiltered
                    ? "Try adjusting your search or filters"
                    : "Run your first analysis to see results here"
                }
                action={
                  isFiltered
                    ? { label: "Clear filters", onClick: () => { setRawSearch(""); setModeFilter(null); } }
                    : { label: "Start analyzing →", href: "/dashboard" }
                }
              />
            </div>
          )}

          {filtered.map((item) => (
            <HistoryRow
              key={item.task_id}
              item={item}
              selected={selectedId === item.task_id}
              onClick={() => handleSelect(item.task_id)}
            />
          ))}
        </div>
      </div>

      {/* ── Detail panel ── */}
      <div className={cn(
        "flex-col flex-1 overflow-y-auto",
        mobileDetail && selectedItem ? "flex" : "hidden lg:flex"
      )}>
        {selectedItem ? (
          <div className="p-6 space-y-5 max-w-2xl mx-auto w-full">
            {/* Mobile back */}
            <button
              onClick={() => { setMobileDetail(false); setSelectedId(null); }}
              className="lg:hidden flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to list
            </button>

            <ResultCard
              task={{
                task_id:      selectedItem.task_id,
                coin:         selectedItem.coin,
                coin_symbol:  selectedItem.coin_symbol,
                mode:         selectedItem.mode,
                status:       selectedItem.status,
                result:       selectedItem.result,
                created_at:   selectedItem.created_at,
                completed_at: selectedItem.completed_at,
              }}
            />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center space-y-3 px-6">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center mx-auto">
                <History className="w-6 h-6 text-muted-foreground/40" />
              </div>
              <p className="text-base font-semibold text-foreground">Select an analysis</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Click any item in the list to view its full AI insight and signals
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}