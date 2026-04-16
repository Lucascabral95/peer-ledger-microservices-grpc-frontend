import type { MeActivityKind, MeActivityStatus } from "@/domain/interfaces";

export const HISTORY_PAGE_SIZE = 10;

export const HISTORY_FILTERS = [
  {
    id: "all",
    label: "Todo",
    description: "Transferencias y recargas.",
  },
  {
    id: "transfer",
    label: "Transferencias",
    description: "Dinero enviado y recibido.",
  },
  {
    id: "topup",
    label: "Recargas",
    description: "Ingresos de saldo.",
  },
] as const satisfies Array<{
  id: MeActivityKind;
  label: string;
  description: string;
}>;

export const HISTORY_STATUS_LABELS: Record<MeActivityStatus, string> = {
  completed: "Completada",
  blocked: "Bloqueada",
  failed: "Fallida",
  partial: "Parcial",
};

export const HISTORY_KIND_LABELS = {
  transfer: "Transferencia",
  topup: "Recarga",
} as const;

export const HISTORY_EMPTY_MESSAGES: Record<MeActivityKind, string> = {
  all: "No hay movimientos para los filtros seleccionados.",
  transfer: "No hay transferencias para los filtros seleccionados.",
  topup: "No hay recargas para los filtros seleccionados.",
};
