"use client";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { paymentService, type PointsBundle } from "@/services/payment.service";
import { QUERY_KEYS } from "@/lib/constants";

export function usePayment() {
  const checkoutMutation = useMutation({
    mutationFn: (bundle: PointsBundle) =>
      paymentService.redirectToCheckout(bundle),
    onError: (error: Error) => {
      toast.error("Payment failed", { description: error.message });
    },
  });

  return {
    checkout: checkoutMutation.mutate,
    isRedirecting: checkoutMutation.isPending,
    redirectingId: checkoutMutation.isPending
      ? (checkoutMutation.variables as PointsBundle)?.id
      : null,
  };
}

export function usePaymentHistory() {
  return useQuery({
    queryKey: QUERY_KEYS.paymentHistory,
    queryFn: paymentService.getHistory,
    staleTime: 1000 * 60 * 5,
  });
}
