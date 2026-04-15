export interface RecordRequestInterface {
  sender_id: string;
  receiver_id: string;
  amount: number;
  idempotency_key: string;
  transaction_id: string;
}
