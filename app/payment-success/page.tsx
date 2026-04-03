"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { paymentService } from "@/services/payment.service";
import { useAuthStore } from "@/store/useAuthStore";
import { cn } from "@/lib/utils";

export default function PaymentSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const { addPoints } = useAuthStore();
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pointsAdded, setPointsAdded] = useState(0);
  const [newBalance, setNewBalance] = useState(0);

  useEffect(() => {
    const sessionId = params.get("session_id");
    if (!sessionId) {
      router.replace("/pricing");
      return;
    }

    (async () => {
      try {
        const result = await paymentService.verifySession(sessionId);
        if (result.success) {
          addPoints(result.points_added);
          setPointsAdded(result.points_added);
          setNewBalance(result.new_balance);
          setVerified(true);
          toast.success(`${result.points_added} points added to your account!`);
        }
      } catch {
        toast.error("Could not verify payment. Contact support.");
      } finally {
        setLoading(false);
      }
    })();
  }, [params, router, addPoints]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />
      <div className="fixed inset-0 bg-gradient-radial from-green-500/[0.06] to-transparent pointer-events-none" />

      <div className="relative max-w-md w-full text-center space-y-6 animate-fade-in">
        {loading ? (
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-10 h-10 text-cyan-400 animate-spin" />
            <p className="text-sm text-muted-foreground">Verifying your payment...</p>
          </div>
        ) : verified ? (
          <>
            {/* Success icon */}
            <div className="flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
                <div className="relative w-20 h-20 rounded-full bg-green-400/10 border border-green-400/30 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1
                className="text-3xl font-bold text-foreground"
                style={{ fontFamily: "var(--font-display)" }}
              >
                Payment successful!
              </h1>
              <p className="text-sm text-muted-foreground">
                Your points have been credited instantly.
              </p>
            </div>

            {/* Points added card */}
            <div className="glass rounded-2xl p-6 border border-green-400/20 bg-green-400/[0.03] space-y-4">
              <div className="flex items-center justify-center gap-3">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span
                  className="text-4xl font-bold gradient-text-green"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  +{pointsAdded}
                </span>
                <span className="text-muted-foreground">points</span>
              </div>
              <div className="h-px bg-white/[0.06]" />
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">New balance</span>
                <span className="font-semibold text-foreground">{newBalance} pts</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Analyses available</span>
                <span className="font-semibold text-cyan-400">{Math.floor(newBalance / 10)}</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-cyan-400 text-black font-semibold text-sm hover:bg-cyan-300 transition-all shadow-[0_0_16px_rgba(0,212,255,0.3)]"
              >
                <Sparkles className="w-4 h-4" />
                Start analyzing
              </Link>
              <Link
                href="/pricing"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                View billing history →
              </Link>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Payment verification failed. Please contact support.
            </p>
            <Link
              href="/pricing"
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium",
                "border border-white/[0.1] text-muted-foreground hover:text-foreground hover:border-white/[0.2]"
              )}
            >
              Back to pricing
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
