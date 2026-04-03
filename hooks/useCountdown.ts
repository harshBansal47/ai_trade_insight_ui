"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface UseCountdownReturn {
  seconds: number;
  isRunning: boolean;
  start: (from: number) => void;
  reset: () => void;
}

/**
 * A countdown timer. Used for OTP resend cooldown.
 *
 * @example
 * const { seconds, isRunning, start } = useCountdown();
 * start(60); // counts down from 60 → 0
 */
export function useCountdown(): UseCountdownReturn {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(
    (from: number) => {
      stop();
      setSeconds(from);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => {
          if (prev <= 1) {
            stop();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    },
    [stop]
  );

  const reset = useCallback(() => {
    stop();
    setSeconds(0);
  }, [stop]);

  useEffect(() => () => stop(), [stop]);

  return { seconds, isRunning: seconds > 0, start, reset };
}
