import { type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon?: LucideIcon;
  emoji?: string;
  title: string;
  description?: string;
  action?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  className?: string;
}

export default function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center py-16 px-6 space-y-4",
        className
      )}
    >
      {/* Icon / Emoji */}
      <div className="w-14 h-14 rounded-2xl glass border border-white/[0.08] flex items-center justify-center">
        {emoji ? (
          <span className="text-2xl">{emoji}</span>
        ) : Icon ? (
          <Icon className="w-7 h-7 text-muted-foreground/40" />
        ) : null}
      </div>

      {/* Text */}
      <div className="space-y-1">
        <p className="text-sm font-semibold text-foreground">{title}</p>
        {description && (
          <p className="text-xs text-muted-foreground max-w-xs leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Action */}
      {action && (
        <>
          {action.href ? (
            <a
              href={action.href}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400/10 text-cyan-400 text-xs font-medium border border-cyan-400/20 hover:bg-cyan-400/15 transition-all"
            >
              {action.label}
            </a>
          ) : (
            <button
              onClick={action.onClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-400/10 text-cyan-400 text-xs font-medium border border-cyan-400/20 hover:bg-cyan-400/15 transition-all"
            >
              {action.label}
            </button>
          )}
        </>
      )}
    </div>
  );
}
