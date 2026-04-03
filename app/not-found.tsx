import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="fixed inset-0 bg-grid pointer-events-none opacity-40" />

      <div className="relative text-center space-y-6 max-w-sm animate-fade-in">
        <div className="space-y-2">
          <p
            className="text-8xl font-bold gradient-text"
            style={{ fontFamily: "var(--font-display)" }}
          >
            404
          </p>
          <h1 className="text-xl font-semibold text-foreground">
            Page not found
          </h1>
          <p className="text-sm text-muted-foreground">
            This page doesn&apos;t exist or was moved. Let&apos;s get you back on track.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 items-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-black text-sm font-semibold hover:bg-cyan-300 transition-all shadow-[0_0_16px_rgba(0,212,255,0.3)]"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
