export type WalletTone = "success" | "info" | "warning" | "danger";

export interface WalletViewModel {
  identity: WalletIdentityModel;
  balance: WalletBalanceModel;
  metrics: WalletMetricModel[];
  topupForm: WalletTopupFormModel;
  topups: WalletTopupItemModel[];
  pagination: WalletPaginationModel;
  filters: WalletFilterModel;
  actions: WalletActionModel[];
  alerts: WalletAlertModel[];
  emptyMessage: string;
}

export interface WalletIdentityModel {
  userId: string;
  shortUserId: string;
  label: string;
}

export interface WalletBalanceModel {
  amount: number | null;
  amountLabel: string;
  helper: string;
  tone: WalletTone;
}

export interface WalletMetricModel {
  id: string;
  label: string;
  value: string;
  helper: string;
  tone: WalletTone;
}

export interface WalletTopupFormModel {
  defaultValues: WalletTopupFormValues;
  minAmount: number;
  helper: string;
}

export interface WalletTopupFormValues {
  amount: number;
}

export interface WalletTopupItemModel {
  id: string;
  amount: number;
  amountLabel: string;
  balanceAfter: number;
  balanceAfterLabel: string;
  status: "completed" | "blocked" | "failed" | "partial";
  statusLabel: string;
  date: string;
  dateLabel: string;
  tone: WalletTone;
}

export interface WalletPaginationModel {
  page: number;
  pageSize: number;
  hasNext: boolean;
  canGoBack: boolean;
  label: string;
}

export interface WalletFilterModel {
  from: string;
  to: string;
}

export interface WalletActionModel {
  id: string;
  label: string;
  href: string;
  description: string;
}

export interface WalletAlertModel {
  id: string;
  severity: "info" | "warning" | "danger" | "success";
  message: string;
}
