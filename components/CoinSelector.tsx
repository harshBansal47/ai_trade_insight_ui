"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import COINS_DATA from "@/data/coins.json";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
}

const COINS: Coin[] = COINS_DATA;

/* ─────────────────────────────────────────────────────────────
   Logo strategy (priority order):
   1. cryptocurrency-icons CDN  — instant, no request, ~500 major coins
   2. CoinGecko /coins/{id}     — free, no API key, 10 000+ coins
   3. Letter-avatar fallback    — always works
───────────────────────────────────────────────────────────── */
const CDN_URL = (symbol: string) =>
  `https://cdn.jsdelivr.net/npm/cryptocurrency-icons@0.18.1/svg/color/${symbol.toLowerCase()}.svg`;

const GECKO_URL = (id: string) =>
  `https://api.coingecko.com/api/v3/coins/${id}?localization=false&tickers=false&market_data=false&community_data=false&developer_data=false`;

// Module-level cache: persists across re-renders, cleared on page reload
const logoCache = new Map<string, string | null>();

function useCoinLogo(symbol: string, id: string) {
  const cdnSrc = CDN_URL(symbol);
  const [src, setSrc] = useState<string>(cdnSrc);
  const [failed, setFailed] = useState(false); // true = no logo at all

  const handleCdnError = () => {
    // CDN didn't have this coin — try CoinGecko
    if (logoCache.has(id)) {
      const cached = logoCache.get(id);
      cached ? setSrc(cached) : setFailed(true);
      return;
    }

    fetch(GECKO_URL(id))
      .then((r) => r.json())
      .then((data) => {
        const url: string | null =
          data?.image?.small ?? data?.image?.thumb ?? null;
        logoCache.set(id, url);
        if (url) setSrc(url);
        else setFailed(true);
      })
      .catch(() => {
        logoCache.set(id, null);
        setFailed(true);
      });
  };

  const handleImgError = () => {
    // Called when the CoinGecko URL itself also fails
    setFailed(true);
  };

  return { src, failed, handleCdnError, handleImgError, cdnSrc };
}

/* ── Coin Avatar ────────────────────────────────────────────── */
function CoinAvatar({
  symbol,
  id,
  size = "md",
}: {
  symbol: string;
  id: string;
  size?: "sm" | "md";
}) {
  const { src, failed, handleCdnError, handleImgError, cdnSrc } =
    useCoinLogo(symbol, id);
  const dim = size === "sm" ? "w-6 h-6 text-[10px]" : "w-8 h-8 text-[11px]";

  if (failed) {
    return (
      <div
        className={cn(
          "rounded-full flex items-center justify-center font-bold shrink-0",
          "bg-white/[0.08] text-muted-foreground border border-white/[0.10]",
          dim
        )}
      >
        {symbol.slice(0, 2)}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={symbol}
      // If this is still the CDN url → try CoinGecko; otherwise → letter avatar
      onError={src === cdnSrc ? handleCdnError : handleImgError}
      className={cn(
        "rounded-full object-contain shrink-0 bg-white/[0.06] p-0.5",
        dim
      )}
    />
  );
}

/* ── Props ────────────────────────────────────────────────────*/
interface CoinSelectorProps {
  value: Coin | null;
  onChange: (coin: Coin | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

/* ── Component ────────────────────────────────────────────────*/
export default function CoinSelector({
  value,
  onChange,
  placeholder = "Select a coin…",
  disabled = false,
}: CoinSelectorProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query
    ? COINS.filter(
      (c) =>
        c.name.toLowerCase().includes(query.toLowerCase()) ||
        c.symbol.toLowerCase().includes(query.toLowerCase())
    )
    : COINS;

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">

      {/* ── Trigger ── */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => !disabled && setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            setOpen((v) => !v);
          }
        }}
        className={cn(
          "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200 text-left cursor-pointer",
          "bg-white/[0.03] hover:bg-white/[0.05]",
          open
            ? "border-cyan-400/40 shadow-[0_0_0_3px_rgba(0,212,255,0.08)]"
            : "border-white/[0.08] hover:border-white/[0.18]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {value ? (
          <>
            <CoinAvatar symbol={value.symbol} id={value.id} size="sm" />
            <div className="flex-1 min-w-0 flex items-center  gap-2">
              <span className="font-semibold text-foreground truncate">
                {value.name}
              </span>
              <span className="inline-flex items-center text-xs mt-1 rounded-full">
               ({value.symbol}USDT)
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="shrink-0 w-6 h-6 flex items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-white/[0.08] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="flex-1 text-muted-foreground/60">{placeholder}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground/50 transition-transform duration-200 shrink-0",
                open && "rotate-180"
              )}
            />
          </>
        )}
      </div>

      {/* ── Dropdown (opens upward) ── */}
      {open && (
        <div
          className="absolute bottom-full left-0 right-0 mb-2 z-50 rounded-2xl border border-white/[0.12] shadow-[0_-20px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-in"
          style={{ backgroundColor: "hsl(var(--background))" }}
        >
          {/* Search */}
          <div className="p-2.5 border-b border-white/[0.07]">
            <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.04] rounded-xl border border-white/[0.07]">
              <Search className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name or symbol…"
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/40 outline-none"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-muted-foreground/50 hover:text-muted-foreground transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Result count while searching */}
          {query && (
            <p className="px-4 py-1.5 text-[11px] text-muted-foreground/50 border-b border-white/[0.04]">
              {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{query}&quot;
            </p>
          )}

          {/* List */}
          <div className="max-h-56 overflow-y-auto py-1.5 px-1.5">
            {filtered.length === 0 ? (
              <div className="text-center py-8 space-y-1">
                <p className="text-sm text-muted-foreground">No coins found</p>
                <p className="text-xs text-muted-foreground/50">
                  Add it to{" "}
                  <code className="text-cyan-400/70">data/coins.json</code>
                </p>
              </div>
            ) : (
              filtered.map((coin) => {
                const isSelected = value?.id === coin.id;
                return (
                  <button
                    key={coin.id}
                    type="button"
                    onClick={() => {
                      onChange(coin);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                      isSelected
                        ? "bg-cyan-400/10 border border-cyan-400/20"
                        : "hover:bg-white/[0.05] border border-transparent"
                    )}
                  >
                    <CoinAvatar symbol={coin.symbol} id={coin.id} size="md" />
                    <span className="flex-1 font-medium text-foreground text-left">
                      {coin.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {coin.symbol}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-white/[0.05]">
            <p className="text-[11px] text-muted-foreground/40 text-center">
              {COINS.length} coins · edit{" "}
              <code className="text-muted-foreground/60">data/coins.json</code>{" "}
              to add more
            </p>
          </div>
        </div>
      )}
    </div>
  );
}