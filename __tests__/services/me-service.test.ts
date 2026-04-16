import { httpClient } from "@/infrastructure/http";
import {
  getMeActivity,
  getMeDashboard,
  getMeProfile,
  getMeTopups,
  getMeWallet,
} from "@/infrastructure/services/me-service";
import { ME_ENDPOINTS } from "@/shared/constants";

jest.mock("@/infrastructure/http", () => ({
  httpClient: jest.fn(),
}));

const mockedHttpClient = jest.mocked(httpClient);

describe("me-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedHttpClient.mockResolvedValue({
      error: false,
      message: "ok",
      data: {},
    });
  });

  it("requests /me/profile", async () => {
    await getMeProfile();

    expect(mockedHttpClient).toHaveBeenCalledWith({
      url: ME_ENDPOINTS.profile,
      method: "get",
    });
  });

  it("requests /me/dashboard", async () => {
    await getMeDashboard();

    expect(mockedHttpClient).toHaveBeenCalledWith({
      url: ME_ENDPOINTS.dashboard,
      method: "get",
    });
  });

  it("requests /me/wallet", async () => {
    await getMeWallet();

    expect(mockedHttpClient).toHaveBeenCalledWith({
      url: ME_ENDPOINTS.wallet,
      method: "get",
    });
  });

  it("requests /me/topups with pagination params", async () => {
    await getMeTopups({ page: 2, page_size: 20 });

    expect(mockedHttpClient).toHaveBeenCalledWith({
      url: ME_ENDPOINTS.topups,
      method: "get",
      params: {
        page: 2,
        page_size: 20,
      },
    });
  });

  it("requests /me/activity with filters and omits kind all", async () => {
    await getMeActivity({
      kind: "all",
      from: "2026-04-01",
      to: "2026-04-15",
    });

    expect(mockedHttpClient).toHaveBeenCalledWith({
      url: ME_ENDPOINTS.activity,
      method: "get",
      params: {
        from: "2026-04-01",
        to: "2026-04-15",
      },
    });
  });

  it("requests /me/activity with a concrete kind", async () => {
    await getMeActivity({ kind: "topup", page: 1, page_size: 10 });

    expect(mockedHttpClient).toHaveBeenCalledWith({
      url: ME_ENDPOINTS.activity,
      method: "get",
      params: {
        page: 1,
        page_size: 10,
        kind: "topup",
      },
    });
  });
});
