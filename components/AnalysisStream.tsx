"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnalysisStreamProps {
  text: string;
  speed?: number;        // ms per character
  onComplete?: () => void;
  className?: string;
}

/**
 * Animates text appearing character-by-character — like ChatGPT streaming.
 * Ready to be swapped for a real WebSocket stream.
 */
export function AnalysisStream({
  text,
  speed = 12,
  onComplete,
  className,
}: AnalysisStreamProps) {
  const [displayed, setDisplayed] = useState("");
  const indexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    indexRef.current = 0;
    setDisplayed("");

    const tick = () => {
      if (indexRef.current >= text.length) {
        onComplete?.();
        return;
      }
      setDisplayed(text.slice(0, indexRef.current + 1));
      indexRef.current += 1;
      timerRef.current = setTimeout(tick, speed);
    };

    timerRef.current = setTimeout(tick, speed);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [text, speed, onComplete]);

  return (
    <p className={cn("text-sm text-muted-foreground leading-relaxed", className)}>
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-0.5 h-4 bg-cyan-400 ml-0.5 animate-pulse align-middle" />
      )}
    </p>
  );
}
