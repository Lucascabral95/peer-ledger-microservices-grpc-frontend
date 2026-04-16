import { act, renderHook } from "@testing-library/react";

import { useAuthStore } from "@/lib/store";
import { useCreateTopUpMutation } from "@/presentation/hooks/use-create-topup-mutation";
import { useMeTopupsQuery } from "@/presentation/hooks/use-me-topups-query";
import { useMeWalletQuery } from "@/presentation/hooks/use-me-wallet-query";
import { useWalletViewModel } from "@/presentation/hooks/use-wallet-view-model";

jest.mock("@/presentation/hooks/use-create-topup-mutation");
jest.mock("@/presentation/hooks/use-me-topups-query");
jest.mock("@/presentation/hooks/use-me-wallet-query");

const mockedUseCreateTopUpMutation = jest.mocked(useCreateTopUpMutation);
const mockedUseMeTopupsQuery = jest.mocked(useMeTopupsQuery);
const mockedUseMeWalletQuery = jest.mocked(useMeWalletQuery);

describe("useWalletViewModel", () => {
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
    mockedUseMeWalletQuery.mockReturnValue(createWalletQueryResult());
    mockedUseMeTopupsQuery.mockReturnValue(createTopupsQueryResult());
    mockedUseCreateTopUpMutation.mockReturnValue(createMutationResult());
  });

  it("builds wallet view model from wallet and topups", () => {
    const { result } = renderHook(() => useWalletViewModel());

    expect(result.current.wallet?.balance.amount).toBe(3000);
    expect(result.current.wallet?.topups).toHaveLength(1);
    expect(result.current.isMissingSession).toBe(false);
  });

  it("marks missing session when there is no token", () => {
    useAuthStore.setState((state) => ({
      ...state,
      session: null,
    }));

    const { result } = renderHook(() => useWalletViewModel());

    expect(result.current.isMissingSession).toBe(true);
  });

  it("returns total error when wallet fails", () => {
    mockedUseMeWalletQuery.mockReturnValue(
      createWalletQueryResult({
        data: undefined,
        isError: true,
        error: {
          message: "wallet unavailable",
        },
      }),
    );

    const { result } = renderHook(() => useWalletViewModel());

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe("wallet unavailable");
  });

  it("returns partial error when topups fail", () => {
    mockedUseMeTopupsQuery.mockReturnValue(
      createTopupsQueryResult({
        data: undefined,
        isError: true,
        error: {
          message: "topups unavailable",
        },
      }),
    );

    const { result } = renderHook(() => useWalletViewModel());

    expect(result.current.wallet?.balance.amount).toBe(3000);
    expect(result.current.hasTopupsError).toBe(true);
    expect(result.current.topupsErrorMessage).toBe("topups unavailable");
  });

  it("updates filters and resets page", () => {
    mockedUseMeTopupsQuery.mockReturnValue(
      createTopupsQueryResult({
        data: {
          ...createTopupsQueryResult().data,
          pagination: {
            page: 1,
            page_size: 8,
            has_next: true,
          },
        },
      }),
    );

    const { result } = renderHook(() => useWalletViewModel());

    act(() => result.current.nextPage());
    expect(result.current.filters.page).toBe(2);

    act(() => result.current.setFrom("2026-04-01"));
    expect(result.current.filters.from).toBe("2026-04-01");
    expect(result.current.filters.page).toBe(1);
  });

  it("submits topup payload with session user id", async () => {
    const mutateAsync = jest.fn(async () => ({
      user_id: "user-1",
      balance: 3500,
    }));
    mockedUseCreateTopUpMutation.mockReturnValue(
      createMutationResult({ mutateAsync }),
    );

    const { result } = renderHook(() => useWalletViewModel());

    await act(async () => {
      await result.current.submitTopUp({
        amount: 500,
      });
    });

    expect(mutateAsync).toHaveBeenCalledWith({
      user_id: "user-1",
      amount: 500,
    });
    expect(result.current.submitState.successMessage).toContain(
      "Recarga realizada con exito",
    );
  });

  it("maps topup submit error", async () => {
    const mutateAsync = jest.fn(async () => {
      throw {
        message: "topup rejected",
      };
    });
    mockedUseCreateTopUpMutation.mockReturnValue(
      createMutationResult({ mutateAsync }),
    );

    const { result } = renderHook(() => useWalletViewModel());

    await act(async () => {
      await result.current.submitTopUp({
        amount: 500,
      });
    });

    expect(result.current.submitState.errorMessage).toBe("topup rejected");
  });
});

function createWalletQueryResult(overrides = {}) {
  return {
    data: {
      timezone: "America/Buenos_Aires",
      user_id: "user-1",
      balance: 3000,
      topups: {
        count_total: 2,
        amount_total: 3000,
        count_today: 1,
        amount_today: 1000,
      },
    },
    error: null,
    isPending: false,
    isError: false,
    refetch: jest.fn(async () => undefined),
    ...overrides,
  } as unknown as ReturnType<typeof useMeWalletQuery>;
}

function createTopupsQueryResult(overrides = {}) {
  return {
    data: {
      timezone: "America/Buenos_Aires",
      items: [
        {
          id: "topup-1",
          kind: "topup" as const,
          status: "completed" as const,
          amount: 1000,
          balance_after: 3000,
          created_at: "2026-04-16T12:00:00.000Z",
        },
      ],
      pagination: {
        page: 1,
        page_size: 8,
        has_next: false,
      },
      filters: {
        from: null,
        to: null,
      },
    },
    error: null,
    isPending: false,
    isError: false,
    refetch: jest.fn(async () => undefined),
    ...overrides,
  } as unknown as ReturnType<typeof useMeTopupsQuery>;
}

function createMutationResult(overrides = {}) {
  return {
    mutateAsync: jest.fn(async () => ({
      user_id: "user-1",
      balance: 3500,
    })),
    reset: jest.fn(),
    isPending: false,
    ...overrides,
  } as unknown as ReturnType<typeof useCreateTopUpMutation>;
}
