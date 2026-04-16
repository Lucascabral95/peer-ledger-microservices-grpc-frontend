import type {
  MeTopupItemInterface,
  MeTopupsDataInterface,
  MeWalletDataInterface,
} from "@/domain/interfaces";
import {
  buildTopUpPayload,
  buildWalletViewModel,
  formatWalletAmount,
  getWalletErrorMessage,
  getWalletToneByStatus,
  mapTopupItemToWalletTopup,
  truncateWalletUserId,
} from "@/shared/utils";

describe("wallet utils", () => {
  it("formats amounts with es-AR locale", () => {
    expect(formatWalletAmount(2500)).toBe("2.500,00");
  });

  it("truncates long user ids", () => {
    expect(truncateWalletUserId("bac81847-0eef-427d-8025")).toBe("bac81847...");
    expect(truncateWalletUserId("short-id")).toBe("short-id");
  });

  it("builds topup payload with user id", () => {
    expect(
      buildTopUpPayload({
        userId: "user-1",
        values: {
          amount: 700,
        },
      }),
    ).toEqual({
      user_id: "user-1",
      amount: 700,
    });
  });

  it("maps topup statuses and tones", () => {
    expect(mapTopupItemToWalletTopup(createTopup()).statusLabel).toBe(
      "Completada",
    );
    expect(getWalletToneByStatus("blocked")).toBe("danger");
    expect(getWalletToneByStatus("failed")).toBe("danger");
    expect(getWalletToneByStatus("partial")).toBe("warning");
  });

  it("builds metrics, alerts and empty state", () => {
    const wallet = buildWalletViewModel({
      wallet: createWallet(),
      topups: createTopups({
        items: [
          createTopup({
            id: "topup-blocked",
            status: "blocked",
          }),
        ],
      }),
    });

    expect(wallet.balance.amountLabel).toBe("5.000,00");
    expect(wallet.metrics).toHaveLength(4);
    expect(wallet.metrics[0].value).toBe("3");
    expect(wallet.alerts[0].message).toBe("Una recarga reciente fue bloqueada.");
    expect(wallet.emptyMessage).toBe(
      "Todavia no hay recargas para los filtros seleccionados.",
    );
  });

  it("generates healthy alert when there are no operational issues", () => {
    const wallet = buildWalletViewModel({
      wallet: createWallet(),
      topups: createTopups({
        items: [createTopup()],
      }),
    });

    expect(wallet.alerts[0].message).toBe(
      "No hay alertas operativas en tu billetera.",
    );
  });

  it("extracts backend error messages", () => {
    expect(getWalletErrorMessage({ message: "topup rejected" })).toBe(
      "topup rejected",
    );
    expect(getWalletErrorMessage(null)).toBe("No se pudo completar la recarga.");
  });
});

function createWallet(
  overrides: Partial<MeWalletDataInterface> = {},
): MeWalletDataInterface {
  return {
    timezone: "America/Buenos_Aires",
    user_id: "bac81847-0eef-427d-8025",
    balance: 5000,
    topups: {
      count_total: 3,
      amount_total: 5000,
      count_today: 1,
      amount_today: 1000,
    },
    ...overrides,
  };
}

function createTopups(
  overrides: Partial<MeTopupsDataInterface> = {},
): MeTopupsDataInterface {
  return {
    timezone: "America/Buenos_Aires",
    items: [createTopup()],
    pagination: {
      page: 1,
      page_size: 8,
      has_next: false,
    },
    filters: {
      from: null,
      to: null,
    },
    ...overrides,
  };
}

function createTopup(
  overrides: Partial<MeTopupItemInterface> = {},
): MeTopupItemInterface {
  return {
    id: "topup-1",
    kind: "topup",
    status: "completed",
    amount: 1000,
    balance_after: 5000,
    created_at: "2026-04-16T12:00:00.000Z",
    ...overrides,
  };
}
