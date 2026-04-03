import type { TaskStatusResponse, HistoryItem } from "@/services/task.service";

// ── Mock AI insight result ────────────────────────────────────────────────────

export const MOCK_INSIGHT: TaskStatusResponse = {
  task_id:      "mock-task-001",
  status:       "completed",
  coin:         "Bitcoin",
  coin_symbol:  "BTC",
  mode:         "SWING",
  created_at:   new Date(Date.now() - 30000).toISOString(),
  completed_at: new Date().toISOString(),
  points_deducted: 10,
  result: {
    action:     "LONG",
    confidence: 78,
    trend:      "UPTREND",
    summary:
      "Bitcoin is showing strong bullish momentum on the 4H chart with price holding above the 200 EMA. " +
      "RSI is at 62, leaving room to run before overbought territory. Volume profile supports continuation.",
    key_factors: [
      "Price broke above key resistance at $67,400 with volume confirmation",
      "BTC dominance rising — risk-off capital rotating to Bitcoin",
      "4H MACD crossed bullish above signal line",
      "On-chain: Exchange outflows increasing (accumulation signal)",
    ],
    risk_factors: [
      "Fed meeting this week — macro uncertainty remains",
      "Funding rates elevated on perpetuals — potential for short squeeze unwind",
      "Resistance zone at $71,000 may cause consolidation",
    ],
    entry_price:  67800,
    target_price: 72500,
    stop_loss:    65200,
    timeframe:    "4H–1D",
    risk_level:   "medium",
    recommendation:
      "Consider a staged entry — 50% at current price, 50% on a pullback to $66,500. " +
      "Set stop below the recent swing low at $65,200. Target the $71K–$72.5K resistance zone.",
    signals: [
      { type: "buy",  strength: "strong",   description: "MACD bullish crossover on 4H" },
      { type: "buy",  strength: "moderate", description: "RSI reclaimed 60 from below" },
      { type: "hold", strength: "weak",     description: "Weekly still below ATH — caution" },
    ],
    technical_indicators: [
      { name: "RSI (14)",    value: "62.4",   signal: "bullish" },
      { name: "MACD",        value: "+245",   signal: "bullish" },
      { name: "EMA 200",     value: "$63,100",signal: "bullish" },
      { name: "Bollinger",   value: "Upper",  signal: "neutral" },
      { name: "Volume",      value: "+34%",   signal: "bullish" },
      { name: "Funding Rate",value: "0.012%", signal: "bearish" },
    ],
    market_analysis:
      "The broader crypto market is in a risk-on phase following positive macro data. " +
      "BTC is the primary beneficiary as institutional flows continue.",
  },
};

// ── Mock history ─────────────────────────────────────────────────────────────

export const MOCK_HISTORY: HistoryItem[] = [
  {
    task_id:      "mock-001",
    coin:         "Bitcoin",
    coin_symbol:  "BTC",
    mode:         "SWING",
    status:       "completed",
    created_at:   new Date(Date.now() - 3600000).toISOString(),
    completed_at: new Date(Date.now() - 3590000).toISOString(),
    result:       MOCK_INSIGHT.result,
  },
  {
    task_id:     "mock-002",
    coin:        "Ethereum",
    coin_symbol: "ETH",
    mode:        "SCALPER",
    status:      "completed",
    created_at:  new Date(Date.now() - 7200000).toISOString(),
    completed_at:new Date(Date.now() - 7190000).toISOString(),
    result: {
      ...MOCK_INSIGHT.result!,
      action:     "WAIT",
      confidence: 51,
      trend:      "SIDEWAYS",
      summary:    "ETH is range-bound between $3,400–$3,650. No clear directional edge for scalping.",
      entry_price:  undefined,
      target_price: undefined,
      stop_loss:    undefined,
    },
  },
  {
    task_id:     "mock-003",
    coin:        "Solana",
    coin_symbol: "SOL",
    mode:        "CONSERVATIVE",
    status:      "completed",
    created_at:  new Date(Date.now() - 86400000).toISOString(),
    completed_at:new Date(Date.now() - 86390000).toISOString(),
    result: {
      ...MOCK_INSIGHT.result!,
      action:       "SHORT",
      confidence:   71,
      trend:        "DOWNTREND",
      summary:      "SOL broke key support at $148. Bearish structure with lower highs / lower lows forming.",
      entry_price:  147,
      target_price: 132,
      stop_loss:    152,
    },
  },
  {
    task_id:    "mock-004",
    coin:       "BNB",
    coin_symbol:"BNB",
    mode:       "SWING",
    status:     "failed",
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
];

// ── Helper: is mock mode active ───────────────────────────────────────────────

export const IS_MOCK_MODE =
  process.env.NEXT_PUBLIC_MOCK_MODE === "true" ||
  process.env.NODE_ENV === "test";

/** Simulate async API delay */
export function mockDelay(ms = 800): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
