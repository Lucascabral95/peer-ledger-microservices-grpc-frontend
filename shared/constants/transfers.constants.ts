import type { TransfersLimitModel } from "@/domain/models";

export const TRANSFER_FORM_LIMITS = {
  minAmount: 1,
  maxAmount: 20000,
} as const;

export const TRANSFER_RECENT_PAGE_SIZE = 5;

export const TRANSFER_FORM_COPY = {
  title: "Enviar dinero",
  description:
    "Crea una transferencia P2P con controles de idempotencia y antifraude.",
  receiverLabel: "ID del receptor",
  receiverHelper: "Usa el identificador de usuario destino.",
  amountLabel: "Monto",
  amountHelper: "Maximo por transferencia: 20000.",
} as const;

export const TRANSFER_LIMIT_CARDS = [
  {
    id: "max-transfer",
    label: "Maximo por transferencia",
    value: "20000",
    description: "El backend bloquea transferencias por encima de este monto.",
    tone: "warning",
  },
  {
    id: "daily-sent",
    label: "Maximo diario enviado",
    value: "50000",
    description: "Control operativo para reducir exposicion diaria.",
    tone: "warning",
  },
  {
    id: "velocity",
    label: "Velocidad maxima",
    value: "5 transferencias / 10 minutos",
    description: "Mitiga rafagas de operaciones sospechosas.",
    tone: "info",
  },
  {
    id: "same-receiver-cooldown",
    label: "Cooldown mismo receptor",
    value: "30 segundos",
    description: "Evita repeticiones inmediatas hacia el mismo receptor.",
    tone: "info",
  },
  {
    id: "idempotency",
    label: "Idempotency key",
    value: "24 horas",
    description: "Reintentos del mismo intento reutilizan la misma key.",
    tone: "success",
  },
] as const satisfies TransfersLimitModel[];
