"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { taskService, type AnalyzeRequest, type TaskStatusResponse } from "@/services/task.service";
import { useAuthStore } from "@/store/useAuthStore";
import { usePolling } from "./usePolling";
import { POINTS_PER_QUERY } from "@/lib/api";

interface UseAnalyzeOptions {
  onComplete?: (result: TaskStatusResponse) => void;
}

export function useAnalyze(options: UseAnalyzeOptions = {}) {
  const { deductPoints, points } = useAuthStore();

  const { taskResult, pollingState, attempts, startPolling, reset } =
    usePolling({
      onComplete: (result) => {
        toast.success("Analysis complete!", {
          description: `${result.coin} ${result.mode} analysis ready`,
        });
        options.onComplete?.(result);
      },
      onError: (error) => {
        toast.error("Analysis failed", { description: error.message });
      },
    });

  const analyzeMutation = useMutation({
    mutationFn: async (data: AnalyzeRequest) => {
      if (points < POINTS_PER_QUERY) {
        throw new Error(
          `Insufficient points. You need ${POINTS_PER_QUERY} points per query.`
        );
      }
      return taskService.analyze(data);
    },
    onSuccess: (data) => {
      deductPoints(POINTS_PER_QUERY);
      toast.info("Analysis started", {
        description: "Processing your request...",
      });
      startPolling(data.task_id);
    },
    onError: (error: Error) => {
      toast.error("Failed to start analysis", { description: error.message });
    },
  });

  const handleAnalyze = (data: AnalyzeRequest) => {
    reset();
    analyzeMutation.mutate(data);
  };

  const isLoading =
    analyzeMutation.isPending || pollingState === "polling";

  return {
    analyze: handleAnalyze,
    taskResult,
    pollingState,
    attempts,
    isLoading,
    isSubmitting: analyzeMutation.isPending,
    isPolling: pollingState === "polling",
    isCompleted: pollingState === "completed",
    isFailed: pollingState === "failed",
    reset,
  };
}
