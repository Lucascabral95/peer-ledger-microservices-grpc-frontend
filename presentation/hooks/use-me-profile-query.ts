"use client";

import { useQuery } from "@tanstack/react-query";

import { getMeProfile } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import { QUERY_KEYS } from "@/shared/constants";

import { ME_QUERY_OPTIONS } from "./me-query-options";

export function useMeProfileQuery() {
  const token = useAuthStore((state) => state.session?.token);

  return useQuery({
    queryKey: QUERY_KEYS.me.profile(),
    queryFn: getMeProfile,
    select: (response) => response.data,
    enabled: Boolean(token),
    ...ME_QUERY_OPTIONS,
  });
}
