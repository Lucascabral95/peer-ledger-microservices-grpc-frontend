export const WALLET_TOPUPS_PAGE_SIZE = 8;

export const WALLET_TOPUP_FORM_LIMITS = {
  minAmount: 1,
} as const;

export const WALLET_STATUS_LABELS = {
  completed: "Completada",
  blocked: "Bloqueada",
  failed: "Fallida",
  partial: "Parcial",
} as const;

export const WALLET_ACTIONS = [
  {
    id: "transfer",
    label: "Enviar dinero",
    href: "/api/v1/dashboard/tranfers",
    description: "Transfiere saldo a otro usuario P2P.",
  },
  {
    id: "history",
    label: "Ver historial",
    href: "/api/v1/dashboard/history",
    description: "Audita todos tus movimientos.",
  },
  {
    id: "profile",
    label: "Ir a mi perfil",
    href: "/api/v1/dashboard/profile",
    description: "Consulta tu identidad de cuenta.",
  },
] as const;
