"use client";

import { cn } from "@/lib/utils";

interface LoaderProps {
  size?: "sm" | "md" | "lg";
  variant?: "spinner" | "dots" | "pulse" | "orbit";
  label?: string;
  className?: string;
}

export function Loader({
  size = "md",
  variant = "orbit",
  label,
  className,
}: LoaderProps) {
  const sizes = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-16 h-16",
  };

  if (variant === "spinner") {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <div
          className={cn(
            "border-2 border-transparent border-t-cyan-400 rounded-full animate-spin",
            sizes[size]
          )}
        />
        {label && (
          <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
        )}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        {label && <span className="ml-2 text-sm text-muted-foreground">{label}</span>}
      </div>
    );
  }

  if (variant === "pulse") {
    return (
      <div className={cn("flex flex-col items-center gap-3", className)}>
        <div className={cn("relative", sizes[size])}>
          <div className="absolute inset-0 rounded-full bg-cyan-400/30 animate-ping" />
          <div className="relative rounded-full bg-cyan-400/60 w-full h-full" />
        </div>
        {label && (
          <p className="text-sm text-muted-foreground animate-pulse">{label}</p>
        )}
      </div>
    );
  }

  // orbit — default
  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div className={cn("relative", sizes[size])}>
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border border-cyan-400/20" />
        {/* Orbiting dot */}
        <div className="absolute inset-0 animate-spin" style={{ animationDuration: "1.5s" }}>
          <div className="w-2 h-2 rounded-full bg-cyan-400 absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 shadow-[0_0_8px_rgba(0,212,255,0.8)]" />
        </div>
        {/* Inner dot */}
        <div className="absolute inset-[30%] rounded-full bg-cyan-400/20 animate-pulse" />
      </div>
      {label && (
        <p className="text-sm text-muted-foreground">{label}</p>
      )}
    </div>
  );
}

// ── Full-page skeleton loader ─────────────────────────────────────────────────

export function PageLoader() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-6">
        <div className="relative w-20 h-20">
          <div className="absolute inset-0 rounded-full border-2 border-cyan-400/10 animate-spin-slow" />
          <div
            className="absolute inset-2 rounded-full border border-cyan-400/30 animate-spin"
            style={{ animationDuration: "2s", animationDirection: "reverse" }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl">⚡</span>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <p className="text-sm font-medium text-foreground">CryptoAI Insights</p>
          <p className="text-xs text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    </div>
  );
}

// ── Shimmer skeleton ──────────────────────────────────────────────────────────

export function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="glass rounded-xl p-5 space-y-3">
      <div className="h-4 w-1/3 shimmer rounded-md" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="h-3 shimmer rounded-md"
          style={{ width: `${100 - i * 10}%` }}
        />
      ))}
    </div>
  );
}
