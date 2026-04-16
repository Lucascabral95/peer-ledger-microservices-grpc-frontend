"use client";

import { useQuery } from "@tanstack/react-query";

import type { MeTopupsRequestInterface } from "@/domain/interfaces";
import { getMeTopups } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import { QUERY_KEYS } from "@/shared/constants";

import { ME_QUERY_OPTIONS } from "./me-query-options";

export function useMeTopupsQuery(params: MeTopupsRequestInterface = {}) {
  const token = useAuthStore((state) => state.session?.token);

  return useQuery({
    queryKey: QUERY_KEYS.me.topups(params),
    queryFn: () => getMeTopups(params),
    select: (response) => response.data,
    enabled: Boolean(token),
    ...ME_QUERY_OPTIONS,
  });
}
