export const AUTH_COOKIE_NAMES = {
  accessToken: "peer-ledger-access-token",
  refreshToken: "peer-ledger-refresh-token",
  session: "peer-ledger-session",
} as const;

export const AUTH_STORAGE_KEYS = {
  session: "peer-ledger-auth-session",
} as const;

export const AUTH_ROUTES = {
  login: "/api/v1/login",
  register: "/api/v1/register",
  home: "/api/v1/dashboard",
  sessionApi: "/api/auth/session",
  refreshApi: "/api/auth/refresh",
} as const;
