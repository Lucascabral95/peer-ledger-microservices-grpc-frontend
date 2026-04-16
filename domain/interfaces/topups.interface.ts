export type MeTopupStatus = "completed" | "blocked" | "failed" | "partial";

export interface MeTopupsRequestInterface {
  page?: number;
  page_size?: number;
  from?: string;
  to?: string;
}

export interface MeTopupsResponseInterface {
  error: boolean;
  message: string;
  data: MeTopupsDataInterface;
}

export interface MeTopupsDataInterface {
  timezone: string;
  items: MeTopupItemInterface[];
  pagination: MeTopupsPaginationInterface;
  filters: MeTopupsFiltersInterface;
}

export interface MeTopupItemInterface {
  id: string;
  kind: "topup";
  status: MeTopupStatus;
  amount: number;
  balance_after: number;
  created_at: string;
}

export interface MeTopupsFiltersInterface {
  from: string | null;
  to: string | null;
}

export interface MeTopupsPaginationInterface {
  page: number;
  page_size: number;
  has_next: boolean;
}
