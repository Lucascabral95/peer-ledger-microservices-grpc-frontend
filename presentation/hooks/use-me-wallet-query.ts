"use client";

import { useQuery } from "@tanstack/react-query";

import { getMeWallet } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import { QUERY_KEYS } from "@/shared/constants";

import { ME_QUERY_OPTIONS } from "./me-query-options";

export function useMeWalletQuery() {
  const token = useAuthStore((state) => state.session?.token);

  return useQuery({
    queryKey: QUERY_KEYS.me.wallet(),
    queryFn: getMeWallet,
    select: (response) => response.data,
    enabled: Boolean(token),
    ...ME_QUERY_OPTIONS,
  });
}
