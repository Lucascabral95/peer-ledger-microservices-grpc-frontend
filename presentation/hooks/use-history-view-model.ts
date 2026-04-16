"use client";

import { useState } from "react";

import type { MeActivityKind } from "@/domain/interfaces";
import type { HistoryViewModel } from "@/domain/models";
import { useAuthStore } from "@/lib/store";
import { HISTORY_PAGE_SIZE } from "@/shared/constants";
import { buildHistoryViewModel } from "@/shared/utils";

import { useMeActivityQuery } from "./use-me-activity-query";

interface HistoryFiltersState {
  kind: MeActivityKind;
  page: number;
  pageSize: number;
  from: string;
  to: string;
}

interface UseHistoryViewModelResult {
  history: HistoryViewModel | null;
  filters: HistoryFiltersState;
  setKind: (kind: MeActivityKind) => void;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  nextPage: () => void;
  previousPage: () => void;
  resetFilters: () => void;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  isMissingSession: boolean;
  refetch: () => Promise<void>;
}

export function useHistoryViewModel(): UseHistoryViewModelResult {
  const token = useAuthStore((state) => state.session?.token);
  const [filters, setFilters] = useState<HistoryFiltersState>({
    kind: "all",
    page: 1,
    pageSize: HISTORY_PAGE_SIZE,
    from: "",
    to: "",
  });
  const activityQuery = useMeActivityQuery({
    kind: filters.kind,
    page: filters.page,
    page_size: filters.pageSize,
    from: filters.from,
    to: filters.to,
  });
  const history = activityQuery.data
    ? buildHistoryViewModel(activityQuery.data)
    : null;

  const setKind = (kind: MeActivityKind) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      kind,
      page: 1,
    }));
  };

  const setFrom = (from: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      from,
      page: 1,
    }));
  };

  const setTo = (to: string) => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      to,
      page: 1,
    }));
  };

  const nextPage = () => {
    if (!history?.pagination.hasNext) {
      return;
    }

    setFilters((currentFilters) => ({
      ...currentFilters,
      page: currentFilters.page + 1,
    }));
  };

  const previousPage = () => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      page: Math.max(1, currentFilters.page - 1),
    }));
  };

  const resetFilters = () => {
    setFilters({
      kind: "all",
      page: 1,
      pageSize: HISTORY_PAGE_SIZE,
      from: "",
      to: "",
    });
  };

  const refetch = async () => {
    await activityQuery.refetch();
  };

  return {
    history,
    filters,
    setKind,
    setFrom,
    setTo,
    nextPage,
    previousPage,
    resetFilters,
    isLoading: Boolean(token) && activityQuery.isPending,
    isError: Boolean(token) && activityQuery.isError,
    errorMessage: getHookErrorMessage(
      activityQuery.error,
      "No se pudo cargar el historial.",
    ),
    isMissingSession: !token,
    refetch,
  };
}

function getHookErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return fallback;
}
