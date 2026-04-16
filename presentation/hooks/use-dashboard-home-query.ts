"use client";

import type { DashboardHomeModel } from "@/domain/models";
import { useAuthStore } from "@/lib/store";
import { buildDashboardHomeModelFromMeDashboard } from "@/shared/utils";

import { useMeDashboardQuery } from "./use-me-dashboard-query";

interface UseDashboardHomeQueryResult {
  dashboard: DashboardHomeModel | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  refetchAll: () => Promise<void>;
  hasPartialData: boolean;
  isHistoryUnavailable: boolean;
  isMissingSession: boolean;
}

export function useDashboardHomeQuery(): UseDashboardHomeQueryResult {
  const session = useAuthStore((state) => state.session);
  const dashboardQuery = useMeDashboardQuery();
  const isMissingSession = !session?.token;

  const dashboard = dashboardQuery.data
    ? buildDashboardHomeModelFromMeDashboard({
        dashboard: dashboardQuery.data,
        token: session?.token,
      })
    : null;

  const isLoading = Boolean(session?.token) && dashboardQuery.isPending;
  const isError = Boolean(session?.token) && dashboardQuery.isError;
  const errorMessage = getQueryErrorMessage(dashboardQuery.error);

  const refetchAll = async () => {
    await dashboardQuery.refetch();
  };

  return {
    dashboard,
    isLoading,
    isError,
    errorMessage,
    refetchAll,
    hasPartialData: false,
    isHistoryUnavailable: false,
    isMissingSession,
  };
}

function getQueryErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "No se pudo cargar el dashboard principal.";
}
