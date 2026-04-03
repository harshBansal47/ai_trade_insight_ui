import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  iconColor?: string;
  iconBg?: string;
  label: string;
  value: string | number;
  sub?: string;
  trend?: { value: string; up: boolean };
  className?: string;
}

export default function StatCard({
  icon: Icon,
  iconColor = "text-cyan-400",
  iconBg = "bg-cyan-400/10",
  label,
  value,
  sub,
  trend,
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-2xl p-5 border border-white/[0.07] hover:border-white/[0.12] transition-all duration-200",
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={cn(
            "w-9 h-9 rounded-xl flex items-center justify-center shrink-0",
            iconBg
          )}
        >
          <Icon className={cn("w-4.5 h-4.5", iconColor)} />
        </div>
        {trend && (
          <span
            className={cn(
              "text-[10px] font-semibold px-1.5 py-0.5 rounded-md",
              trend.up
                ? "text-green-400 bg-green-400/10"
                : "text-red-400 bg-red-400/10"
            )}
          >
            {trend.up ? "↑" : "↓"} {trend.value}
          </span>
        )}
      </div>

      <div className="mt-4 space-y-0.5">
        <p
          className="text-2xl font-bold text-foreground"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {value}
        </p>
        <p className="text-xs text-muted-foreground">{label}</p>
        {sub && <p className="text-[10px] text-muted-foreground/50">{sub}</p>}
      </div>
    </div>
  );
}
