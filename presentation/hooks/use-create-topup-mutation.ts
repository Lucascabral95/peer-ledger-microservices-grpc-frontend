"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createTopUp } from "@/infrastructure/services";
import { QUERY_KEYS } from "@/shared/constants";

export function useCreateTopUpMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: QUERY_KEYS.topups.create(),
    mutationFn: createTopUp,
    retry: false,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.wallet() }),
        queryClient.invalidateQueries({ queryKey: QUERY_KEYS.me.dashboard() }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "me" && query.queryKey[1] === "topups",
        }),
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey[0] === "me" && query.queryKey[1] === "activity",
        }),
      ]);
    },
  });
}
