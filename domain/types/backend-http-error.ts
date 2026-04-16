export interface BackendHttpError {
  status?: number;
  message: string;
  rule_code?: string;
  retryAfter?: string | number;
}
