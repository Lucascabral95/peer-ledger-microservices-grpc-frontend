import { httpClient } from "@/infrastructure/http";
import { createTransfer } from "@/infrastructure/services/transfer-service";
import { TRANSFER_ENDPOINTS } from "@/shared/constants";

jest.mock("@/infrastructure/http", () => ({
  httpClient: jest.fn(),
}));

const mockedHttpClient = jest.mocked(httpClient);

describe("transfer-service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedHttpClient.mockResolvedValue({
      transaction_id: "tx-1",
      sender_balance: 900,
    });
  });

  it("creates a transfer through POST /transfers", async () => {
    const payload = {
      sender_id: "sender-1",
      receiver_id: "receiver-1",
      amount: 100,
      idempotency_key: "idem-1",
    };

    await createTransfer(payload);

    expect(mockedHttpClient).toHaveBeenCalledWith({
      url: TRANSFER_ENDPOINTS.create,
      method: "post",
      data: payload,
    });
  });
});
