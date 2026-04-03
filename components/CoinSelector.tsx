"use client";

import { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  logo?: string;
}

// Top crypto coins list
const COINS: Coin[] = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "xrp", symbol: "XRP", name: "XRP" },
  { id: "cardano", symbol: "ADA", name: "Cardano" },
  { id: "avalanche-2", symbol: "AVAX", name: "Avalanche" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "polkadot", symbol: "DOT", name: "Polkadot" },
  { id: "chainlink", symbol: "LINK", name: "Chainlink" },
  { id: "polygon", symbol: "MATIC", name: "Polygon" },
  { id: "uniswap", symbol: "UNI", name: "Uniswap" },
  { id: "litecoin", symbol: "LTC", name: "Litecoin" },
  { id: "tron", symbol: "TRX", name: "TRON" },
  { id: "stellar", symbol: "XLM", name: "Stellar" },
  { id: "the-open-network", symbol: "TON", name: "Toncoin" },
  { id: "sui", symbol: "SUI", name: "Sui" },
  { id: "aptos", symbol: "APT", name: "Aptos" },
  { id: "injective-protocol", symbol: "INJ", name: "Injective" },
  { id: "arbitrum", symbol: "ARB", name: "Arbitrum" },
  { id: "optimism", symbol: "OP", name: "Optimism" },
  { id: "near", symbol: "NEAR", name: "NEAR Protocol" },
  { id: "internet-computer", symbol: "ICP", name: "Internet Computer" },
  { id: "hedera-hashgraph", symbol: "HBAR", name: "Hedera" },
  { id: "render-token", symbol: "RNDR", name: "Render" },
];

const COIN_COLORS: Record<string, string> = {
  BTC: "#F7931A",
  ETH: "#627EEA",
  BNB: "#F3BA2F",
  SOL: "#9945FF",
  XRP: "#00AAE4",
  ADA: "#0033AD",
  AVAX: "#E84142",
  DOGE: "#C2A633",
  DOT: "#E6007A",
  LINK: "#2A5ADA",
  MATIC: "#8247E5",
  UNI: "#FF007A",
  LTC: "#345D9D",
  TRX: "#EB0029",
  XLM: "#7B68EE",
  TON: "#0098EA",
  SUI: "#4DA2FF",
  APT: "#00C2FF",
  INJ: "#00F2FE",
  ARB: "#28A0F0",
  OP: "#FF0420",
  NEAR: "#00C08B",
  ICP: "#29ABE2",
  HBAR: "#222222",
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
  placeholder = "Select a coin...",
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
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const coinColor = value ? COIN_COLORS[value.symbol] || "#00D4FF" : "#00D4FF";

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => !disabled && setOpen(!open)}
        className={cn(
          "w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all duration-200 text-left",
          "bg-white/[0.03] hover:bg-white/[0.05]",
          open
            ? "border-cyan-400/40 shadow-[0_0_0_3px_rgba(0,212,255,0.1)]"
            : "border-white/[0.08] hover:border-white/[0.16]",
          disabled && "opacity-50 cursor-not-allowed"
        )}
      >
        {value ? (
          <>
            {/* Coin avatar */}
            <div
              className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
              style={{
                background: `${coinColor}22`,
                border: `1px solid ${coinColor}44`,
                color: coinColor,
              }}
            >
              {value.symbol.slice(0, 2)}
            </div>
            <span className="text-foreground font-medium">{value.name}</span>
            <span className="text-muted-foreground text-xs">{value.symbol}</span>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange(null);
              }}
              className="ml-auto text-muted-foreground hover:text-foreground"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </>
        ) : (
          <>
            <Search className="w-4 h-4 text-muted-foreground shrink-0" />
            <span className="text-muted-foreground flex-1">{placeholder}</span>
            <ChevronDown
              className={cn(
                "w-4 h-4 text-muted-foreground transition-transform",
                open && "rotate-180"
              )}
            />
          </>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-1.5 z-50 glass rounded-xl border border-white/[0.1] shadow-2xl overflow-hidden animate-fade-in">
          {/* Search input */}
          <div className="p-2 border-b border-white/[0.06]">
            <div className="flex items-center gap-2 px-2 py-1.5 bg-white/[0.03] rounded-lg">
              <Search className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search coins..."
                className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/60 outline-none"
              />
            </div>
          </div>

          {/* Coin list */}
          <div className="max-h-52 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <p className="text-center text-xs text-muted-foreground py-4">
                No coins found
              </p>
            ) : (
              filtered.map((coin) => {
                const color = COIN_COLORS[coin.symbol] || "#00D4FF";
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
                      "w-full flex items-center gap-2.5 px-3 py-2 text-sm transition-colors",
                      isSelected
                        ? "bg-cyan-400/10 text-foreground"
                        : "text-muted-foreground hover:text-foreground hover:bg-white/[0.04]"
                    )}
                  >
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                      style={{
                        background: `${color}22`,
                        border: `1px solid ${color}44`,
                        color,
                      }}
                    >
                      {coin.symbol.slice(0, 2)}
                    </div>
                    <span className="font-medium text-foreground">{coin.name}</span>
                    <span className="text-xs text-muted-foreground">{coin.symbol}</span>
                    {isSelected && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400" />
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
