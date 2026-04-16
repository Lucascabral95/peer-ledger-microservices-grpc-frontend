export interface MeWalletResponseInterface {
  error: boolean;
  message: string;
  data: MeWalletDataInterface;
}

export interface MeWalletDataInterface {
  timezone: string;
  user_id: string;
  balance: number;
  topups: MeWalletTopupsInterface;
}

export interface MeWalletTopupsInterface {
  count_total: number;
  amount_total: number;
  count_today: number;
  amount_today: number;
}
