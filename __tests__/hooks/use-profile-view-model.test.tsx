import { renderHook, waitFor } from "@testing-library/react";

import { useAuthStore } from "@/lib/store";
import { useMeProfileQuery } from "@/presentation/hooks/use-me-profile-query";
import { useProfileViewModel } from "@/presentation/hooks/use-profile-view-model";

jest.mock("@/presentation/hooks/use-me-profile-query");

const mockedUseMeProfileQuery = jest.mocked(useMeProfileQuery);

describe("useProfileViewModel", () => {
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

  it("returns a profile view model when query has data", () => {
    mockedUseMeProfileQuery.mockReturnValue(
      createQueryResult({
        data: {
          user_id: "bac81847-0eef-427d-8025",
          name: "Lucas Cabral",
          email: "lucas@example.com",
        },
      }),
    );

    const { result } = renderHook(() => useProfileViewModel());

    expect(result.current.profile?.displayName).toBe("Lucas Cabral");
    expect(result.current.profile?.shortUserId).toBe("bac81847...");
    expect(result.current.isMissingSession).toBe(false);
  });

  it("marks missing session when there is no token", () => {
    useAuthStore.setState((state) => ({
      ...state,
      session: null,
    }));
    mockedUseMeProfileQuery.mockReturnValue(createQueryResult());

    const { result } = renderHook(() => useProfileViewModel());

    expect(result.current.isMissingSession).toBe(true);
    expect(result.current.profile).toBeNull();
  });

  it("returns query error state and message", () => {
    mockedUseMeProfileQuery.mockReturnValue(
      createQueryResult({
        isError: true,
        error: {
          message: "profile unavailable",
        },
      }),
    );

    const { result } = renderHook(() => useProfileViewModel());

    expect(result.current.isError).toBe(true);
    expect(result.current.errorMessage).toBe("profile unavailable");
  });

  it("delegates refetch to the query", async () => {
    const refetch = jest.fn(async () => undefined);
    mockedUseMeProfileQuery.mockReturnValue(createQueryResult({ refetch }));

    const { result } = renderHook(() => useProfileViewModel());

    await waitFor(async () => {
      await result.current.refetch();
      expect(refetch).toHaveBeenCalledTimes(1);
    });
  });
});

function createQueryResult(overrides = {}) {
  return {
    data: undefined,
    error: null,
    isPending: false,
    isError: false,
    refetch: jest.fn(async () => undefined),
    ...overrides,
  } as unknown as ReturnType<typeof useMeProfileQuery>;
}
