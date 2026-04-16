export type MeActivityKind = "transfer" | "topup" | "all";

export type MeActivityStatus = "completed" | "blocked" | "failed" | "partial";

export type MeActivityItemKind =
  | "transfer"
  | "transfer_sent"
  | "transfer_received"
  | "topup";

export interface MeActivityRequestInterface {
  page?: number;
  page_size?: number;
  kind?: MeActivityKind;
  from?: string;
  to?: string;
}

export interface ActivityResponseInterface {
  error: boolean;
  message: string;
  data: MeActivityDataInterface;
}

export interface MeActivityDataInterface {
  timezone: string;
  items: MeActivityItemInterface[];
  pagination: MeActivityPaginationInterface;
  filters: MeActivityFiltersInterface;
}

export interface MeActivityItemInterface {
  id: string;
  kind: MeActivityItemKind;
  status: MeActivityStatus;
  amount: number;
  balance_after?: number;
  direction?: "sent" | "received";
  counterparty_id?: string;
  counterparty_name?: string;
  created_at: string;
}

export interface MeActivityFiltersInterface {
  kind: MeActivityKind;
  from: string | null;
  to: string | null;
}

export interface MeActivityPaginationInterface {
  page: number;
  page_size: number;
  has_next: boolean;
}
