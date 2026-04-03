import { apiClient } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

export type TradingMode = "SCALPER" | "SWING" | "CONSERVATIVE";

export type TaskStatus = "pending" | "processing" | "completed" | "failed";
export type TaskAction = "LONG" | "SHORT" | "WAIT";

export interface AnalyzeRequest {
  coin: string;
  coin_symbol: string;
  mode: TradingMode;
  message?: string;
}

export interface AnalyzeResponse {
  task_id: string;
  status: TaskStatus;
  message: string;
}

export interface AIInsight {
  summary: string;
  sentiment: "bullish" | "bearish" | "neutral";
  confidence: number;
  entry_price?: number;
  target_price?: number;
  stop_loss?: number;
  timeframe?: string;
  risk_level: "low" | "medium" | "high";
  signals: Signal[];
  action: TaskAction;
  recommendation: string;
  market_analysis: string;
  technical_indicators?: TechnicalIndicator[];
}

export interface Signal {
  type: "buy" | "sell" | "hold";
  strength: "weak" | "moderate" | "strong";
  description: string;
}

export interface TechnicalIndicator {
  name: string;
  value: string;
  signal: "bullish" | "bearish" | "neutral";
}

export interface TaskStatusResponse {
  task_id: string;
  status: TaskStatus;
  coin: string;
  coin_symbol: string;
  mode: TradingMode;
  message?: string;
  result?: AIInsight;
  error?: string;
  created_at: string;
  completed_at?: string;
  points_deducted?: number;
}

export interface HistoryItem {
  task_id: string;
  coin: string;
  coin_symbol: string;
  mode: TradingMode;
  status: TaskStatus;
  result?: AIInsight;
  created_at: string;
  completed_at?: string;
}



export interface HistoryResponse {
  items: HistoryItem[];
  total: number;
  page: number;
  per_page: number;
}

// ── Task Service ─────────────────────────────────────────────────────────────

export const taskService = {
  /**
   * Submit a new analysis request — returns task_id
   */
  analyze: async (data: AnalyzeRequest): Promise<AnalyzeResponse> => {
    const response = await apiClient.post<AnalyzeResponse>("/analyze", data);
    return response.data;
  },

  /**
   * Poll task status by task_id
   */
  getTaskStatus: async (taskId: string): Promise<TaskStatusResponse> => {
    const response = await apiClient.get<TaskStatusResponse>(
      `/task-status/${taskId}`
    );
    return response.data;
  },

  /**
   * Get user query history with pagination
   */
  getHistory: async (params?: {
    page?: number;
    per_page?: number;
  }): Promise<HistoryResponse> => {
    const response = await apiClient.get<HistoryResponse>("/history", {
      params: { page: 1, per_page: 20, ...params },
    });
    return response.data;
  },

  /**
   * Get a single historical task by id
   */
  getHistoryItem: async (taskId: string): Promise<TaskStatusResponse> => {
    const response = await apiClient.get<TaskStatusResponse>(
      `/history/${taskId}`
    );
    return response.data;
  },
};
