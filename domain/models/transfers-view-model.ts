import type { MeActivityStatus } from "@/domain/interfaces";

export type TransfersTone = "success" | "info" | "warning" | "danger";

export interface TransfersViewModel {
  wallet: TransfersWalletModel;
  limits: TransfersLimitModel[];
  recentTransfers: TransfersRecentTransferModel[];
  formDefaults: TransferFormValues;
}

export interface TransfersWalletModel {
  balance: number | null;
  balanceLabel: string;
  helper: string;
}

export interface TransfersLimitModel {
  id: string;
  label: string;
  value: string;
  description: string;
  tone: TransfersTone;
}

export interface TransfersRecentTransferModel {
  id: string;
  counterparty: string;
  amount: number;
  amountLabel: string;
  date: string;
  dateLabel: string;
  status: MeActivityStatus;
  statusLabel: string;
  directionLabel: "Enviada" | "Recibida";
}

export interface TransferFormValues {
  receiver_id: string;
  amount: number;
}
