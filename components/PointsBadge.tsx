"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/useAuthStore";
import { POINTS_PER_QUERY } from "@/lib/api";

interface PointsBadgeProps {
  className?: string;
  showLink?: boolean;
  size?: "sm" | "md";
}

export default function PointsBadge({
  className,
  showLink = true,
  size = "md",
}: PointsBadgeProps) {
  const { points } = useAuthStore();

  const isLow     = points <= POINTS_PER_QUERY;
  const isCritical = points === 0;

  const badge = (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium transition-all",
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs",
        isCritical
          ? "border-red-400/30 bg-red-400/8 text-red-400 animate-pulse"
          : isLow
          ? "border-yellow-400/30 bg-yellow-400/8 text-yellow-400"
          : "border-cyan-400/20 bg-cyan-400/6 text-cyan-400",
        className
      )}
    >
      <Sparkles className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />
      <span>{points}</span>
      <span className="text-current opacity-60">pts</span>
    </div>
  );

  if (!showLink) return badge;

  return (
    <Link href="/pricing" className="hover:opacity-80 transition-opacity">
      {badge}
    </Link>
  );
}
