import { act, renderHook } from "@testing-library/react";

import { useAuthStore } from "@/lib/store";
import { useHistoryViewModel } from "@/presentation/hooks/use-history-view-model";
import { useMeActivityQuery } from "@/presentation/hooks/use-me-activity-query";

jest.mock("@/presentation/hooks/use-me-activity-query");

const mockedUseMeActivityQuery = jest.mocked(useMeActivityQuery);

describe("useHistoryViewModel", () => {
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

  it("returns a history view model from activity data", () => {
    mockedUseMeActivityQuery.mockReturnValue(createActivityQueryResult());

    const { result } = renderHook(() => useHistoryViewModel());

    expect(result.current.history?.rows).toHaveLength(1);
    expect(result.current.history?.rows[0].directionLabel).toBe("Recibida");
    expect(result.current.filters.kind).toBe("all");
  });

  it("updates filters and resets page", () => {
    mockedUseMeActivityQuery.mockReturnValue(createActivityQueryResult());

    const { result } = renderHook(() => useHistoryViewModel());

    act(() => result.current.nextPage());
    expect(result.current.filters.page).toBe(2);

    act(() => result.current.setKind("transfer"));
    expect(result.current.filters.kind).toBe("transfer");
    expect(result.current.filters.page).toBe(1);
  });

  it("marks missing session when there is no token", () => {
    useAuthStore.setState((state) => ({
      ...state,
      session: null,
    }));
    mockedUseMeActivityQuery.mockReturnValue(createActivityQueryResult());

    const { result } = renderHook(() => useHistoryViewModel());

    expect(result.current.isMissingSession).toBe(true);
  });

  it("returns query error state", () => {
    mockedUseMeActivityQuery.mockReturnValue(
      createActivityQueryResult({
        data: undefined,
        isError: true,
        error: {
          message: "activity unavailable",
        },
      }),
    );

    const { result } = renderHook(() => useHistoryViewModel());

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe("activity unavailable");
  });
});

function createActivityQueryResult(overrides = {}) {
  return {
    data: {
      timezone: "America/Buenos_Aires",
      items: [
        {
          id: "activity-1",
          kind: "transfer_received" as const,
          status: "completed" as const,
          amount: 1000,
          balance_after: 2000,
          counterparty_name: "Ana",
          created_at: "2026-04-16T12:00:00.000Z",
        },
      ],
      pagination: {
        page: 1,
        page_size: 10,
        has_next: true,
      },
      filters: {
        kind: "all" as const,
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
