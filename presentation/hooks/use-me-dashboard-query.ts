"use client";

import { useQuery } from "@tanstack/react-query";

import { getMeDashboard } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import { QUERY_KEYS } from "@/shared/constants";

import { ME_QUERY_OPTIONS } from "./me-query-options";

export function useMeDashboardQuery() {
  const token = useAuthStore((state) => state.session?.token);

  return useQuery({
    queryKey: QUERY_KEYS.me.dashboard(),
    queryFn: getMeDashboard,
    select: (response) => response.data,
    enabled: Boolean(token),
    ...ME_QUERY_OPTIONS,
  });
}
