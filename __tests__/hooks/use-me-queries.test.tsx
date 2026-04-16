import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";

import {
  getMeActivity,
  getMeDashboard,
  getMeProfile,
  getMeTopups,
  getMeWallet,
} from "@/infrastructure/services";
import { useAuthStore } from "@/lib/store";
import {
  useMeActivityQuery,
  useMeDashboardQuery,
  useMeProfileQuery,
  useMeTopupsQuery,
  useMeWalletQuery,
} from "@/presentation/hooks";

jest.mock("@/infrastructure/services", () => ({
  getMeProfile: jest.fn(),
  getMeDashboard: jest.fn(),
  getMeWallet: jest.fn(),
  getMeTopups: jest.fn(),
  getMeActivity: jest.fn(),
}));

const mockedGetMeProfile = jest.mocked(getMeProfile);
const mockedGetMeDashboard = jest.mocked(getMeDashboard);
const mockedGetMeWallet = jest.mocked(getMeWallet);
const mockedGetMeTopups = jest.mocked(getMeTopups);
const mockedGetMeActivity = jest.mocked(getMeActivity);

describe("me query hooks", () => {
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
          name: "Lucas",
          user_id: "user-1",
        },
      },
    }));
  });

  it("selects profile response data", async () => {
    mockedGetMeProfile.mockResolvedValueOnce({
      error: false,
      message: "ok",
      data: {
        user_id: "user-1",
        name: "Lucas",
        email: "lucas@example.com",
      },
    });

    const { result } = renderHook(() => useMeProfileQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.name).toBe("Lucas");
    });
  });

  it("selects dashboard response data", async () => {
    mockedGetMeDashboard.mockResolvedValueOnce({
      error: false,
      message: "ok",
      data: createDashboardData(),
    });

    const { result } = renderHook(() => useMeDashboardQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.wallet.balance).toBe(1000);
    });
  });

  it("selects wallet response data", async () => {
    mockedGetMeWallet.mockResolvedValueOnce({
      error: false,
      message: "ok",
      data: {
        timezone: "America/Buenos_Aires",
        user_id: "user-1",
        balance: 1000,
        topups: {
          count_total: 2,
          amount_total: 500,
          count_today: 1,
          amount_today: 250,
        },
      },
    });

    const { result } = renderHook(() => useMeWalletQuery(), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.balance).toBe(1000);
    });
  });

  it("passes topups params to the service", async () => {
    mockedGetMeTopups.mockResolvedValueOnce({
      error: false,
      message: "ok",
      data: {
        timezone: "America/Buenos_Aires",
        items: [],
        pagination: {
          page: 2,
          page_size: 20,
          has_next: false,
        },
        filters: {
          from: null,
          to: null,
        },
      },
    });

    const params = { page: 2, page_size: 20 };
    const { result } = renderHook(() => useMeTopupsQuery(params), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.pagination.page).toBe(2);
    });
    expect(mockedGetMeTopups).toHaveBeenCalledWith(params);
  });

  it("passes activity params to the service", async () => {
    mockedGetMeActivity.mockResolvedValueOnce({
      error: false,
      message: "ok",
      data: {
        timezone: "America/Buenos_Aires",
        items: [],
        pagination: {
          page: 1,
          page_size: 10,
          has_next: false,
        },
        filters: {
          kind: "topup",
          from: "2026-04-01",
          to: "2026-04-15",
        },
      },
    });

    const params = {
      kind: "topup" as const,
      from: "2026-04-01",
      to: "2026-04-15",
    };
    const { result } = renderHook(() => useMeActivityQuery(params), {
      wrapper: createQueryWrapper(),
    });

    await waitFor(() => {
      expect(result.current.data?.filters.kind).toBe("topup");
    });
    expect(mockedGetMeActivity).toHaveBeenCalledWith(params);
  });

  it("does not call services when there is no active session", () => {
    useAuthStore.setState((state) => ({
      ...state,
      session: null,
    }));

    renderHook(() => useMeProfileQuery(), {
      wrapper: createQueryWrapper(),
    });

    expect(mockedGetMeProfile).not.toHaveBeenCalled();
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

function createDashboardData() {
  return {
    timezone: "America/Buenos_Aires",
    user: {
      user_id: "user-1",
      name: "Lucas",
      email: "lucas@example.com",
    },
    wallet: {
      balance: 1000,
    },
    transfers: {
      sent_total: 100,
      received_total: 200,
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
    recent_transfers: [],
    recent_topups: [],
  };
}
