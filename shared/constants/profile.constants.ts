export const PROFILE_STATUS_LABELS = {
  active: "Cuenta activa",
  sessionProtected: "Sesion protegida",
} as const;

export const PROFILE_SECURITY_SIGNALS = [
  {
    id: "session-token",
    label: "Sesion autenticada",
    description: "Tu acceso esta protegido por token y refresh automatico.",
    tone: "success",
  },
  {
    id: "route-protection",
    label: "Ruta protegida",
    description: "El dashboard solo esta disponible con una sesion valida.",
    tone: "info",
  },
  {
    id: "identity-source",
    label: "Identidad centralizada",
    description: "Los datos provienen del endpoint seguro /me/profile.",
    tone: "info",
  },
] as const;

export const PROFILE_ACTIONS = [
  {
    id: "security",
    label: "Revisar seguridad",
    href: "/api/v1/dashboard/security",
    description: "Gestiona controles de acceso y seguridad de cuenta.",
  },
  {
    id: "wallet",
    label: "Ir a mi billetera",
    href: "/api/v1/dashboard/my-wallet",
    description: "Consulta saldo y actividad financiera.",
  },
  {
    id: "history",
    label: "Ver historial",
    href: "/api/v1/dashboard/history",
    description: "Audita tus movimientos recientes.",
  },
] as const;
