"use client";

import { useQuery } from "@tanstack/react-query";

import type { MeActivityRequestInterface } from "@/domain/interfaces";
import { getMeActivity } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import { QUERY_KEYS } from "@/shared/constants";

import { ME_QUERY_OPTIONS } from "./me-query-options";

export function useMeActivityQuery(params: MeActivityRequestInterface = {}) {
  const token = useAuthStore((state) => state.session?.token);

  return useQuery({
    queryKey: QUERY_KEYS.me.activity(params),
    queryFn: () => getMeActivity(params),
    select: (response) => response.data,
    enabled: Boolean(token),
    ...ME_QUERY_OPTIONS,
  });
}
