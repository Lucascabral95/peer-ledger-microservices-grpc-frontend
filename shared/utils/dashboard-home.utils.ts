import type {
  GetHistoryResponseInterface,
  MeDashboardDataInterface,
  MeDashboardOperationStatus,
  MeDashboardRecentTopupInterface,
  MeDashboardRecentTransferInterface,
  TransactionRecordInterface,
} from "@/domain/interfaces";
import type {
  DashboardAlertModel,
  DashboardBalanceSummaryModel,
  DashboardHomeModel,
  DashboardLatestTransferModel,
  DashboardMetricsModel,
  DashboardTopupSummaryModel,
} from "@/domain/models";
import {
  AUTH_ROUTES,
  DASHBOARD_HOME_QUICK_ACTIONS,
} from "@/shared/constants";

import { parseJwtExpiration } from "./auth-session.utils";

interface BuildDashboardHomeModelParams {
  userId: string;
  userName: string;
  token?: string | null;
  history?: GetHistoryResponseInterface | null;
  now?: Date;
}

interface DashboardAlertOptions {
  transactions: TransactionRecordInterface[];
  token?: string | null;
  now?: Date;
}

interface BuildDashboardHomeModelFromMeDashboardParams {
  dashboard: MeDashboardDataInterface;
  token?: string | null;
  now?: Date;
}

export function buildDashboardHomeModel({
  userId,
  userName,
  token,
  history,
  now = new Date(),
}: BuildDashboardHomeModelParams): DashboardHomeModel {
  const transactions = sortTransactionsByDateDesc(history?.transactions ?? []);

  return {
    greetingName: userName || "Usuario",
    sessionStatusLabel: getSessionStatusLabel(token, now),
    balance: getBalanceSummary(transactions),
    metrics: getDashboardMetrics(transactions, userId, now),
    latestTransfers: getLatestTransfers(transactions, userId),
    topupSummary: getTopupSummary(transactions, now),
    alerts: getOperationalAlerts({ transactions, token, now }),
    quickActions: DASHBOARD_HOME_QUICK_ACTIONS,
  };
}

export function buildDashboardHomeModelFromMeDashboard({
  dashboard,
  token,
  now = new Date(),
}: BuildDashboardHomeModelFromMeDashboardParams): DashboardHomeModel {
  const latestUpdate = getLatestMeDashboardUpdateDate(
    dashboard.recent_transfers,
    dashboard.recent_topups,
  );

  return {
    greetingName: dashboard.user.name || "Usuario",
    sessionStatusLabel: getSessionStatusLabel(token, now),
    balance: {
      amount: dashboard.wallet.balance,
      lastUpdatedAt: latestUpdate,
    },
    metrics: {
      moneySent: dashboard.transfers.sent_total,
      moneyReceived: dashboard.transfers.received_total,
      activityToday: dashboard.activity_today.total_events,
      topupsCount: dashboard.topups.count_total,
    },
    latestTransfers: dashboard.recent_transfers.slice(0, 5).map((transfer) => ({
      id: transfer.id,
      date: transfer.created_at,
      counterparty: getCounterpartyLabel({
        name: transfer.counterparty_name,
        id: transfer.counterparty_id,
      }),
      amount: transfer.amount,
      direction: getMeDashboardTransferDirection(transfer),
      status: transfer.status,
    })),
    topupSummary: {
      count: dashboard.topups.count_total,
      lastTopupAmount: dashboard.recent_topups[0]?.amount ?? null,
      lastTopupDate: dashboard.recent_topups[0]?.created_at ?? null,
    },
    alerts: getMeDashboardOperationalAlerts({
      recentTransfers: dashboard.recent_transfers,
      recentTopups: dashboard.recent_topups,
      token,
      now,
    }),
    quickActions: DASHBOARD_HOME_QUICK_ACTIONS,
  };
}

export function getBalanceSummary(
  transactions: TransactionRecordInterface[],
): DashboardBalanceSummaryModel {
  const orderedTransactions = sortTransactionsByDateDesc(transactions);
  const latestBalanceTransaction = orderedTransactions.find(
    (transaction) =>
      transaction.status === "completed" &&
      typeof transaction.balance_after === "number",
  );

  if (!latestBalanceTransaction) {
    return {
      amount: null,
      lastUpdatedAt: null,
    };
  }

  return {
    amount: latestBalanceTransaction.balance_after ?? null,
    lastUpdatedAt:
      latestBalanceTransaction.updated_at ?? latestBalanceTransaction.created_at,
  };
}

export function getDashboardMetrics(
  transactions: TransactionRecordInterface[],
  userId: string,
  now = new Date(),
): DashboardMetricsModel {
  const recentTransactions = getTransactionsWithinDays(transactions, 30, now);
  const todayTransactions = transactions.filter((transaction) =>
    isSameLocalDay(transaction.created_at, now),
  );

  return {
    moneySent: recentTransactions
      .filter(
        (transaction) =>
          transaction.type === "transfer" &&
          transaction.sender_id === userId &&
          transaction.status === "completed",
      )
      .reduce((total, transaction) => total + transaction.amount, 0),
    moneyReceived: recentTransactions
      .filter(
        (transaction) =>
          transaction.type === "transfer" &&
          transaction.receiver_id === userId &&
          transaction.status === "completed",
      )
      .reduce((total, transaction) => total + transaction.amount, 0),
    activityToday: todayTransactions.length,
    topupsCount: recentTransactions.filter(
      (transaction) =>
        transaction.type === "topup" && transaction.status === "completed",
    ).length,
  };
}

export function getLatestTransfers(
  transactions: TransactionRecordInterface[],
  userId: string,
): DashboardLatestTransferModel[] {
  return sortTransactionsByDateDesc(transactions)
    .filter((transaction) => transaction.type === "transfer")
    .slice(0, 5)
    .map((transaction) => {
      const isSent = transaction.sender_id === userId;
      const counterpartyId = isSent
        ? transaction.receiver_id
        : transaction.sender_id;

      return {
        id: transaction.transaction_id,
        date: transaction.created_at,
        counterparty: getCounterpartyLabel({
          name: transaction.counterparty_name,
          id: counterpartyId,
        }),
        amount: transaction.amount,
        direction: isSent ? "sent" : "received",
        status: transaction.status,
      };
    });
}

export function getTopupSummary(
  transactions: TransactionRecordInterface[],
  now = new Date(),
): DashboardTopupSummaryModel {
  const recentTopups = sortTransactionsByDateDesc(
    getTransactionsWithinDays(transactions, 30, now).filter(
      (transaction) =>
        transaction.type === "topup" && transaction.status === "completed",
    ),
  );

  const latestTopup = recentTopups.find(
    (transaction) => transaction.type === "topup",
  );

  return {
    count: recentTopups.length,
    lastTopupAmount: latestTopup?.amount ?? null,
    lastTopupDate: latestTopup?.created_at ?? null,
  };
}

export function getOperationalAlerts({
  transactions,
  token,
  now = new Date(),
}: DashboardAlertOptions): DashboardAlertModel[] {
  const recentTransactions = sortTransactionsByDateDesc(
    getTransactionsWithinDays(transactions, 7, now),
  );
  const alerts: DashboardAlertModel[] = [];

  if (recentTransactions.some((transaction) => transaction.status === "blocked")) {
    alerts.push({
      id: "blocked-transfer",
      severity: "danger",
      message: "Una transferencia reciente fue bloqueada por seguridad.",
    });
  }

  if (recentTransactions.some((transaction) => transaction.status === "partial")) {
    alerts.push({
      id: "partial-operation",
      severity: "warning",
      message: "Una operacion se completo parcialmente. Revisa su estado.",
    });
  }

  if (recentTransactions.some((transaction) => transaction.status === "failed")) {
    alerts.push({
      id: "failed-operation",
      severity: "warning",
      message: "Una operacion reciente fallo. Revisa el detalle en historial.",
    });
  }

  if (isSessionExpiringSoon(token, now)) {
    alerts.push({
      id: "session-expiring",
      severity: "info",
      message:
        "Tu sesion esta por expirar y se renovara automaticamente si sigue siendo valida.",
    });
  }

  if (alerts.length > 0) {
    return alerts;
  }

  return [
    {
      id: "healthy-state",
      severity: "info",
      message: "No hay alertas operativas por ahora.",
    },
  ];
}

function getMeDashboardOperationalAlerts({
  recentTransfers,
  recentTopups,
  token,
  now,
}: {
  recentTransfers: MeDashboardRecentTransferInterface[];
  recentTopups: MeDashboardRecentTopupInterface[];
  token?: string | null;
  now: Date;
}): DashboardAlertModel[] {
  const statuses = [...recentTransfers, ...recentTopups].map(
    (event) => event.status,
  );
  const alerts = getAlertsFromStatuses(statuses);

  if (isSessionExpiringSoon(token, now)) {
    alerts.push({
      id: "session-expiring",
      severity: "info",
      message:
        "Tu sesion esta por expirar y se renovara automaticamente si sigue siendo valida.",
    });
  }

  if (alerts.length > 0) {
    return alerts;
  }

  return [
    {
      id: "healthy-state",
      severity: "info",
      message: "No hay alertas operativas por ahora.",
    },
  ];
}

export function formatDashboardAmount(amount: number | null): string {
  if (typeof amount !== "number") {
    return "Saldo no disponible";
  }

  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDashboardDate(date: string | null): string {
  if (!date) {
    return "Sin actualizacion reciente";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function getSessionStatusLabel(
  token?: string | null,
  now = new Date(),
): string {
  return isSessionExpiringSoon(token, now)
    ? "Sesion proxima a renovar"
    : "Sesion activa";
}

function sortTransactionsByDateDesc(
  transactions: TransactionRecordInterface[],
): TransactionRecordInterface[] {
  return [...transactions].sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  );
}

function getTransactionsWithinDays(
  transactions: TransactionRecordInterface[],
  days: number,
  now: Date,
): TransactionRecordInterface[] {
  const windowStart = new Date(now);
  windowStart.setDate(windowStart.getDate() - days);

  return transactions.filter(
    (transaction) => new Date(transaction.created_at).getTime() >= windowStart.getTime(),
  );
}

function isSameLocalDay(date: string, now: Date): boolean {
  const target = new Date(date);

  return (
    target.getFullYear() === now.getFullYear() &&
    target.getMonth() === now.getMonth() &&
    target.getDate() === now.getDate()
  );
}

function getCounterpartyLabel({
  name,
  id,
}: {
  name?: string | null;
  id?: string | null;
}): string {
  const normalizedName = name?.trim();

  if (normalizedName) {
    return normalizedName;
  }

  return truncateCounterparty(id);
}

function truncateCounterparty(counterpartyId?: string | null): string {
  const normalizedCounterpartyId = counterpartyId?.trim();

  if (!normalizedCounterpartyId) {
    return "Contraparte no disponible";
  }

  if (normalizedCounterpartyId.length <= 8) {
    return normalizedCounterpartyId;
  }

  return `${normalizedCounterpartyId.slice(0, 8)}...`;
}

function getLatestMeDashboardUpdateDate(
  recentTransfers: MeDashboardRecentTransferInterface[],
  recentTopups: MeDashboardRecentTopupInterface[],
): string | null {
  const latestEvent = [...recentTransfers, ...recentTopups].sort(
    (left, right) =>
      new Date(right.created_at).getTime() - new Date(left.created_at).getTime(),
  )[0];

  return latestEvent?.created_at ?? null;
}

function getMeDashboardTransferDirection(
  transfer: MeDashboardRecentTransferInterface,
): DashboardLatestTransferModel["direction"] {
  if (transfer.kind === "transfer_received") {
    return "received";
  }

  if (transfer.direction) {
    return transfer.direction;
  }

  return "sent";
}

function getAlertsFromStatuses(
  statuses: Array<TransactionRecordInterface["status"] | MeDashboardOperationStatus>,
): DashboardAlertModel[] {
  const alerts: DashboardAlertModel[] = [];

  if (statuses.includes("blocked")) {
    alerts.push({
      id: "blocked-transfer",
      severity: "danger",
      message: "Una transferencia reciente fue bloqueada por seguridad.",
    });
  }

  if (statuses.includes("partial")) {
    alerts.push({
      id: "partial-operation",
      severity: "warning",
      message: "Una operacion se completo parcialmente. Revisa su estado.",
    });
  }

  if (statuses.includes("failed")) {
    alerts.push({
      id: "failed-operation",
      severity: "warning",
      message: "Una operacion reciente fallo. Revisa el detalle en historial.",
    });
  }

  return alerts;
}

function isSessionExpiringSoon(token?: string | null, now = new Date()): boolean {
  const expiration = parseJwtExpiration(token);

  if (!expiration) {
    return false;
  }

  return expiration - Math.floor(now.getTime() / 1000) <= 15 * 60;
}

export function getMissingSessionHref(): string {
  return AUTH_ROUTES.login;
}
