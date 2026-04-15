import type {
  LoginResponseInterface,
  RefreshTokenResponseInterface,
} from "@/domain/interfaces";
import type { AuthSessionModel } from "@/domain/models";
import { AUTH_ROUTES } from "@/shared/constants";

export async function persistAuthSession(session: AuthSessionModel): Promise<void> {
  await fetch(AUTH_ROUTES.sessionApi, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(session),
  });
}

export async function clearAuthSession(): Promise<void> {
  await fetch(AUTH_ROUTES.sessionApi, {
    method: "DELETE",
  });
}

export async function getPersistedAuthSession(): Promise<AuthSessionModel | null> {
  const response = await fetch(AUTH_ROUTES.sessionApi, {
    method: "GET",
    cache: "no-store",
  });

  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as LoginResponseInterface | null;
  return payload?.data ?? null;
}

export async function refreshAuthSession(): Promise<RefreshTokenResponseInterface> {
  const response = await fetch(AUTH_ROUTES.refreshApi, {
    method: "POST",
    cache: "no-store",
  });

  const payload = (await response.json()) as RefreshTokenResponseInterface;

  if (!response.ok || payload.error) {
    throw payload;
  }

  return payload;
}
