"use client";

import { useEffect } from "react";
import { RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[hsl(220_20%_6%)] flex items-center justify-center px-4">
        <div className="text-center space-y-5 max-w-sm">
          <div className="w-14 h-14 rounded-2xl bg-red-400/10 border border-red-400/20 flex items-center justify-center mx-auto">
            <span className="text-2xl">⚠️</span>
          </div>
          <div className="space-y-2">
            <h2
              className="text-xl font-bold text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              Something went wrong
            </h2>
            <p className="text-sm text-gray-400">
              An unexpected error occurred. Please try refreshing the page.
            </p>
            {error.digest && (
              <p className="text-xs text-gray-600 font-mono">
                Error ID: {error.digest}
              </p>
            )}
          </div>
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 text-black text-sm font-semibold hover:bg-cyan-300 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
