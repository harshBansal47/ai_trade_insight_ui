// ── App ───────────────────────────────────────────────────────────────────────

export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "CryptoAI Insights";
export const APP_URL  = process.env.NEXT_PUBLIC_APP_URL  ?? "http://localhost:3000";

// ── API ───────────────────────────────────────────────────────────────────────

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000";

// ── Points ────────────────────────────────────────────────────────────────────

export const POINTS_PER_QUERY     = Number(process.env.NEXT_PUBLIC_POINTS_PER_QUERY   ?? 10);
export const FREE_SIGNUP_POINTS   = Number(process.env.NEXT_PUBLIC_FREE_SIGNUP_POINTS ?? 50);
export const POINTS_BUNDLE_SIZE   = Number(process.env.NEXT_PUBLIC_POINTS_BUNDLE_SIZE ?? 50);
export const POINTS_BUNDLE_PRICE  = Number(process.env.NEXT_PUBLIC_POINTS_PRICE_USD   ?? 5);
export const LOW_POINTS_THRESHOLD = 20;

// ── Polling ───────────────────────────────────────────────────────────────────

export const POLL_INTERVAL_MS  = Number(process.env.NEXT_PUBLIC_POLL_INTERVAL_MS  ?? 2000);
export const POLL_MAX_ATTEMPTS = Number(process.env.NEXT_PUBLIC_POLL_MAX_ATTEMPTS ?? 60);

// ── Trading modes ─────────────────────────────────────────────────────────────

export const TRADING_MODES = ["SCALPER", "SWING", "CONSERVATIVE"] as const;
export type TradingMode = (typeof TRADING_MODES)[number];

// ── Auth ──────────────────────────────────────────────────────────────────────

export const AUTH_COOKIE_NAME  = "auth-token";
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

// ── Routes ────────────────────────────────────────────────────────────────────

export const PROTECTED_ROUTES = ["/dashboard", "/history", "/pricing", "/settings", "/profile"];
export const AUTH_ROUTES      = ["/auth"];

// ── Query keys ────────────────────────────────────────────────────────────────

export const QUERY_KEYS = {
  profile:        ["profile"] as const,
  history:        ["history"] as const,
  historyItem:    (id: string) => ["history", id] as const,
  taskStatus:     (id: string) => ["task", id] as const,
  paymentHistory: ["payment-history"] as const,
} as const;
