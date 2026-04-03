"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { taskService, type TaskStatusResponse } from "@/services/task.service";
import { POLL_INTERVAL_MS, POLL_MAX_ATTEMPTS } from "@/lib/api";

export type PollingState = "idle" | "polling" | "completed" | "failed" | "timeout";

interface UsePollingOptions {
  onComplete?: (result: TaskStatusResponse) => void;
  onError?: (error: Error) => void;
  intervalMs?: number;
  maxAttempts?: number;
}

interface UsePollingReturn {
  taskResult: TaskStatusResponse | null;
  pollingState: PollingState;
  attempts: number;
  startPolling: (taskId: string) => void;
  stopPolling: () => void;
  reset: () => void;
}

export function usePolling(options: UsePollingOptions = {}): UsePollingReturn {
  const {
    onComplete,
    onError,
    intervalMs = POLL_INTERVAL_MS,
    maxAttempts = POLL_MAX_ATTEMPTS,
  } = options;

  const [taskResult, setTaskResult] = useState<TaskStatusResponse | null>(null);
  const [pollingState, setPollingState] = useState<PollingState>("idle");
  const [attempts, setAttempts] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const taskIdRef = useRef<string | null>(null);
  const attemptsRef = useRef(0);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      clearPolling();
    };
  }, []);

  const clearPolling = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stopPolling = useCallback(() => {
    clearPolling();
    if (isMountedRef.current) {
      setPollingState((prev) =>
        prev === "polling" ? "idle" : prev
      );
    }
  }, [clearPolling]);

  const poll = useCallback(async () => {
    const taskId = taskIdRef.current;
    if (!taskId || !isMountedRef.current) return;

    attemptsRef.current += 1;

    if (attemptsRef.current > maxAttempts) {
      clearPolling();
      if (isMountedRef.current) {
        setPollingState("timeout");
        onError?.(new Error("Analysis timed out. Please try again."));
      }
      return;
    }

    if (isMountedRef.current) {
      setAttempts(attemptsRef.current);
    }

    try {
      const result = await taskService.getTaskStatus(taskId);

      if (!isMountedRef.current) return;

      setTaskResult(result);

      if (result.status === "completed") {
        clearPolling();
        setPollingState("completed");
        onComplete?.(result);
      } else if (result.status === "failed") {
        clearPolling();
        setPollingState("failed");
        onError?.(new Error(result.error || "Analysis failed"));
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      clearPolling();
      setPollingState("failed");
      onError?.(err instanceof Error ? err : new Error("Polling error"));
    }
  }, [clearPolling, maxAttempts, onComplete, onError]);

  const startPolling = useCallback(
    (taskId: string) => {
      clearPolling();
      taskIdRef.current = taskId;
      attemptsRef.current = 0;
      setAttempts(0);
      setTaskResult(null);
      setPollingState("polling");

      // Poll immediately, then on interval
      poll();
      intervalRef.current = setInterval(poll, intervalMs);
    },
    [clearPolling, poll, intervalMs]
  );

  const reset = useCallback(() => {
    clearPolling();
    taskIdRef.current = null;
    attemptsRef.current = 0;
    setAttempts(0);
    setTaskResult(null);
    setPollingState("idle");
  }, [clearPolling]);

  return { taskResult, pollingState, attempts, startPolling, stopPolling, reset };
}
