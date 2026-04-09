"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  logo?: string;
}

const COINS: Coin[] = [
  { id: "bitcoin",              symbol: "BTC",  name: "Bitcoin"           },
  { id: "ethereum",             symbol: "ETH",  name: "Ethereum"          },
  { id: "binancecoin",          symbol: "BNB",  name: "BNB"               },
  { id: "solana",               symbol: "SOL",  name: "Solana"            },
  { id: "xrp",                  symbol: "XRP",  name: "XRP"               },
  { id: "cardano",              symbol: "ADA",  name: "Cardano"           },
  { id: "avalanche-2",          symbol: "AVAX", name: "Avalanche"         },
  { id: "dogecoin",             symbol: "DOGE", name: "Dogecoin"          },
  { id: "polkadot",             symbol: "DOT",  name: "Polkadot"          },
  { id: "chainlink",            symbol: "LINK", name: "Chainlink"         },
  { id: "polygon",              symbol: "MATIC",name: "Polygon"           },
  { id: "uniswap",              symbol: "UNI",  name: "Uniswap"           },
  { id: "litecoin",             symbol: "LTC",  name: "Litecoin"          },
  { id: "tron",                 symbol: "TRX",  name: "TRON"              },
  { id: "stellar",              symbol: "XLM",  name: "Stellar"           },
  { id: "the-open-network",     symbol: "TON",  name: "Toncoin"           },
  { id: "sui",                  symbol: "SUI",  name: "Sui"               },
  { id: "aptos",                symbol: "APT",  name: "Aptos"             },
  { id: "injective-protocol",   symbol: "INJ",  name: "Injective"         },
  { id: "arbitrum",             symbol: "ARB",  name: "Arbitrum"          },
  { id: "optimism",             symbol: "OP",   name: "Optimism"          },
  { id: "near",                 symbol: "NEAR", name: "NEAR Protocol"     },
  { id: "internet-computer",    symbol: "ICP",  name: "Internet Computer" },
  { id: "hedera-hashgraph",     symbol: "HBAR", name: "Hedera"            },
  { id: "render-token",         symbol: "RNDR", name: "Render"            },
];

const COIN_COLORS: Record<string, string> = {
  BTC:  "#F7931A", ETH:  "#627EEA", BNB:  "#F3BA2F", SOL:  "#9945FF",
  XRP:  "#00AAE4", ADA:  "#0033AD", AVAX: "#E84142", DOGE: "#C2A633",
  DOT:  "#E6007A", LINK: "#2A5ADA", MATIC:"#8247E5", UNI:  "#FF007A",
  LTC:  "#345D9D", TRX:  "#EB0029", XLM:  "#7B68EE", TON:  "#0098EA",
  SUI:  "#4DA2FF", APT:  "#00C2FF", INJ:  "#00F2FE", ARB:  "#28A0F0",
  OP:   "#FF0420", NEAR: "#00C08B", ICP:  "#29ABE2", HBAR: "#8A8A8A",
  RNDR: "#FF4D00",
};

interface CoinSelectorProps {
  value: Coin | null;
  onChange: (coin: Coin | null) => void;
  placeholder?: string;
  disabled?: boolean;
}

export default function CoinSelector({
  value,
  onChange,
  placeholder = "Select a coin…",
  disabled = false,
}: CoinSelectorProps) {
  const [open, setOpen]   = useState(false);
  const [query, setQuery] = useState("");
  const containerRef      = useRef<HTMLDivElement>(null);
  const inputRef          = useRef<HTMLInputElement>(null);

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
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const coinColor = value ? (COIN_COLORS[value.symbol] ?? "#00D4FF") : "#00D4FF";

  return (
    <div ref={containerRef} className="relative w-full">

      {/* ── Trigger button ── */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          "w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm transition-all duration-200 text-left",
          "bg-white/[0.03] hover:bg-white/[0.05]",
          open
            ? "border-cyan-400/40 shadow-[0_0_0_3px_rgba(0,212,255,0.08)]"
            : "border-white/[0.08] hover:border-white/[0.18]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {value ? (
          <>
            {/* Avatar */}
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
              style={{
                background: `${coinColor}20`,
                border: `1.5px solid ${coinColor}50`,
                color: coinColor,
              }}
            >
              {value.symbol.slice(0, 2)}
            </div>

            <div className="flex-1 min-w-0">
              <span className="font-semibold text-foreground text-sm">{value.name}</span>
              <span className="ml-2 text-xs text-muted-foreground">{value.symbol}</span>
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
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div
          className="absolute bottom-full left-0 right-0 mb-2 z-50 rounded-2xl border border-white/[0.12] shadow-[0_20px_60px_rgba(0,0,0,0.6)] overflow-hidden animate-fade-in"
          /*
           * ✅ KEY FIX: solid background on the dropdown.
           * Using inline style so it overrides any global "glass" or
           * transparency inherited from parent stacking contexts.
           * Never use `glass` / backdrop-blur on floating overlays —
           * it makes background text bleed through.
           */
          style={{ backgroundColor: "hsl(var(--background))" }}
        >
          {/* Search bar */}
          <div className="p-2.5 border-b border-white/[0.07]">
            <div className="flex items-center gap-2.5 px-3 py-2 bg-white/[0.04] rounded-xl border border-white/[0.07]">
              <Search className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search coins…"
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

          {/* Coin list */}
          <div className="max-h-56 overflow-y-auto py-1.5 px-1.5">
            {filtered.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground py-6">
                No coins found for &quot;{query}&quot;
              </p>
            ) : (
              filtered.map((coin) => {
                const color      = COIN_COLORS[coin.symbol] ?? "#00D4FF";
                const isSelected = value?.id === coin.id;
                return (
                  <button
                    key={coin.id}
                    type="button"
                    onClick={() => { onChange(coin); setOpen(false); setQuery(""); }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors",
                      isSelected
                        ? "bg-cyan-400/10 border border-cyan-400/20"
                        : "hover:bg-white/[0.05] border border-transparent"
                    )}
                  >
                    {/* Coin avatar */}
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{
                        background: `${color}20`,
                        border: `1.5px solid ${color}50`,
                        color,
                      }}
                    >
                      {coin.symbol.slice(0, 2)}
                    </div>

                    {/* Name + symbol */}
                    <span className="flex-1 font-medium text-foreground text-left">
                      {coin.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{coin.symbol}</span>

                    {/* Selected checkmark */}
                    {isSelected && (
                      <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}