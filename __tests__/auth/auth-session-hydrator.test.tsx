import { render, waitFor } from "@testing-library/react";

import { getPersistedAuthSession } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import { AuthSessionHydrator } from "@/presentation/components/auth/auth-session-hydrator";

jest.mock("@/infrastructure/services", () => ({
  getPersistedAuthSession: jest.fn(),
}));

const mockedGetPersistedAuthSession = jest.mocked(getPersistedAuthSession);

describe("AuthSessionHydrator", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState({
      session: null,
      setSession: useAuthStore.getState().setSession,
      clearSession: useAuthStore.getState().clearSession,
    });
  });

  it("hydrates store session when persisted session exists", async () => {
    const setSession = jest.fn();
    const clearSession = jest.fn();
    useAuthStore.setState((state) => ({
      ...state,
      setSession,
      clearSession,
    }));

    mockedGetPersistedAuthSession.mockResolvedValueOnce({
      expires_in: 86400,
      refresh_token: "refresh-token",
      token: "access-token",
      token_type: "Bearer",
      user: {
        email: "user@example.com",
        name: "Lucas",
        user_id: "user-1",
      },
    });

    render(<AuthSessionHydrator />);

    await waitFor(() => {
      expect(setSession).toHaveBeenCalledTimes(1);
    });
    expect(clearSession).not.toHaveBeenCalled();
  });

  it("clears store session when persisted session is not available", async () => {
    const setSession = jest.fn();
    const clearSession = jest.fn();
    useAuthStore.setState((state) => ({
      ...state,
      setSession,
      clearSession,
    }));

    mockedGetPersistedAuthSession.mockResolvedValueOnce(null);

    render(<AuthSessionHydrator />);

    await waitFor(() => {
      expect(clearSession).toHaveBeenCalledTimes(1);
    });
    expect(setSession).not.toHaveBeenCalled();
  });
});
