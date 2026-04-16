import type {
  MeTopupItemInterface,
  MeTopupStatus,
  MeTopupsDataInterface,
  MeWalletDataInterface,
  TopUpRequestInterface,
} from "@/domain/interfaces";
import type {
  WalletAlertModel,
  WalletTone,
  WalletTopupFormValues,
  WalletTopupItemModel,
  WalletViewModel,
} from "@/domain/models";
import {
  WALLET_ACTIONS,
  WALLET_STATUS_LABELS,
  WALLET_TOPUP_FORM_LIMITS,
  WALLET_TOPUPS_PAGE_SIZE,
} from "@/shared/constants";

export function buildWalletViewModel(params: {
  wallet?: MeWalletDataInterface;
  topups?: MeTopupsDataInterface;
}): WalletViewModel {
  const topupItems = [...(params.topups?.items ?? [])].sort(
    (firstItem, secondItem) =>
      new Date(secondItem.created_at).getTime() -
      new Date(firstItem.created_at).getTime(),
  );
  const page = params.topups?.pagination.page ?? 1;
  const pageSize =
    params.topups?.pagination.page_size ?? WALLET_TOPUPS_PAGE_SIZE;
  const balance =
    typeof params.wallet?.balance === "number" ? params.wallet.balance : null;

  return {
    identity: {
      userId: params.wallet?.user_id ?? "",
      shortUserId: truncateWalletUserId(params.wallet?.user_id ?? ""),
      label: "Cuenta Peer Ledger",
    },
    balance: {
      amount: balance,
      amountLabel:
        balance !== null ? formatWalletAmount(balance) : "Saldo no disponible",
      helper:
        balance !== null
          ? "Disponible para recargas y transferencias P2P."
          : "No pudimos confirmar el saldo disponible.",
      tone: balance !== null ? "success" : "warning",
    },
    metrics: buildWalletMetrics(params.wallet),
    topupForm: {
      defaultValues: {
        amount: 0,
      },
      minAmount: WALLET_TOPUP_FORM_LIMITS.minAmount,
      helper: "El saldo se actualiza cuando el backend confirma la recarga.",
    },
    topups: topupItems.map(mapTopupItemToWalletTopup),
    pagination: {
      page,
      pageSize,
      hasNext: params.topups?.pagination.has_next ?? false,
      canGoBack: page > 1,
      label: `Pagina ${page}`,
    },
    filters: {
      from: params.topups?.filters.from ?? "",
      to: params.topups?.filters.to ?? "",
    },
    actions: WALLET_ACTIONS.map((action) => ({ ...action })),
    alerts: buildWalletAlerts(topupItems),
    emptyMessage: "Todavia no hay recargas para los filtros seleccionados.",
  };
}

export function mapTopupItemToWalletTopup(
  item: MeTopupItemInterface,
): WalletTopupItemModel {
  return {
    id: item.id,
    amount: item.amount,
    amountLabel: formatWalletAmount(item.amount),
    balanceAfter: item.balance_after,
    balanceAfterLabel: formatWalletAmount(item.balance_after),
    status: item.status,
    statusLabel: getWalletStatusLabel(item.status),
    date: item.created_at,
    dateLabel: formatWalletDate(item.created_at),
    tone: getWalletToneByStatus(item.status),
  };
}

export function buildTopUpPayload(params: {
  userId: string;
  values: WalletTopupFormValues;
}): TopUpRequestInterface {
  return {
    user_id: params.userId,
    amount: Number(params.values.amount),
  };
}

export function formatWalletAmount(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatWalletDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-AR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

export function getWalletStatusLabel(status: MeTopupStatus): string {
  return WALLET_STATUS_LABELS[status] ?? status;
}

export function getWalletToneByStatus(status: MeTopupStatus): WalletTone {
  if (status === "completed") {
    return "success";
  }

  if (status === "partial") {
    return "warning";
  }

  if (status === "blocked" || status === "failed") {
    return "danger";
  }

  return "info";
}

export function getWalletErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof error.message === "string"
  ) {
    return error.message;
  }

  return "No se pudo completar la recarga.";
}

export function truncateWalletUserId(userId: string): string {
  if (!userId) {
    return "No disponible";
  }

  if (userId.length <= 12) {
    return userId;
  }

  return `${userId.slice(0, 8)}...`;
}

function buildWalletMetrics(wallet?: MeWalletDataInterface) {
  const topups = wallet?.topups;

  return [
    {
      id: "count-total",
      label: "Recargas totales",
      value: String(topups?.count_total ?? 0),
      helper: "Cantidad historica confirmada.",
      tone: "info" as const,
    },
    {
      id: "amount-total",
      label: "Monto total recargado",
      value: formatWalletAmount(topups?.amount_total ?? 0),
      helper: "Total acumulado de recargas.",
      tone: "success" as const,
    },
    {
      id: "count-today",
      label: "Recargas de hoy",
      value: String(topups?.count_today ?? 0),
      helper: "Actividad del dia actual.",
      tone: "info" as const,
    },
    {
      id: "amount-today",
      label: "Monto recargado hoy",
      value: formatWalletAmount(topups?.amount_today ?? 0),
      helper: "Saldo ingresado hoy.",
      tone: "success" as const,
    },
  ];
}

function buildWalletAlerts(topups: MeTopupItemInterface[]): WalletAlertModel[] {
  const alerts: WalletAlertModel[] = [];

  if (topups.some((topup) => topup.status === "blocked")) {
    alerts.push({
      id: "blocked-topup",
      severity: "danger",
      message: "Una recarga reciente fue bloqueada.",
    });
  }

  if (topups.some((topup) => topup.status === "failed")) {
    alerts.push({
      id: "failed-topup",
      severity: "warning",
      message: "Una recarga reciente fallo. Revisa el historial.",
    });
  }

  if (topups.some((topup) => topup.status === "partial")) {
    alerts.push({
      id: "partial-topup",
      severity: "warning",
      message: "Una recarga quedo parcial. Revisa su estado.",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "healthy-wallet",
      severity: "success",
      message: "No hay alertas operativas en tu billetera.",
    });
  }

  return alerts;
}
