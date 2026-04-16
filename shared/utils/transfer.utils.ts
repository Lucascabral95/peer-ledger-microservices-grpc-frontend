import type {
  MeActivityDataInterface,
  MeActivityItemInterface,
  MeWalletDataInterface,
  TransferRequestInterface,
} from "@/domain/interfaces";
import type {
  TransferFormValues,
  TransfersRecentTransferModel,
  TransfersViewModel,
} from "@/domain/models";
import type { BackendHttpError } from "@/domain/types";
import { TRANSFER_LIMIT_CARDS } from "@/shared/constants";

import {
  formatHistoryAmount,
  formatHistoryDate,
  getActivityDirectionLabel,
  getActivityStatusLabel,
  getHistoryCounterparty,
  isTransferActivity,
} from "./history.utils";
import { getFraudRuleMessage } from "./security.utils";

export function buildTransfersViewModel(params: {
  wallet?: MeWalletDataInterface;
  activity?: MeActivityDataInterface;
}): TransfersViewModel {
  return {
    wallet: {
      balance: params.wallet?.balance ?? null,
      balanceLabel:
        typeof params.wallet?.balance === "number"
          ? formatHistoryAmount(params.wallet.balance)
          : "Saldo no disponible",
      helper:
        typeof params.wallet?.balance === "number"
          ? "Saldo disponible para transferencias P2P."
          : "No pudimos confirmar tu saldo disponible.",
    },
    limits: TRANSFER_LIMIT_CARDS.map((limit) => ({ ...limit })),
    recentTransfers: (params.activity?.items ?? [])
      .filter(isTransferActivity)
      .map(mapActivityItemToRecentTransfer),
    formDefaults: {
      receiver_id: "",
      amount: 0,
    },
  };
}

export function createTransferIdempotencyKey(): string {
  if (typeof globalThis.crypto?.randomUUID === "function") {
    return globalThis.crypto.randomUUID();
  }

  return `transfer-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function buildTransferPayload(params: {
  senderId: string;
  values: TransferFormValues;
  idempotencyKey: string;
}): TransferRequestInterface {
  return {
    sender_id: params.senderId,
    receiver_id: params.values.receiver_id.trim(),
    amount: Number(params.values.amount),
    idempotency_key: params.idempotencyKey,
  };
}

export function getTransferErrorMessage(error: unknown): string {
  const backendError = getBackendError(error);

  if (backendError?.rule_code) {
    return getFraudRuleMessage(backendError.rule_code);
  }

  if (backendError?.message) {
    return backendError.message;
  }

  return "No se pudo completar la transferencia.";
}

export function getTransferRetryAfterSeconds(error: unknown): number | null {
  const backendError = getBackendError(error);
  const retryAfter = backendError?.retryAfter;

  if (retryAfter === undefined || retryAfter === null || retryAfter === "") {
    return null;
  }

  const parsedRetryAfter = Number(retryAfter);

  if (!Number.isFinite(parsedRetryAfter) || parsedRetryAfter <= 0) {
    return null;
  }

  return Math.ceil(parsedRetryAfter);
}

export function mapActivityItemToRecentTransfer(
  item: MeActivityItemInterface,
): TransfersRecentTransferModel {
  const directionLabel = getActivityDirectionLabel(item);

  return {
    id: item.id,
    counterparty: getHistoryCounterparty(item),
    amount: item.amount,
    amountLabel: formatHistoryAmount(item.amount),
    date: item.created_at,
    dateLabel: formatHistoryDate(item.created_at),
    status: item.status,
    statusLabel: getActivityStatusLabel(item.status),
    directionLabel: directionLabel === "Recibida" ? "Recibida" : "Enviada",
  };
}

function getBackendError(error: unknown): BackendHttpError | null {
  if (typeof error !== "object" || error === null) {
    return null;
  }

  return error as BackendHttpError;
}
