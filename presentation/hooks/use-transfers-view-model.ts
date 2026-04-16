"use client";

import { useEffect, useRef, useState } from "react";

import type { TransferFormValues, TransfersViewModel } from "@/domain/models";
import { useAuthStore } from "@/lib/store";
import { TRANSFER_RECENT_PAGE_SIZE } from "@/shared/constants";
import {
  buildTransferPayload,
  buildTransfersViewModel,
  createTransferIdempotencyKey,
  getTransferErrorMessage,
  getTransferRetryAfterSeconds,
} from "@/shared/utils";

import { useCreateTransferMutation } from "./use-create-transfer-mutation";
import { useMeActivityQuery } from "./use-me-activity-query";
import { useMeWalletQuery } from "./use-me-wallet-query";

interface TransferSubmitState {
  isPending: boolean;
  isSuccess: boolean;
  successMessage: string;
  errorMessage: string;
  retryAfterSeconds: number | null;
  idempotencyKey: string;
}

interface UseTransfersViewModelResult {
  transfers: TransfersViewModel | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string;
  isMissingSession: boolean;
  submitState: TransferSubmitState;
  submitTransfer: (values: TransferFormValues) => Promise<void>;
  resetSubmitState: () => void;
  refetch: () => Promise<void>;
}

export function useTransfersViewModel(): UseTransfersViewModelResult {
  const session = useAuthStore((state) => state.session);
  const walletQuery = useMeWalletQuery();
  const activityQuery = useMeActivityQuery({
    kind: "transfer",
    page: 1,
    page_size: TRANSFER_RECENT_PAGE_SIZE,
  });
  const createTransferMutation = useCreateTransferMutation();
  const [idempotencyKey, setIdempotencyKey] = useState(
    createTransferIdempotencyKey,
  );
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [retryAfterSeconds, setRetryAfterSeconds] = useState<number | null>(null);
  const lastPayloadSignatureRef = useRef<string | null>(null);
  const transfers =
    walletQuery.data || activityQuery.data
      ? buildTransfersViewModel({
          wallet: walletQuery.data,
          activity: activityQuery.data,
        })
      : null;

  useEffect(() => {
    if (!retryAfterSeconds || retryAfterSeconds <= 0) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setRetryAfterSeconds((currentValue) => {
        if (!currentValue || currentValue <= 1) {
          window.clearInterval(intervalId);
          return null;
        }

        return currentValue - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [retryAfterSeconds]);

  const submitTransfer = async (values: TransferFormValues) => {
    if (!session?.user.user_id) {
      setErrorMessage("No hay una sesion activa para enviar dinero.");
      setSuccessMessage("");
      return;
    }

    if (retryAfterSeconds) {
      setErrorMessage(`Debes esperar ${retryAfterSeconds}s antes de reintentar.`);
      setSuccessMessage("");
      return;
    }

    const payloadSignature = getPayloadSignature(values);
    let transferIdempotencyKey = idempotencyKey;

    if (
      lastPayloadSignatureRef.current &&
      lastPayloadSignatureRef.current !== payloadSignature
    ) {
      transferIdempotencyKey = createTransferIdempotencyKey();
      setIdempotencyKey(transferIdempotencyKey);
    }

    const payload = buildTransferPayload({
      senderId: session.user.user_id,
      values,
      idempotencyKey: transferIdempotencyKey,
    });

    try {
      lastPayloadSignatureRef.current = payloadSignature;
      setErrorMessage("");
      setSuccessMessage("");
      const response = await createTransferMutation.mutateAsync(payload);
      setSuccessMessage(
        response.transaction_id
          ? `Transferencia enviada con exito. ID: ${response.transaction_id}`
          : "Transferencia enviada con exito.",
      );
      lastPayloadSignatureRef.current = null;
      const nextIdempotencyKey = createTransferIdempotencyKey();
      setIdempotencyKey(nextIdempotencyKey);
      setRetryAfterSeconds(null);
    } catch (error) {
      setSuccessMessage("");
      setErrorMessage(getTransferErrorMessage(error));
      setRetryAfterSeconds(getTransferRetryAfterSeconds(error));
    }
  };

  const resetSubmitState = () => {
    createTransferMutation.reset();
    setSuccessMessage("");
    setErrorMessage("");
    setRetryAfterSeconds(null);
  };

  const refetch = async () => {
    await Promise.all([walletQuery.refetch(), activityQuery.refetch()]);
  };

  return {
    transfers,
    isLoading:
      Boolean(session?.token) && (walletQuery.isPending || activityQuery.isPending),
    isError: Boolean(session?.token) && walletQuery.isError,
    errorMessage: getHookErrorMessage(
      walletQuery.error,
      "No se pudo cargar la vista de transferencias.",
    ),
    isMissingSession: !session?.token,
    submitState: {
      isPending: createTransferMutation.isPending,
      isSuccess: Boolean(successMessage),
      successMessage,
      errorMessage,
      retryAfterSeconds,
      idempotencyKey,
    },
    submitTransfer,
    resetSubmitState,
    refetch,
  };
}

function getPayloadSignature(values: TransferFormValues): string {
  return `${values.receiver_id.trim()}:${Number(values.amount)}`;
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
