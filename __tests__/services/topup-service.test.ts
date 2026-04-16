import { httpClient } from "@/infrastructure/http";
import { createTopUp } from "@/infrastructure/services/topup-service";
import { TOPUP_ENDPOINTS } from "@/shared/constants";

jest.mock("@/infrastructure/http", () => ({
  httpClient: jest.fn(),
}));

const mockedHttpClient = jest.mocked(httpClient);

describe("topup-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedHttpClient.mockResolvedValue({
      user_id: "user-1",
      balance: 1500,
    });
  });

  it("creates a topup through POST /topups", async () => {
    const payload = {
      user_id: "user-1",
      amount: 500,
    };

    await createTopUp(payload);

    expect(mockedHttpClient).toHaveBeenCalledWith({
      url: TOPUP_ENDPOINTS.create,
      method: "post",
      data: payload,
    });
  });
});
