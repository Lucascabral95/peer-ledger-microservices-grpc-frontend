import type {
  MeActivityDataInterface,
  MeActivityItemInterface,
  MeActivityStatus,
} from "@/domain/interfaces";
import type { HistoryRowModel, HistoryTone, HistoryViewModel } from "@/domain/models";
import {
  HISTORY_EMPTY_MESSAGES,
  HISTORY_FILTERS,
  HISTORY_KIND_LABELS,
  HISTORY_STATUS_LABELS,
} from "@/shared/constants";

const ALERT_STATUSES = new Set<MeActivityStatus>(["blocked", "failed", "partial"]);

export function buildHistoryViewModel(
  data: MeActivityDataInterface,
): HistoryViewModel {
  const rows = [...data.items]
    .sort((left, right) => getTime(right.created_at) - getTime(left.created_at))
    .map(mapActivityItemToHistoryRow);
  const transferCount = rows.filter((row) => row.kind === "transfer").length;
  const topupCount = rows.filter((row) => row.kind === "topup").length;
  const alertCount = rows.filter((row) => ALERT_STATUSES.has(row.status)).length;
  const currentKind = data.filters.kind ?? "all";

  return {
    title: "Historial operativo",
    subtitle: "Audita tus transferencias, recargas y estados recientes.",
    summary: [
      {
        id: "events",
        label: "Eventos",
        value: String(rows.length),
        helper: "Movimientos en la pagina actual.",
        tone: "info",
      },
      {
        id: "transfers",
        label: "Transferencias",
        value: String(transferCount),
        helper: "Dinero enviado y recibido.",
        tone: "success",
      },
      {
        id: "topups",
        label: "Recargas",
        value: String(topupCount),
        helper: "Ingresos de saldo.",
        tone: "success",
      },
      {
        id: "alerts",
        label: "Alertas",
        value: String(alertCount),
        helper: "Bloqueadas, fallidas o parciales.",
        tone: alertCount > 0 ? "warning" : "success",
      },
    ],
    filters: HISTORY_FILTERS.map((filter) => ({ ...filter })),
    rows,
    pagination: {
      page: data.pagination.page,
      pageSize: data.pagination.page_size,
      hasNext: data.pagination.has_next,
      canGoBack: data.pagination.page > 1,
      label: `Pagina ${data.pagination.page}`,
    },
    emptyMessage: HISTORY_EMPTY_MESSAGES[currentKind],
  };
}

export function mapActivityItemToHistoryRow(
  item: MeActivityItemInterface,
): HistoryRowModel {
  const kind = isTopup(item) ? "topup" : "transfer";
  const statusLabel = getActivityStatusLabel(item.status);

  return {
    id: item.id,
    kind,
    label: HISTORY_KIND_LABELS[kind],
    counterparty: getHistoryCounterparty(item),
    amount: item.amount,
    amountLabel: formatHistoryAmount(item.amount),
    date: item.created_at,
    dateLabel: formatHistoryDate(item.created_at),
    status: item.status,
    statusLabel,
    directionLabel: getActivityDirectionLabel(item),
    balanceAfterLabel:
      typeof item.balance_after === "number"
        ? formatHistoryAmount(item.balance_after)
        : "No disponible",
    tone: getActivityTone(item.status),
  };
}

export function getActivityDirectionLabel(
  item: MeActivityItemInterface,
): "Enviada" | "Recibida" | "Recarga" {
  if (isTopup(item)) {
    return "Recarga";
  }

  if (item.kind === "transfer_received") {
    return "Recibida";
  }

  if (item.kind === "transfer_sent") {
    return "Enviada";
  }

  if (item.direction === "received") {
    return "Recibida";
  }

  return "Enviada";
}

export function getActivityStatusLabel(status: MeActivityStatus): string {
  return HISTORY_STATUS_LABELS[status];
}

export function getActivityTone(status: MeActivityStatus): HistoryTone {
  switch (status) {
    case "completed":
      return "success";
    case "blocked":
      return "danger";
    case "failed":
    case "partial":
      return "warning";
    default:
      return "info";
  }
}

export function formatHistoryAmount(amount: number): string {
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatHistoryDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Fecha no disponible";
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(parsedDate);
}

export function getHistoryCounterparty(item: MeActivityItemInterface): string {
  if (isTopup(item)) {
    return "Recarga de saldo";
  }

  if (item.counterparty_name) {
    return item.counterparty_name;
  }

  if (item.counterparty_id) {
    return truncateIdentifier(item.counterparty_id);
  }

  return "Contraparte no disponible";
}

export function isTopup(item: MeActivityItemInterface): boolean {
  return item.kind === "topup";
}

export function isTransferActivity(item: MeActivityItemInterface): boolean {
  return item.kind !== "topup";
}

function truncateIdentifier(identifier: string): string {
  if (identifier.length <= 12) {
    return identifier;
  }

  return `${identifier.slice(0, 8)}...`;
}

function getTime(date: string): number {
  const time = new Date(date).getTime();

  return Number.isNaN(time) ? 0 : time;
}
