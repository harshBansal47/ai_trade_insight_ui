import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function formatRelativeTime(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(dateString);
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

export function getModeColor(mode: string): string {
  const colors: Record<string, string> = {
    SCALPER: "text-orange-400 bg-orange-400/10 border-orange-400/20",
    SWING: "text-cyan-400 bg-cyan-400/10 border-cyan-400/20",
    CONSERVATIVE: "text-green-400 bg-green-400/10 border-green-400/20",
  };
  return colors[mode] || "text-gray-400 bg-gray-400/10 border-gray-400/20";
}

export function getModeIcon(mode: string): string {
  const icons: Record<string, string> = {
    SCALPER: "⚡",
    SWING: "📈",
    CONSERVATIVE: "🛡️",
  };
  return icons[mode] || "📊";
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending: "text-yellow-400 bg-yellow-400/10",
    processing: "text-blue-400 bg-blue-400/10",
    completed: "text-green-400 bg-green-400/10",
    failed: "text-red-400 bg-red-400/10",
  };
  return colors[status] || "text-gray-400 bg-gray-400/10";
}
