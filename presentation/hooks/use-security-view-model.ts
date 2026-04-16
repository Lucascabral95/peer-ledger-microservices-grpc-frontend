"use client";

import type { SecurityViewModel } from "@/domain/models";
import { useAuthStore } from "@/lib/store";
import { buildSecurityViewModel } from "@/shared/utils";

interface UseSecurityViewModelResult {
  security: SecurityViewModel;
  isMissingSession: boolean;
}

export function useSecurityViewModel(): UseSecurityViewModelResult {
  const session = useAuthStore((state) => state.session);

  return {
    security: buildSecurityViewModel(session),
    isMissingSession: !session?.token,
  };
}
