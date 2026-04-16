import type { MeActivityItemInterface } from "@/domain/interfaces";
import {
  buildTransferPayload,
  createTransferIdempotencyKey,
  getTransferErrorMessage,
  getTransferRetryAfterSeconds,
  mapActivityItemToRecentTransfer,
} from "@/shared/utils";

describe("transfer utils", () => {
  it("generates an idempotency key", () => {
    expect(createTransferIdempotencyKey()).toEqual(expect.any(String));
  });

  it("builds transfer payload with sender and idempotency key", () => {
    expect(
      buildTransferPayload({
        senderId: "sender-1",
        values: {
          receiver_id: " receiver-1 ",
          amount: 100,
        },
        idempotencyKey: "idem-1",
      }),
    ).toEqual({
      sender_id: "sender-1",
      receiver_id: "receiver-1",
      amount: 100,
      idempotency_key: "idem-1",
    });
  });

  it("returns fraud messages from rule_code", () => {
    expect(
      getTransferErrorMessage({
        message: "blocked",
        rule_code: "max_transfer_amount",
      }),
    ).toBe("El monto supera el maximo permitido por transferencia.");
  });

  it("returns Retry-After seconds", () => {
    expect(getTransferRetryAfterSeconds({ retryAfter: "8" })).toBe(8);
    expect(getTransferRetryAfterSeconds({ retryAfter: "invalid" })).toBeNull();
  });

  it("maps recent transfers direction", () => {
    const transfer = mapActivityItemToRecentTransfer(createActivityItem());

    expect(transfer.directionLabel).toBe("Recibida");
    expect(transfer.statusLabel).toBe("Completada");
    expect(transfer.amountLabel).toBe("1.000,00");
  });
});

function createActivityItem(): MeActivityItemInterface {
  return {
    id: "activity-1",
    kind: "transfer_received",
    status: "completed",
    amount: 1000,
    balance_after: 2000,
    counterparty_id: "sender-1",
    counterparty_name: "Sender",
    created_at: "2026-04-16T12:00:00.000Z",
  };
}
