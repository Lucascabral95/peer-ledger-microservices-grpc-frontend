import type {
  TransactionStatus,
} from "@/domain/interfaces/transaction/get-history-response-interface";

export interface DashboardBalanceSummaryModel {
  amount: number | null;
  lastUpdatedAt: string | null;
}

export interface DashboardMetricsModel {
  moneySent: number;
  moneyReceived: number;
  activityToday: number;
  topupsCount: number;
}

export interface DashboardLatestTransferModel {
  id: string;
  date: string;
  counterparty: string;
  amount: number;
  direction: "sent" | "received";
  status: TransactionStatus;
}

export interface DashboardTopupSummaryModel {
  count: number;
  lastTopupAmount: number | null;
  lastTopupDate: string | null;
}

export interface DashboardAlertModel {
  id: string;
  severity: "info" | "warning" | "danger";
  message: string;
}

export interface DashboardQuickActionModel {
  id: string;
  label: string;
  href: string;
}

export interface DashboardHomeModel {
  greetingName: string;
  sessionStatusLabel: string;
  balance: DashboardBalanceSummaryModel;
  metrics: DashboardMetricsModel;
  latestTransfers: DashboardLatestTransferModel[];
  topupSummary: DashboardTopupSummaryModel;
  alerts: DashboardAlertModel[];
  quickActions: DashboardQuickActionModel[];
}
