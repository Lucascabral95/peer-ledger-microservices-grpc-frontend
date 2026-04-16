import { renderHook } from "@testing-library/react";

import { useAuthStore } from "@/lib/store";
import { useSecurityViewModel } from "@/presentation/hooks";

describe("useSecurityViewModel", () => {
  beforeEach(() => {
    useAuthStore.setState((state) => ({
      ...state,
      session: null,
    }));
  });

  it("returns a view model and marks missing session without token", () => {
    const { result } = renderHook(() => useSecurityViewModel());

    expect(result.current.isMissingSession).toBe(true);
    expect(result.current.security.session.statusLabel).toBe(
      "Sesion no disponible",
    );
    expect(result.current.security.fraudRules).toHaveLength(5);
  });

  it("returns a view model and active session flag when token exists", () => {
    useAuthStore.setState((state) => ({
      ...state,
      session: {
        expires_in: 86400,
        refresh_token: "refresh-token",
        token: createJwt(Math.floor(Date.now() / 1000) + 2 * 60 * 60),
        token_type: "Bearer",
        user: {
          email: "lucas@example.com",
          name: "Lucas",
          user_id: "user-1",
        },
      },
    }));

    const { result } = renderHook(() => useSecurityViewModel());

    expect(result.current.isMissingSession).toBe(false);
    expect(result.current.security.session.statusLabel).toBe("Sesion activa");
  });
});

function createJwt(exp: number): string {
  const payload = Buffer.from(
    JSON.stringify({
      exp,
      typ_token: "access",
    }),
  )
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");

  return `header.${payload}.signature`;
}
