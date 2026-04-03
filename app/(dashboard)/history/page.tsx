"use client";

import { useState } from "react";
import { ArrowDownRight, ArrowUpRight, ChevronRight, Clock, History, Minus, Search, X } from "lucide-react";
import { cn, formatRelativeTime, getModeColor } from "@/lib/utils";
import { useHistory } from "@/hooks/useHistory";
import type { HistoryItem, TradingMode } from "@/services/task.service";
import ResultCard from "@/components/ResultCard";
import EmptyState from "@/components/EmptyState";
import { SkeletonCard } from "@/components/Loader";
import { useDebounce } from "@/hooks/useDebounce";

const ACTION_CFG = {
  LONG:  { icon: ArrowUpRight,   color: "text-green-400",  bg: "bg-green-400/10",  border: "border-green-400/20"  },
  SHORT: { icon: ArrowDownRight, color: "text-red-400",    bg: "bg-red-400/10",    border: "border-red-400/20"    },
  WAIT:  { icon: Minus,          color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/20" },
} as const;

const MODE_FILTERS: { label: string; value: TradingMode | null }[] = [
  { label: "All",          value: null },
  { label: "⚡ Scalper",   value: "SCALPER" },
  { label: "📈 Swing",     value: "SWING" },
  { label: "🛡️ Conservative", value: "CONSERVATIVE" },
];

function HistoryRow({ item, selected, onClick }: { item: HistoryItem; selected: boolean; onClick: () => void }) {
  const action = item.result?.action as keyof typeof ACTION_CFG | undefined;
  const cfg = action ? ACTION_CFG[action] : null;
  const Icon = cfg?.icon;
  return (
    <button onClick={onClick}
      className={cn("w-full flex items-center gap-3 p-3.5 rounded-xl text-left transition-all duration-200 group",
        selected ? "bg-white/[0.07] border border-white/[0.12]" : "hover:bg-white/[0.04] border border-transparent")}>
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-[11px] font-bold text-foreground glass",
        selected && "border border-white/[0.12]")}>
        {item.coin_symbol.slice(0, 3)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground truncate">{item.coin}</span>
          <span className={cn("shrink-0 text-[10px] px-1.5 py-0.5 rounded-md border font-medium", getModeColor(item.mode))}>
            {item.mode}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-muted-foreground/40" />
          <span className="text-[10px] text-muted-foreground/60">{formatRelativeTime(item.created_at)}</span>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        {cfg && Icon ? (
          <div className={cn("flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-bold border", cfg.bg, cfg.color, cfg.border)}>
            <Icon className="w-3.5 h-3.5" />{action}
          </div>
        ) : (
          <span className={cn("text-[10px] px-2 py-1 rounded-lg font-medium",
            item.status==="completed"?"bg-green-400/10 text-green-400":item.status==="failed"?"bg-red-400/10 text-red-400":"bg-blue-400/10 text-blue-400")}>
            {item.status}
          </span>
        )}
        <ChevronRight className={cn("w-4 h-4 transition-all", selected?"text-foreground rotate-90":"text-muted-foreground/25 group-hover:text-muted-foreground/60")} />
      </div>
    </button>
  );
}

export default function HistoryPage() {
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [rawSearch,    setRawSearch]    = useState("");
  const [modeFilter,   setModeFilter]   = useState<TradingMode | null>(null);
  const [mobileDetail, setMobileDetail] = useState(false);

  const search = useDebounce(rawSearch, 250);
  const { data, isLoading, isError, refetch } = useHistory();

  const items    = data?.items ?? [];
  const filtered = items.filter((item) => {
    const matchSearch = !search
      || item.coin.toLowerCase().includes(search.toLowerCase())
      || item.coin_symbol.toLowerCase().includes(search.toLowerCase());
    return matchSearch && (!modeFilter || item.mode === modeFilter);
  });
  const selectedItem = filtered.find((i) => i.task_id === selectedId);
  const isFiltered   = !!search || !!modeFilter;

  const handleSelect = (id: string) => { setSelectedId(selectedId===id?null:id); setMobileDetail(true); };

  return (
    <div className="flex h-[calc(100vh-3.5rem)]">
      {/* List panel */}
      <div className={cn("flex flex-col border-r border-white/[0.05] w-full lg:w-96",
        mobileDetail && selectedItem ? "hidden lg:flex" : "flex")}>
        <div className="px-4 pt-5 pb-3 border-b border-white/[0.05] space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-cyan-400" />
              <h1 className="text-sm font-semibold" style={{ fontFamily: "var(--font-display)" }}>Analysis History</h1>
            </div>
            {data && <span className="text-[10px] text-muted-foreground bg-white/[0.05] px-2 py-0.5 rounded-full">{data.total} total</span>}
          </div>
          <div className={cn("flex items-center gap-2 px-3 py-2 rounded-xl border bg-white/[0.03] transition-all",
            rawSearch ? "border-cyan-400/30" : "border-white/[0.07] focus-within:border-cyan-400/25")}>
            <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <input type="text" value={rawSearch} onChange={(e) => setRawSearch(e.target.value)} placeholder="Search by coin..."
              className="flex-1 bg-transparent text-xs text-foreground placeholder:text-muted-foreground/40 outline-none" />
            {rawSearch && <button onClick={() => setRawSearch("")} className="text-muted-foreground/50 hover:text-muted-foreground"><X className="w-3 h-3" /></button>}
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {MODE_FILTERS.map(({ label, value }) => (
              <button key={label} onClick={() => setModeFilter(value)}
                className={cn("shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-medium transition-all whitespace-nowrap",
                  modeFilter===value ? "bg-cyan-400/15 text-cyan-400 border border-cyan-400/30"
                    : "text-muted-foreground hover:text-foreground bg-white/[0.03] hover:bg-white/[0.06] border border-transparent")}>
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {isLoading && Array.from({length:6}).map((_,i) => <SkeletonCard key={i} lines={2} />)}
          {isError && (
            <div className="py-8 text-center space-y-3">
              <p className="text-sm text-muted-foreground">Failed to load history</p>
              <button onClick={() => refetch()} className="text-xs text-cyan-400 hover:text-cyan-300">Try again</button>
            </div>
          )}
          {!isLoading && !isError && filtered.length === 0 && (
            <EmptyState icon={isFiltered ? undefined : History}
              emoji={isFiltered ? "🔍" : undefined}
              title={isFiltered ? "No results found" : "No analyses yet"}
              description={isFiltered ? "Try adjusting your search or filters" : "Run your first analysis to see results here"}
              action={isFiltered
                ? { label: "Clear filters", onClick: () => { setRawSearch(""); setModeFilter(null); } }
                : { label: "Start analyzing →", href: "/dashboard" }} />
          )}
          {filtered.map((item) => (
            <HistoryRow key={item.task_id} item={item} selected={selectedId===item.task_id} onClick={() => handleSelect(item.task_id)} />
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className={cn("flex-col flex-1 overflow-y-auto", mobileDetail && selectedItem ? "flex" : "hidden lg:flex")}>
        {selectedItem ? (
          <div className="p-5 lg:p-6 space-y-4">
            <button onClick={() => { setMobileDetail(false); setSelectedId(null); }}
              className="lg:hidden flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mb-2">
              <ChevronRight className="w-3.5 h-3.5 rotate-180" /> Back to list
            </button>
            <ResultCard task={{ task_id: selectedItem.task_id, coin: selectedItem.coin, coin_symbol: selectedItem.coin_symbol,
              mode: selectedItem.mode, status: selectedItem.status, result: selectedItem.result,
              created_at: selectedItem.created_at, completed_at: selectedItem.completed_at }} />
          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <EmptyState icon={History} title="Select an analysis" description="Click any item in the list to view its full AI insight" />
          </div>
        )}
      </div>
    </div>
  );
}
