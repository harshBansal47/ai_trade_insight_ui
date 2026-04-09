// ── Re-export all service types for convenient importing ──────────────────────


export type {
  TradingMode,
  TaskStatus,
  AnalyzeRequest,
  AnalyzeResponse,
  AIInsight,
  Signal,
  TechnicalIndicator,
  TaskStatusResponse,
  HistoryItem,
  HistoryResponse,
} from "@/services/task.service";

export type {
  SignupRequest,
  LoginPasswordRequest,
  LoginOtpRequest,
  SendOtpRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  AuthResponse,
} from "@/services/auth.service";

export type {
  PointsBundle,
  CreateSessionRequest,
  CreateSessionResponse,
  PaymentHistoryItem,
} from "@/services/payment.service";

// ── UI-specific types ─────────────────────────────────────────────────────────

export type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
};

export type ToastVariant = "success" | "error" | "warning" | "info";

export type ThemeColor =
  | "cyan"
  | "green"
  | "red"
  | "yellow"
  | "orange"
  | "violet"
  | "blue";

// ── API generic wrappers ──────────────────────────────────────────────────────

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  per_page: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
