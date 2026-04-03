"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { taskService } from "@/services/task.service";
import { QUERY_KEYS } from "@/lib/constants";

/** Fetch full history (up to 50 items) */
export function useHistory(perPage = 50) {
  return useQuery({
    queryKey: QUERY_KEYS.history,
    queryFn: () => taskService.getHistory({ per_page: perPage }),
    staleTime: 1000 * 30, // 30 seconds
  });
}

/** Infinite scroll version for large history lists */
export function useInfiniteHistory(perPage = 20) {
  return useInfiniteQuery({
    queryKey: [...QUERY_KEYS.history, "infinite"],
    queryFn: ({ pageParam = 1 }) =>
      taskService.getHistory({ page: pageParam as number, per_page: perPage }),
    getNextPageParam: (lastPage) => {
      const totalPages = Math.ceil(lastPage.total / perPage);
      return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
    },
    initialPageParam: 1,
    staleTime: 1000 * 30,
  });
}

/** Single task by ID */
export function useTaskResult(taskId: string | null) {
  return useQuery({
    queryKey: QUERY_KEYS.taskStatus(taskId ?? ""),
    queryFn: () => taskService.getTaskStatus(taskId!),
    enabled: !!taskId,
    staleTime: Infinity, // completed tasks never change
  });
}
