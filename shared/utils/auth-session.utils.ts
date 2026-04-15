import type { AuthSessionModel } from "@/domain/models";

import { AUTH_COOKIE_NAMES } from "@/shared/constants";

interface JwtPayload {
  sub?: string;
  name?: string;
  email?: string;
  typ_token?: "access" | "refresh";
  iss?: string;
  iat?: number;
  exp?: number;
}

export function serializeAuthSession(session: AuthSessionModel): string {
  return encodeURIComponent(JSON.stringify(session));
}

export function deserializeAuthSession(
  serializedSession?: string | null,
): AuthSessionModel | null {
  if (!serializedSession) {
    return null;
  }

  try {
    return JSON.parse(decodeURIComponent(serializedSession)) as AuthSessionModel;
  } catch {
    return null;
  }
}

export function setClientCookie(
  name: string,
  value: string,
  maxAge: number,
): void {
  document.cookie = `${name}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax`;
}

export function removeClientCookie(name: string): void {
  document.cookie = `${name}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function getClientCookie(name: string): string | null {
  if (typeof document === "undefined") {
    return null;
  }

  const cookies = document.cookie.split("; ");

  for (const cookie of cookies) {
    const [cookieName, ...cookieValue] = cookie.split("=");

    if (cookieName === name) {
      return cookieValue.join("=");
    }
  }

  return null;
}

export function persistClientAuthCookies(session: AuthSessionModel): void {
  setClientCookie(
    AUTH_COOKIE_NAMES.accessToken,
    encodeURIComponent(session.token),
    session.expires_in,
  );
  setClientCookie(
    AUTH_COOKIE_NAMES.refreshToken,
    encodeURIComponent(session.refresh_token),
    session.expires_in,
  );
  setClientCookie(
    AUTH_COOKIE_NAMES.session,
    serializeAuthSession(session),
    session.expires_in,
  );
}

export function clearClientAuthCookies(): void {
  removeClientCookie(AUTH_COOKIE_NAMES.accessToken);
  removeClientCookie(AUTH_COOKIE_NAMES.refreshToken);
  removeClientCookie(AUTH_COOKIE_NAMES.session);
}

export function parseJwtPayload(token?: string | null): JwtPayload | null {
  if (!token) {
    return null;
  }

  try {
    const [, payload] = token.split(".");

    if (!payload) {
      return null;
    }

    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "=",
    );
    const decodedPayload =
      typeof atob === "function"
        ? atob(paddedPayload)
        : Buffer.from(paddedPayload, "base64").toString("utf-8");
    const parsedPayload = JSON.parse(decodedPayload) as JwtPayload;

    return parsedPayload;
  } catch {
    return null;
  }
}

export function parseJwtExpiration(token?: string | null): number | null {
  const payload = parseJwtPayload(token);

  return typeof payload?.exp === "number" ? payload.exp : null;
}

export function isJwtExpired(token?: string | null): boolean {
  const expiration = parseJwtExpiration(token);

  if (!expiration) {
    return true;
  }

  return expiration <= Math.floor(Date.now() / 1000);
}

export function hasExpectedJwtType(
  token: string | null | undefined,
  expectedType: JwtPayload["typ_token"],
): boolean {
  const payload = parseJwtPayload(token);

  return payload?.typ_token === expectedType;
}

export function isValidAccessToken(token?: string | null): boolean {
  return Boolean(token) && hasExpectedJwtType(token, "access") && !isJwtExpired(token);
}

export function isValidRefreshToken(token?: string | null): boolean {
  return Boolean(token) && hasExpectedJwtType(token, "refresh") && !isJwtExpired(token);
}
