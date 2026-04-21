import type { GetHistoryResponseInterface } from "@/domain/interfaces";
import {
  buildDashboardHomeModelFromMeDashboard,
  buildDashboardHomeModel,
  getBalanceSummary,
  getDashboardMetrics,
  getLatestTransfers,
  getOperationalAlerts,
  getTopupSummary,
} from "@/shared/utils";

const NOW = new Date("2026-04-15T15:00:00.000Z");

const historyFixture: GetHistoryResponseInterface = {
  transactions: [
    {
      transaction_id: "tx-1",
      sender_id: "user-1",
      receiver_id: "user-2",
      amount: 1200,
      status: "completed",
      type: "transfer",
      created_at: "2026-04-15T14:00:00.000Z",
      updated_at: "2026-04-15T14:01:00.000Z",
      balance_after: 7800,
      counterparty_name: "Ana Ruiz",
    },
    {
      transaction_id: "tx-2",
      sender_id: "user-3",
      receiver_id: "user-1",
      amount: 850,
      status: "completed",
      type: "transfer",
      created_at: "2026-04-15T11:30:00.000Z",
      counterparty_name: "Marco Diaz",
    },
    {
      transaction_id: "tx-3",
      sender_id: "bank",
      receiver_id: "user-1",
      amount: 5000,
      status: "completed",
      type: "topup",
      created_at: "2026-04-10T12:00:00.000Z",
      balance_after: 9000,
    },
    {
      transaction_id: "tx-4",
      sender_id: "user-1",
      receiver_id: "user-4",
      amount: 300,
      status: "blocked",
      type: "transfer",
      created_at: "2026-04-14T12:00:00.000Z",
    },
    {
      transaction_id: "tx-5",
      sender_id: "user-5",
      receiver_id: "user-1",
      amount: 100,
      status: "partial",
      type: "transfer",
      created_at: "2026-04-13T12:00:00.000Z",
    },
    {
      transaction_id: "tx-6",
      sender_id: "user-1",
      receiver_id: "user-6",
      amount: 75,
      status: "failed",
      type: "transfer",
      created_at: "2026-04-12T12:00:00.000Z",
    },
    {
      transaction_id: "tx-7",
      sender_id: "user-7",
      receiver_id: "user-1",
      amount: 40,
      status: "completed",
      type: "transfer",
      created_at: "2026-04-11T12:00:00.000Z",
    },
    {
      transaction_id: "tx-8",
      sender_id: "user-1",
      receiver_id: "user-8",
      amount: 20,
      status: "completed",
      type: "transfer",
      created_at: "2026-04-09T12:00:00.000Z",
    },
  ],
};

describe("dashboard-home utils", () => {
  it("derives the current balance from the latest completed transaction with balance", () => {
    const balance = getBalanceSummary(historyFixture.transactions);

    expect(balance.amount).toBe(7800);
    expect(balance.lastUpdatedAt).toBe("2026-04-15T14:01:00.000Z");
  });

  it("calculates sent, received, activity today and topups count", () => {
    const metrics = getDashboardMetrics(historyFixture.transactions, "user-1", NOW);

    expect(metrics.moneySent).toBe(1220);
    expect(metrics.moneyReceived).toBe(890);
    expect(metrics.activityToday).toBe(2);
    expect(metrics.topupsCount).toBe(1);
  });

  it("limits the latest transfers list to five items", () => {
    const latestTransfers = getLatestTransfers(historyFixture.transactions, "user-1");

    expect(latestTransfers).toHaveLength(5);
    expect(latestTransfers[0].counterparty).toBe("Ana Ruiz");
    expect(latestTransfers[0].direction).toBe("sent");
    expect(latestTransfers[1].direction).toBe("received");
  });

  it("falls back to counterparty id or an unavailable label", () => {
    const latestTransfers = getLatestTransfers(
      [
        {
          transaction_id: "tx-with-id",
          sender_id: "user-1",
          receiver_id: "external-counterparty-123",
          amount: 100,
          status: "completed",
          type: "transfer",
          created_at: "2026-04-15T14:00:00.000Z",
        },
        {
          transaction_id: "tx-without-id",
          sender_id: "user-1",
          receiver_id: "",
          amount: 50,
          status: "completed",
          type: "transfer",
          created_at: "2026-04-15T13:00:00.000Z",
        },
      ],
      "user-1",
    );

    expect(latestTransfers[0].counterparty).toBe("external...");
    expect(latestTransfers[1].counterparty).toBe("Contraparte no disponible");
  });

  it("summarizes recent topups with count and latest amount", () => {
    const topups = getTopupSummary(historyFixture.transactions, NOW);

    expect(topups.count).toBe(1);
    expect(topups.lastTopupAmount).toBe(5000);
    expect(topups.lastTopupDate).toBe("2026-04-10T12:00:00.000Z");
  });

  it("builds operational alerts for blocked, partial, failed and expiring session", () => {
    const token = createJwtToken(
      Math.floor(NOW.getTime() / 1000) + 10 * 60,
      "access",
    );

    const alerts = getOperationalAlerts({
      transactions: historyFixture.transactions,
      token,
      now: NOW,
    });

    expect(alerts.map((alert) => alert.message)).toEqual(
      expect.arrayContaining([
        "Una transferencia reciente fue bloqueada por seguridad.",
        "Una operacion se completo parcialmente. Revisa su estado.",
        "Una operacion reciente fallo. Revisa el detalle en historial.",
        "Tu sesion esta por expirar y se renovara automaticamente si sigue siendo valida.",
      ]),
    );
  });

  it("builds the dashboard view model with quick actions", () => {
    const dashboard = buildDashboardHomeModel({
      userId: "user-1",
      userName: "Lucas",
      history: historyFixture,
      now: NOW,
    });

    expect(dashboard.greetingName).toBe("Lucas");
    expect(dashboard.quickActions).toHaveLength(5);
    expect(dashboard.latestTransfers).toHaveLength(5);
  });

  it("builds the dashboard view model from /me/dashboard data", () => {
    const dashboard = buildDashboardHomeModelFromMeDashboard({
      dashboard: {
        timezone: "America/Buenos_Aires",
        user: {
          user_id: "user-1",
          name: "Lucas",
          email: "lucas@example.com",
        },
        wallet: {
          balance: 4500,
        },
        transfers: {
          sent_total: 1200,
          received_total: 850,
          sent_count_total: 4,
          received_count_total: 2,
        },
        topups: {
          count_total: 3,
          amount_total: 9000,
          count_today: 1,
          amount_today: 3000,
        },
        activity_today: {
          transfer_sent_count: 1,
          transfer_received_count: 1,
          topup_count: 1,
          total_events: 3,
        },
        recent_transfers: [
          {
            id: "transfer-1",
            kind: "transfer_sent",
            status: "blocked",
            amount: 500,
            counterparty_id: "user-2",
            counterparty_name: "Ana Ruiz",
            balance_after: 4000,
            created_at: "2026-04-15T14:00:00.000Z",
          },
          {
            id: "transfer-2",
            kind: "transfer_received",
            status: "partial",
            amount: 150,
            counterparty_id: "external-counterparty-123",
            created_at: "2026-04-15T13:00:00.000Z",
          },
          {
            id: "transfer-3",
            kind: "transfer_sent",
            status: "completed",
            amount: 80,
            created_at: "2026-04-15T12:30:00.000Z",
          },
        ],
        recent_topups: [
          {
            id: "topup-1",
            kind: "topup",
            status: "failed",
            amount: 3000,
            balance_after: 4500,
            created_at: "2026-04-15T12:00:00.000Z",
          },
        ],
      },
      now: NOW,
    });

    expect(dashboard.greetingName).toBe("Lucas");
    expect(dashboard.balance.amount).toBe(4500);
    expect(dashboard.balance.lastUpdatedAt).toBe("2026-04-15T14:00:00.000Z");
    expect(dashboard.metrics.moneySent).toBe(1200);
    expect(dashboard.metrics.moneyReceived).toBe(850);
    expect(dashboard.metrics.activityToday).toBe(3);
    expect(dashboard.metrics.topupsCount).toBe(3);
    expect(dashboard.latestTransfers[0]).toMatchObject({
      counterparty: "Ana Ruiz",
      direction: "sent",
      status: "blocked",
    });
    expect(dashboard.latestTransfers[1]).toMatchObject({
      direction: "received",
      status: "partial",
      counterparty: "external...",
    });
    expect(dashboard.latestTransfers[2]).toMatchObject({
      direction: "sent",
      status: "completed",
      counterparty: "Contraparte no disponible",
    });
    expect(dashboard.topupSummary).toMatchObject({
      count: 3,
      lastTopupAmount: 3000,
      lastTopupDate: "2026-04-15T12:00:00.000Z",
    });
    expect(dashboard.alerts.map((alert) => alert.id)).toEqual(
      expect.arrayContaining([
        "blocked-transfer",
        "partial-operation",
        "failed-operation",
      ]),
    );
  });
});

function createJwtToken(exp: number, typToken: "access" | "refresh") {
  const header = encodeBase64Url({
    alg: "HS256",
    typ: "JWT",
  });
  const payload = encodeBase64Url({
    sub: "user-1",
    name: "Lucas",
    email: "lucas@example.com",
    typ_token: typToken,
    iss: "peer-ledger-gateway",
    iat: exp - 3600,
    exp,
  });

  return `${header}.${payload}.signature`;
}

function encodeBase64Url(value: object) {
  return Buffer.from(JSON.stringify(value))
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}
