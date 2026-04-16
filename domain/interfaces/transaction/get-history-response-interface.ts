export type TransactionStatus = "completed" | "blocked" | "failed" | "partial";

export type TransactionType = "transfer" | "topup";

export interface GetHistoryResponseInterface {
  transactions: TransactionRecordInterface[];
}

export interface TransactionRecordInterface {
  transaction_id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  status: TransactionStatus;
  type: TransactionType;
  created_at: string;
  updated_at?: string;
  balance_after?: number;
  counterparty_name?: string;
  status_detail?: string;
}
