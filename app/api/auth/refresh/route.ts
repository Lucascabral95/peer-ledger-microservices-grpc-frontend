import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import type {
  RefreshTokenRequestInterface,
  RefreshTokenResponseInterface,
} from "@/domain/interfaces";
import { refreshUserSession } from "@/infrastructure/services";
import { AUTH_COOKIE_NAMES, AUTH_ROUTES } from "@/shared/constants";
import { isValidRefreshToken, serializeAuthSession } from "@/shared/utils";

export async function GET(request: NextRequest) {
  const redirectTo =
    request.nextUrl.searchParams.get("redirect") || AUTH_ROUTES.home;
  const refreshResponse = await resolveRefresh();

  if (!refreshResponse) {
    const loginUrl = new URL(AUTH_ROUTES.login, request.url);
    const response = NextResponse.redirect(loginUrl);
    clearAuthCookies(response);
    return response;
  }

  const redirectUrl = new URL(redirectTo, request.url);
  const response = NextResponse.redirect(redirectUrl);
  setAuthCookies(response, refreshResponse.data);
  return response;
}

export async function POST() {
  const refreshResponse = await resolveRefresh();

  if (!refreshResponse) {
    const response = NextResponse.json(
      {
        error: true,
        message: "unable to refresh session",
      },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  const response = NextResponse.json(refreshResponse);
  setAuthCookies(response, refreshResponse.data);
  return response;
}

async function resolveRefresh(): Promise<RefreshTokenResponseInterface | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_COOKIE_NAMES.refreshToken)?.value;

  if (!isValidRefreshToken(refreshToken)) {
    return null;
  }

  const payload: RefreshTokenRequestInterface = {
    refresh_token: refreshToken as string,
  };

  try {
    return await refreshUserSession(payload);
  } catch {
    return null;
  }
}

function setAuthCookies(
  response: NextResponse,
  session: RefreshTokenResponseInterface["data"],
): void {
  response.cookies.set(AUTH_COOKIE_NAMES.accessToken, session.token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: session.expires_in,
  });
  response.cookies.set(AUTH_COOKIE_NAMES.refreshToken, session.refresh_token, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: session.expires_in,
  });
  response.cookies.set(AUTH_COOKIE_NAMES.session, serializeAuthSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: session.expires_in,
  });
}

function clearAuthCookies(response: NextResponse): void {
  response.cookies.delete(AUTH_COOKIE_NAMES.accessToken);
  response.cookies.delete(AUTH_COOKIE_NAMES.refreshToken);
  response.cookies.delete(AUTH_COOKIE_NAMES.session);
}
