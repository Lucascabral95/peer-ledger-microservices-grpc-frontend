import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import type { LoginResponseInterface } from "@/domain/interfaces";
import type { AuthSessionModel } from "@/domain/models";
import { AUTH_COOKIE_NAMES } from "@/shared/constants";
import { deserializeAuthSession, serializeAuthSession } from "@/shared/utils";

export async function GET() {
  const cookieStore = await cookies();
  const serializedSession = cookieStore.get(AUTH_COOKIE_NAMES.session)?.value;
  const session = deserializeAuthSession(serializedSession);

  if (!session) {
    return NextResponse.json(
      {
        error: true,
        message: "no active session",
      },
      { status: 401 },
    );
  }

  const payload: LoginResponseInterface = {
    error: false,
    message: "session available",
    data: session,
  };

  return NextResponse.json(payload);
}

export async function POST(request: Request) {
  const session = (await request.json()) as AuthSessionModel;
  const response = NextResponse.json({
    error: false,
    message: "session persisted",
  });

  setAuthCookies(response, session);

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({
    error: false,
    message: "session cleared",
  });

  clearAuthCookies(response);

  return response;
}

function setAuthCookies(response: NextResponse, session: AuthSessionModel): void {
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
