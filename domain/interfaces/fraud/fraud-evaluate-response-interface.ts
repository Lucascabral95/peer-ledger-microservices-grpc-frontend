export interface FraudEvaluateResponseInterface {
  allowed: boolean;
  reason?: string;
  rule_code?: string;
  /** @deprecated Use rule_code. */
  role_code?: number | string;
}
