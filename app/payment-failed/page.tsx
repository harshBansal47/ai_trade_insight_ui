"use client";

import Link from "next/link";
import { AlertCircle, ArrowLeft, RefreshCcw } from "lucide-react";

export default function PaymentFailedPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-50" />
      <div className="fixed inset-0 bg-gradient-radial from-red-500/[0.04] to-transparent pointer-events-none" />

      <div className="relative max-w-md w-full text-center space-y-6 animate-fade-in">
        {/* Error icon */}
        <div className="flex items-center justify-center">
          <div className="w-20 h-20 rounded-full bg-red-400/10 border border-red-400/20 flex items-center justify-center">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
        </div>

        <div className="space-y-2">
          <h1
            className="text-3xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Payment failed
          </h1>
          <p className="text-sm text-muted-foreground">
            Your payment was not completed. No charges were made to your account.
          </p>
        </div>

        {/* Reasons */}
        <div className="glass rounded-2xl p-5 border border-red-400/10 text-left space-y-3">
          <p className="text-xs font-semibold text-foreground">Common reasons:</p>
          <ul className="space-y-2">
            {[
              "Card was declined by your bank",
              "Insufficient funds",
              "Incorrect card details",
              "Payment was cancelled",
            ].map((reason) => (
              <li key={reason} className="flex items-center gap-2 text-xs text-muted-foreground">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400/60 shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-2.5">
          <Link
            href="/pricing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white/[0.08] text-foreground font-semibold text-sm hover:bg-white/[0.12] border border-white/[0.1] transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to dashboard
          </Link>
        </div>

        <p className="text-xs text-muted-foreground/40">
          Need help?{" "}
          <a href="mailto:support@cryptoai.com" className="text-cyan-400 hover:text-cyan-300">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
}
