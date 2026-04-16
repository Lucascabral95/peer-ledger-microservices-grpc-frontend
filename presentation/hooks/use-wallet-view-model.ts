"use client";

import { useState } from "react";

import type { WalletTopupFormValues, WalletViewModel } from "@/domain/models";
import { useAuthStore } from "@/lib/store";
import { WALLET_TOPUPS_PAGE_SIZE } from "@/shared/constants";
import {
  buildTopUpPayload,
  buildWalletViewModel,
  formatWalletAmount,
  getWalletErrorMessage,
} from "@/shared/utils";

import { useCreateTopUpMutation } from "./use-create-topup-mutation";
import { useMeTopupsQuery } from "./use-me-topups-query";
import { useMeWalletQuery } from "./use-me-wallet-query";

interface WalletFiltersState {
  page: number;
  pageSize: number;
  from: string;
  to: string;
}

interface WalletSubmitState {
  isPending: boolean;
  isSuccess: boolean;
  successMessage: string;
  errorMessage: string;
}

interface UseWalletViewModelResult {
  wallet: WalletViewModel | null;
  filters: WalletFiltersState;
  setFrom: (from: string) => void;
  setTo: (to: string) => void;
  nextPage: () => void;
  previousPage: () => void;
  resetFilters: () => void;
  submitTopUp: (values: WalletTopupFormValues) => Promise<void>;
  resetSubmitState: () => void;
  submitState: WalletSubmitState;
  isLoading: boolean;
  isError: boolean;
  hasTopupsError: boolean;
  topupsErrorMessage: string;
  errorMessage: string;
  isMissingSession: boolean;
  refetch: () => Promise<void>;
}

export function useWalletViewModel(): UseWalletViewModelResult {
  const session = useAuthStore((state) => state.session);
  const [filters, setFilters] = useState<WalletFiltersState>({
    page: 1,
    pageSize: WALLET_TOPUPS_PAGE_SIZE,
    from: "",
    to: "",
  });
  const walletQuery = useMeWalletQuery();
  const topupsQuery = useMeTopupsQuery({
    page: filters.page,
    page_size: filters.pageSize,
    from: filters.from,
    to: filters.to,
  });
  const createTopUpMutation = useCreateTopUpMutation();
  const [successMessage, setSuccessMessage] = useState("");
  const [submitErrorMessage, setSubmitErrorMessage] = useState("");
  const wallet = walletQuery.data
    ? buildWalletViewModel({
        wallet: walletQuery.data,
        topups: topupsQuery.data,
      })
    : null;

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
    if (!wallet?.pagination.hasNext) {
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
      page: 1,
      pageSize: WALLET_TOPUPS_PAGE_SIZE,
      from: "",
      to: "",
    });
  };

  const submitTopUp = async (values: WalletTopupFormValues) => {
    if (!session?.user.user_id) {
      setSubmitErrorMessage("No hay una sesion activa para recargar saldo.");
      setSuccessMessage("");
      return;
    }

    try {
      setSubmitErrorMessage("");
      setSuccessMessage("");
      const response = await createTopUpMutation.mutateAsync(
        buildTopUpPayload({
          userId: session.user.user_id,
          values,
        }),
      );
      setSuccessMessage(
        typeof response.balance === "number"
          ? `Recarga realizada con exito. Nuevo saldo: ${formatWalletAmount(
              response.balance,
            )}`
          : "Recarga realizada con exito.",
      );
    } catch (error) {
      setSuccessMessage("");
      setSubmitErrorMessage(getWalletErrorMessage(error));
    }
  };

  const resetSubmitState = () => {
    createTopUpMutation.reset();
    setSuccessMessage("");
    setSubmitErrorMessage("");
  };

  const refetch = async () => {
    await Promise.all([walletQuery.refetch(), topupsQuery.refetch()]);
  };

  return {
    wallet,
    filters,
    setFrom,
    setTo,
    nextPage,
    previousPage,
    resetFilters,
    submitTopUp,
    resetSubmitState,
    submitState: {
      isPending: createTopUpMutation.isPending,
      isSuccess: Boolean(successMessage),
      successMessage,
      errorMessage: submitErrorMessage,
    },
    isLoading:
      Boolean(session?.token) && walletQuery.isPending && !walletQuery.data,
    isError: Boolean(session?.token) && walletQuery.isError,
    hasTopupsError: Boolean(session?.token) && topupsQuery.isError,
    topupsErrorMessage: getHookErrorMessage(
      topupsQuery.error,
      "No se pudieron cargar las recargas.",
    ),
    errorMessage: getHookErrorMessage(
      walletQuery.error,
      "No pudimos cargar tu billetera.",
    ),
    isMissingSession: !session?.token,
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
