import { act, renderHook } from "@testing-library/react";

import { useAuthStore } from "@/lib/store";
import { useCreateTransferMutation } from "@/presentation/hooks/use-create-transfer-mutation";
import { useMeActivityQuery } from "@/presentation/hooks/use-me-activity-query";
import { useMeWalletQuery } from "@/presentation/hooks/use-me-wallet-query";
import { useTransfersViewModel } from "@/presentation/hooks/use-transfers-view-model";

jest.mock("@/presentation/hooks/use-create-transfer-mutation");
jest.mock("@/presentation/hooks/use-me-activity-query");
jest.mock("@/presentation/hooks/use-me-wallet-query");

const mockedUseCreateTransferMutation = jest.mocked(useCreateTransferMutation);
const mockedUseMeActivityQuery = jest.mocked(useMeActivityQuery);
const mockedUseMeWalletQuery = jest.mocked(useMeWalletQuery);

describe("useTransfersViewModel", () => {
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
          user_id: "sender-1",
        },
      },
    }));
    mockedUseMeWalletQuery.mockReturnValue(createWalletQueryResult());
    mockedUseMeActivityQuery.mockReturnValue(createActivityQueryResult());
    mockedUseCreateTransferMutation.mockReturnValue(createMutationResult());
  });

  it("builds wallet and recent transfers", () => {
    const { result } = renderHook(() => useTransfersViewModel());

    expect(result.current.transfers?.wallet.balance).toBe(2000);
    expect(result.current.transfers?.recentTransfers[0].directionLabel).toBe(
      "Enviada",
    );
    expect(result.current.isMissingSession).toBe(false);
  });

  it("marks missing session when there is no token", () => {
    useAuthStore.setState((state) => ({
      ...state,
      session: null,
    }));

    const { result } = renderHook(() => useTransfersViewModel());

    expect(result.current.isMissingSession).toBe(true);
  });

  it("submits transfer payload with sender id", async () => {
    const mutateAsync = jest.fn(async () => ({
      transaction_id: "tx-1",
      sender_balance: 1900,
    }));
    mockedUseCreateTransferMutation.mockReturnValue(
      createMutationResult({ mutateAsync }),
    );

    const { result } = renderHook(() => useTransfersViewModel());

    await act(async () => {
      await result.current.submitTransfer({
        receiver_id: "receiver-1",
        amount: 100,
      });
    });

    expect(mutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({
        sender_id: "sender-1",
        receiver_id: "receiver-1",
        amount: 100,
      }),
    );
    expect(result.current.submitState.successMessage).toContain(
      "Transferencia enviada con exito",
    );
  });

  it("maps transfer error by rule_code and retry-after", async () => {
    const mutateAsync = jest.fn(async () => {
      throw {
        message: "blocked",
        rule_code: "max_transfer_amount",
        retryAfter: "9",
      };
    });
    mockedUseCreateTransferMutation.mockReturnValue(
      createMutationResult({ mutateAsync }),
    );

    const { result } = renderHook(() => useTransfersViewModel());

    await act(async () => {
      await result.current.submitTransfer({
        receiver_id: "receiver-1",
        amount: 21000,
      });
    });

    expect(result.current.submitState.errorMessage).toBe(
      "El monto supera el maximo permitido por transferencia.",
    );
    expect(result.current.submitState.retryAfterSeconds).toBe(9);
  });
});

function createWalletQueryResult(overrides = {}) {
  return {
    data: {
      timezone: "America/Buenos_Aires",
      user_id: "sender-1",
      balance: 2000,
      topups: {
        count_total: 1,
        amount_total: 2000,
        count_today: 0,
        amount_today: 0,
      },
    },
    error: null,
    isPending: false,
    isError: false,
    refetch: jest.fn(async () => undefined),
    ...overrides,
  } as unknown as ReturnType<typeof useMeWalletQuery>;
}

function createActivityQueryResult(overrides = {}) {
  return {
    data: {
      timezone: "America/Buenos_Aires",
      items: [
        {
          id: "activity-1",
          kind: "transfer_sent" as const,
          status: "completed" as const,
          amount: 100,
          counterparty_name: "Ana",
          created_at: "2026-04-16T12:00:00.000Z",
        },
      ],
      pagination: {
        page: 1,
        page_size: 5,
        has_next: false,
      },
      filters: {
        kind: "transfer" as const,
        from: null,
        to: null,
      },
    },
    error: null,
    isPending: false,
    isError: false,
    refetch: jest.fn(async () => undefined),
    ...overrides,
  } as unknown as ReturnType<typeof useMeActivityQuery>;
}

function createMutationResult(overrides = {}) {
  return {
    mutateAsync: jest.fn(async () => ({
      transaction_id: "tx-1",
      sender_balance: 1900,
    })),
    reset: jest.fn(),
    isPending: false,
    ...overrides,
  } as unknown as ReturnType<typeof useCreateTransferMutation>;
}
