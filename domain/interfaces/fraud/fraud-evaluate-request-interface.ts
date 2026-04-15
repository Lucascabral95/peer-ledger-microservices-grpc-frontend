export interface FraudEvaluateRequestInterface {
  sender_id: string;
  receiver_id: string;
  amount: number;
  idempotency_key: string;
}
