export interface MeDashboardResponseInterface {
  error: boolean;
  message: string;
  data: MeDashboardDataInterface;
}

export type MeDashboardOperationStatus =
  | "completed"
  | "blocked"
  | "failed"
  | "partial";

export interface MeDashboardDataInterface {
  timezone: string;
  user: MeDashboardUserInterface;
  wallet: MeDashboardWalletInterface;
  transfers: MeDashboardTransfersInterface;
  topups: MeDashboardTopupsInterface;
  activity_today: MeDashboardActivityTodayInterface;
  recent_transfers: MeDashboardRecentTransferInterface[];
  recent_topups: MeDashboardRecentTopupInterface[];
}

export interface MeDashboardActivityTodayInterface {
  transfer_sent_count: number;
  transfer_received_count: number;
  topup_count: number;
  total_events: number;
}

export interface MeDashboardRecentTransferInterface {
  id: string;
  kind: "transfer" | "transfer_sent" | "transfer_received";
  status: MeDashboardOperationStatus;
  amount: number;
  direction?: "sent" | "received";
  counterparty_id?: string;
  counterparty_name?: string;
  balance_after?: number;
  created_at: string;
}

export interface MeDashboardRecentTopupInterface {
  id: string;
  kind: "topup";
  status: MeDashboardOperationStatus;
  amount: number;
  balance_after: number;
  created_at: string;
}

export interface MeDashboardTopupsInterface {
  count_total: number;
  amount_total: number;
  count_today: number;
  amount_today: number;
}

export interface MeDashboardTransfersInterface {
  sent_total: number;
  received_total: number;
  sent_count_total: number;
  received_count_total: number;
}

export interface MeDashboardUserInterface {
  user_id: string;
  name: string;
  email: string;
}

export interface MeDashboardWalletInterface {
  balance: number;
}
