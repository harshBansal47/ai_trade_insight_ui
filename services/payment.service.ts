import { apiClient } from "@/lib/api";

// ── Types ────────────────────────────────────────────────────────────────────

export type PointsBundle = {
  id: string;
  name: string;
  points: number;
  price_usd: number;
  popular?: boolean;
};

export const POINTS_BUNDLES: PointsBundle[] = [
  { id: "starter", name: "Starter", points: 50, price_usd: 5 },
  {
    id: "pro",
    name: "Pro",
    points: 150,
    price_usd: 12,
    popular: true,
  },
  { id: "elite", name: "Elite", points: 500, price_usd: 35 },
];

export interface CreateSessionRequest {
  bundle_id: string;
  points: number;
  amount_usd: number;
  success_url?: string;
  cancel_url?: string;
}

export interface CreateSessionResponse {
  session_id: string;
  checkout_url: string;
}

export interface PaymentHistoryItem {
  id: string;
  points: number;
  amount_usd: number;
  status: "completed" | "pending" | "failed";
  created_at: string;
}

// ── Payment Service ──────────────────────────────────────────────────────────

export const paymentService = {
  /**
   * Create a Stripe checkout session and redirect the user
   */
  createStripeSession: async (
    data: CreateSessionRequest
  ): Promise<CreateSessionResponse> => {
    const response = await apiClient.post<CreateSessionResponse>(
      "/create-stripe-session",
      {
        ...data,
        success_url:
          data.success_url ||
          `${process.env.NEXT_PUBLIC_APP_URL}/payment-success`,
        cancel_url:
          data.cancel_url ||
          `${process.env.NEXT_PUBLIC_APP_URL}/payment-failed`,
      }
    );
    return response.data;
  },

  /**
   * Redirect to Stripe Checkout (client-side)
   */
  redirectToCheckout: async (bundle: PointsBundle): Promise<void> => {
    const session = await paymentService.createStripeSession({
      bundle_id: bundle.id,
      points: bundle.points,
      amount_usd: bundle.price_usd,
    });
    window.location.href = session.checkout_url;
  },

  /**
   * Verify a successful payment session
   */
  verifySession: async (
    sessionId: string
  ): Promise<{ success: boolean; points_added: number; new_balance: number }> => {
    const response = await apiClient.get<{
      success: boolean;
      points_added: number;
      new_balance: number;
    }>(`/payment-verify/${sessionId}`);
    return response.data;
  },

  /**
   * Get payment history
   */
  getHistory: async (): Promise<PaymentHistoryItem[]> => {
    const response = await apiClient.get<{ items: PaymentHistoryItem[] }>(
      "/payment-history"
    );
    return response.data.items;
  },
};
