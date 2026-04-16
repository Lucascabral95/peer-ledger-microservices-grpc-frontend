import type {
  MeActivityRequestInterface,
  MeTopupsRequestInterface,
} from "@/domain/interfaces";

interface NormalizedMeListParams {
  page: number;
  page_size: number;
  from: string | null;
  to: string | null;
  kind?: string;
}

export const QUERY_KEYS = {
  users: {
    detail: (userId: string) => ["users", "detail", userId] as const,
  },
  history: {
    byUser: (userId: string) => ["history", "by-user", userId] as const,
  },
  transfers: {
    create: () => ["transfers", "create"] as const,
  },
  topups: {
    create: () => ["topups", "create"] as const,
  },
  me: {
    profile: () => ["me", "profile"] as const,
    dashboard: () => ["me", "dashboard"] as const,
    wallet: () => ["me", "wallet"] as const,
    topups: (params: MeTopupsRequestInterface = {}) =>
      ["me", "topups", normalizeMeTopupsParams(params)] as const,
    activity: (params: MeActivityRequestInterface = {}) =>
      ["me", "activity", normalizeMeActivityParams(params)] as const,
  },
} as const;

export function normalizeMeTopupsParams(
  params: MeTopupsRequestInterface = {},
): NormalizedMeListParams {
  return {
    page: params.page ?? 1,
    page_size: params.page_size ?? 10,
    from: params.from ?? null,
    to: params.to ?? null,
  };
}

export function normalizeMeActivityParams(
  params: MeActivityRequestInterface = {},
): NormalizedMeListParams {
  return {
    page: params.page ?? 1,
    page_size: params.page_size ?? 10,
    from: params.from ?? null,
    to: params.to ?? null,
    kind: params.kind ?? "all",
  };
}
