import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import { getMeDashboard } from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import { useDashboardHomeQuery } from "@/presentation/hooks";

jest.mock("@/infrastructure/services", () => ({
  getMeDashboard: jest.fn(),
}));

const mockedGetMeDashboard = jest.mocked(getMeDashboard);

describe("useDashboardHomeQuery", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useAuthStore.setState((state) => ({
      ...state,
      session: {
        expires_in: 86400,
        refresh_token: "refresh-token",
        token: "access-token",
        token_type: "Bearer",
        user: {
          email: "lucas@example.com",
          name: "Lucas Session",
          user_id: "user-1",
        },
      },
    }));
  });

  it("returns the dashboard from /me/dashboard when the query succeeds", async () => {
    mockedGetMeDashboard.mockResolvedValueOnce({
      error: false,
      message: "dashboard loaded",
      data: createMeDashboardData(),
    });

    const { result } = renderHook(() => useDashboardHomeQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });

    expect(result.current.dashboard?.greetingName).toBe("Lucas Backend");
    expect(result.current.dashboard?.balance.amount).toBe(2500);
    expect(result.current.dashboard?.latestTransfers).toHaveLength(1);
    expect(result.current.isError).toBe(false);
    expect(result.current.hasPartialData).toBe(false);
    expect(result.current.isHistoryUnavailable).toBe(false);
  });

  it("returns an error state when /me/dashboard fails", async () => {
    mockedGetMeDashboard.mockRejectedValue({
      message: "dashboard unavailable",
    });

    const { result } = renderHook(() => useDashboardHomeQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    expect(result.current.errorMessage).toBe("dashboard unavailable");
    expect(result.current.dashboard).toBeNull();
  });

  it("does not execute requests when there is no active session", () => {
    useAuthStore.setState((state) => ({
      ...state,
      session: null,
    }));

    const { result } = renderHook(() => useDashboardHomeQuery(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isMissingSession).toBe(true);
    expect(mockedGetMeDashboard).not.toHaveBeenCalled();
  });
});

function createQueryWrapper() {
  return function QueryWrapper({ children }: { children: React.ReactNode }) {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retryDelay: 0,
          gcTime: 0,
        },
      },
    });

    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

function createMeDashboardData() {
  return {
    timezone: "America/Buenos_Aires",
    user: {
      user_id: "user-1",
      name: "Lucas Backend",
      email: "lucas@example.com",
    },
    wallet: {
      balance: 2500,
    },
    transfers: {
      sent_total: 120,
      received_total: 80,
      sent_count_total: 1,
      received_count_total: 1,
    },
    topups: {
      count_total: 2,
      amount_total: 500,
      count_today: 1,
      amount_today: 250,
    },
    activity_today: {
      transfer_sent_count: 1,
      transfer_received_count: 1,
      topup_count: 1,
      total_events: 3,
    },
    recent_transfers: [
      {
        id: "transfer-1",
        kind: "transfer_received" as const,
        status: "completed" as const,
        amount: 120,
        counterparty_id: "user-2",
        counterparty_name: "Ana Ruiz",
        balance_after: 2380,
        created_at: "2026-04-15T14:00:00.000Z",
      },
    ],
    recent_topups: [
      {
        id: "topup-1",
        kind: "topup" as const,
        status: "completed" as const,
        amount: 250,
        balance_after: 2500,
        created_at: "2026-04-15T13:00:00.000Z",
      },
    ],
  };
}
