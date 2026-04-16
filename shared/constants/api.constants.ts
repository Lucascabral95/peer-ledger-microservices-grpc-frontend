export const AUTH_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  refresh: "/auth/refresh",
} as const;

export const USER_ENDPOINTS = {
  getById: (id: string) => `/users/${id}`,
} as const;

export const TRANSACTION_ENDPOINTS = {
  getHistoryByUserId: (userId: string) => `/history/${userId}`,
} as const;

export const TRANSFER_ENDPOINTS = {
  create: "/transfers",
} as const;

export const TOPUP_ENDPOINTS = {
  create: "/topups",
} as const;

export const ME_ENDPOINTS = {
  profile: "/me/profile",
  dashboard: "/me/dashboard",
  wallet: "/me/wallet",
  topups: "/me/topups",
  activity: "/me/activity",
} as const;
