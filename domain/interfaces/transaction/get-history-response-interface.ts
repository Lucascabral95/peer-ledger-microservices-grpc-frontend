export interface GetHistoryResponseInterface {
  transactions: TransactionRecordInterface[];
}

export interface TransactionRecordInterface {
  transaction_id: string;
  sender_id: string;
  receiver_id: string;
  amount: number;
  status: string;
  created_at: string;
}
