import { act, renderHook } from "@testing-library/react";

import { clearAuthSession } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import UseSession from "@/presentation/hooks/use-session-hook";
import { AUTH_ROUTES } from "@/shared/constants";

const push = jest.fn();
const refresh = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push,
    refresh,
  }),
}));

jest.mock("@/infrastructure/services", () => ({
  clearAuthSession: jest.fn(async () => undefined),
}));

describe("UseSession", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      session: null,
      setSession: useAuthStore.getState().setSession,
      clearSession: jest.fn(),
    });
  });

  it("clears session and redirects to login on sign out", async () => {
    const clearSession = jest.fn();
    useAuthStore.setState((state) => ({
      ...state,
      clearSession,
    }));
    const setIsMobileMenuOpen = jest.fn();

    const { result } = renderHook(() => UseSession({ setIsMobileMenuOpen }));

    await act(async () => {
      await result.current.handleSignOut();
    });

    expect(clearSession).toHaveBeenCalledTimes(1);
    expect(clearAuthSession).toHaveBeenCalledTimes(1);
    expect(setIsMobileMenuOpen).toHaveBeenCalledWith(false);
    expect(push).toHaveBeenCalledWith(AUTH_ROUTES.login);
    expect(refresh).toHaveBeenCalledTimes(1);
  });
});
