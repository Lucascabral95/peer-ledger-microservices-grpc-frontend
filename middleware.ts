import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIE_NAMES, AUTH_ROUTES } from "@/shared/constants";
import { isValidAccessToken, isValidRefreshToken } from "@/shared/utils";

const BLOCKED_WHEN_AUTHENTICATED: string[] = [
  "/",
  AUTH_ROUTES.login,
  AUTH_ROUTES.register,
];
const PROTECTED_PREFIX = `${AUTH_ROUTES.home}`;

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const accessToken = request.cookies.get(AUTH_COOKIE_NAMES.accessToken)?.value;
  const refreshToken = request.cookies.get(
    AUTH_COOKIE_NAMES.refreshToken,
  )?.value;
  const hasValidAccessToken = isValidAccessToken(accessToken);
  const canRefresh = isValidRefreshToken(refreshToken);
  const isProtectedRoute =
    pathname === PROTECTED_PREFIX ||
    pathname.startsWith(`${PROTECTED_PREFIX}/`);
  const isBlockedPublicRoute = BLOCKED_WHEN_AUTHENTICATED.includes(pathname);

  if (isBlockedPublicRoute) {
    if (hasValidAccessToken) {
      return NextResponse.redirect(new URL(AUTH_ROUTES.home, request.url));
    }

    if (accessToken && !hasValidAccessToken && canRefresh) {
      return redirectToRefresh(request, AUTH_ROUTES.home);
    }

    return NextResponse.next();
  }

  if (isProtectedRoute) {
    if (hasValidAccessToken) {
      return NextResponse.next();
    }

    if (canRefresh) {
      return redirectToRefresh(request, `${pathname}${search}`);
    }

    return NextResponse.redirect(new URL(AUTH_ROUTES.login, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/api/v1/login",
    "/api/v1/register",
    "/api/v1/dashboard/:path*",
  ],
};

function redirectToRefresh(request: NextRequest, redirectTo: string) {
  const refreshUrl = new URL(AUTH_ROUTES.refreshApi, request.url);
  refreshUrl.searchParams.set("redirect", redirectTo);
  return NextResponse.redirect(refreshUrl);
}
