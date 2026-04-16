import type { MeActivityKind, MeActivityStatus } from "@/domain/interfaces";

export type HistoryTone = "success" | "info" | "warning" | "danger";

export interface HistoryViewModel {
  title: string;
  subtitle: string;
  summary: HistorySummaryModel[];
  filters: HistoryFilterModel[];
  rows: HistoryRowModel[];
  pagination: HistoryPaginationModel;
  emptyMessage: string;
}

export interface HistorySummaryModel {
  id: string;
  label: string;
  value: string;
  helper: string;
  tone: HistoryTone;
}

export interface HistoryFilterModel {
  id: MeActivityKind;
  label: string;
  description: string;
}

export interface HistoryRowModel {
  id: string;
  kind: "transfer" | "topup";
  label: string;
  counterparty: string;
  amount: number;
  amountLabel: string;
  date: string;
  dateLabel: string;
  status: MeActivityStatus;
  statusLabel: string;
  directionLabel: string;
  balanceAfterLabel: string;
  tone: HistoryTone;
}

export interface HistoryPaginationModel {
  page: number;
  pageSize: number;
  hasNext: boolean;
  canGoBack: boolean;
  label: string;
}
