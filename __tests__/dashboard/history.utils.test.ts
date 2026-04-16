import type { MeActivityItemInterface } from "@/domain/interfaces";
import {
  buildHistoryViewModel,
  formatHistoryAmount,
  getActivityDirectionLabel,
  getActivityStatusLabel,
  getHistoryCounterparty,
  mapActivityItemToHistoryRow,
} from "@/shared/utils";

describe("history utils", () => {
  it("maps transfer_received as Recibida and transfer_sent as Enviada", () => {
    expect(
      getActivityDirectionLabel(
        createActivityItem({ kind: "transfer_received", direction: undefined }),
      ),
    ).toBe("Recibida");
    expect(
      getActivityDirectionLabel(
        createActivityItem({ kind: "transfer_sent", direction: undefined }),
      ),
    ).toBe("Enviada");
  });

  it("uses direction fallback for generic transfers", () => {
    expect(
      getActivityDirectionLabel(
        createActivityItem({ kind: "transfer", direction: "received" }),
      ),
    ).toBe("Recibida");
  });

  it("maps status labels", () => {
    expect(getActivityStatusLabel("completed")).toBe("Completada");
    expect(getActivityStatusLabel("blocked")).toBe("Bloqueada");
    expect(getActivityStatusLabel("failed")).toBe("Fallida");
    expect(getActivityStatusLabel("partial")).toBe("Parcial");
  });

  it("builds counterparty fallbacks", () => {
    expect(getHistoryCounterparty(createActivityItem({ counterparty_name: "Ana" }))).toBe(
      "Ana",
    );
    expect(
      getHistoryCounterparty(
        createActivityItem({
          counterparty_name: undefined,
          counterparty_id: "bac81847-0eef-427d",
        }),
      ),
    ).toBe("bac81847...");
    expect(getHistoryCounterparty(createActivityItem({ kind: "topup" }))).toBe(
      "Recarga de saldo",
    );
  });

  it("maps rows with amount, date and status", () => {
    const row = mapActivityItemToHistoryRow(createActivityItem());

    expect(row.amountLabel).toBe(formatHistoryAmount(1200));
    expect(row.statusLabel).toBe("Completada");
    expect(row.balanceAfterLabel).toBe("2.000,00");
  });

  it("builds summary counts for current page", () => {
    const history = buildHistoryViewModel({
      timezone: "America/Buenos_Aires",
      items: [
        createActivityItem({ id: "1", kind: "transfer_sent" }),
        createActivityItem({ id: "2", kind: "topup" }),
        createActivityItem({ id: "3", status: "blocked" }),
      ],
      pagination: {
        page: 1,
        page_size: 10,
        has_next: true,
      },
      filters: {
        kind: "all",
        from: null,
        to: null,
      },
    });

    expect(history.summary.find((item) => item.id === "events")?.value).toBe("3");
    expect(history.summary.find((item) => item.id === "transfers")?.value).toBe(
      "2",
    );
    expect(history.summary.find((item) => item.id === "topups")?.value).toBe("1");
    expect(history.summary.find((item) => item.id === "alerts")?.value).toBe("1");
    expect(history.pagination.hasNext).toBe(true);
  });
});

function createActivityItem(
  overrides: Partial<MeActivityItemInterface> = {},
): MeActivityItemInterface {
  return {
    id: "activity-1",
    kind: "transfer_sent",
    status: "completed",
    amount: 1200,
    balance_after: 2000,
    direction: "sent",
    counterparty_id: "receiver-1",
    counterparty_name: "Receiver",
    created_at: "2026-04-16T12:00:00.000Z",
    ...overrides,
  };
}
