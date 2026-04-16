export const SECURITY_TOKEN_POLICY = {
  accessTokenHours: 24,
  refreshTokenHours: 168,
} as const;

export const SECURITY_PROTECTED_ROUTES = [
  "/me/*",
  "/topups",
  "/transfers",
  "/history/*",
] as const;

export const SECURITY_PASSWORD_REQUIREMENTS = [
  {
    id: "length",
    label: "Longitud minima",
    value: "8 caracteres",
    description: "Reduce riesgo de passwords triviales.",
    tone: "success",
  },
  {
    id: "uppercase",
    label: "Mayuscula",
    value: "1 requerida",
    description: "Refuerza variedad del secreto.",
    tone: "success",
  },
  {
    id: "lowercase",
    label: "Minuscula",
    value: "1 requerida",
    description: "Mantiene compatibilidad con politica del backend.",
    tone: "success",
  },
  {
    id: "number",
    label: "Numero",
    value: "1 requerido",
    description: "Evita passwords puramente alfabeticos.",
    tone: "success",
  },
  {
    id: "punctuation",
    label: "Puntuacion",
    value: "1 simbolo requerido",
    description: "Aumenta resistencia frente a ataques comunes.",
    tone: "success",
  },
] as const;

export const SECURITY_RATE_LIMITS = [
  {
    id: "general-rate-limit",
    label: "Rate limit general",
    value: "120 requests / minuto",
    description: "Protege los servicios contra abuso y rafagas no esperadas.",
    tone: "info",
  },
  {
    id: "transfer-rate-limit",
    label: "Rate limit transferencias",
    value: "20 transferencias / minuto",
    description: "Limita operaciones sensibles para reducir riesgo operativo.",
    tone: "warning",
  },
] as const;

export const SECURITY_FRAUD_RULES = [
  {
    id: "max-transfer",
    label: "Maximo por transferencia",
    value: "20000",
    description: "Una transferencia individual no debe superar este monto.",
    ruleCode: "max_transfer_amount",
    tone: "warning",
  },
  {
    id: "daily-sent",
    label: "Maximo diario enviado",
    value: "50000",
    description: "Controla la exposicion diaria del usuario.",
    ruleCode: "daily_sent_limit",
    tone: "warning",
  },
  {
    id: "velocity",
    label: "Velocidad maxima",
    value: "5 transferencias / 10 minutos",
    description: "Detecta rafagas de movimientos potencialmente sospechosos.",
    ruleCode: "velocity_limit",
    tone: "warning",
  },
  {
    id: "same-receiver-cooldown",
    label: "Cooldown mismo receptor",
    value: "30 segundos",
    description: "Evita repeticiones inmediatas hacia el mismo destinatario.",
    ruleCode: "same_receiver_cooldown",
    tone: "info",
  },
  {
    id: "idempotency",
    label: "Idempotency key",
    value: "24 horas",
    description: "Los reintentos de transferencia deben reutilizar la misma key.",
    ruleCode: "idempotency_key_ttl",
    tone: "success",
  },
] as const;

export const SECURITY_FRAUD_RULE_MESSAGES = {
  max_transfer_amount: "El monto supera el maximo permitido por transferencia.",
  daily_sent_limit: "Superaste el limite diario de dinero enviado.",
  velocity_limit: "Detectamos demasiadas transferencias en poco tiempo.",
  same_receiver_cooldown:
    "Debes esperar antes de volver a transferir al mismo receptor.",
  idempotency_key_ttl:
    "Para reintentos, reutiliza la misma idempotency key dentro de 24 horas.",
} as const;

export const SECURITY_ACTIONS = [
  {
    id: "transfer",
    label: "Enviar dinero",
    href: "/api/v1/dashboard/tranfers",
    description: "Opera respetando limites antifraude y rate limits.",
  },
  {
    id: "history",
    label: "Ver historial",
    href: "/api/v1/dashboard/history",
    description: "Audita movimientos completados, fallidos o bloqueados.",
  },
  {
    id: "profile",
    label: "Ir a mi perfil",
    href: "/api/v1/dashboard/profile",
    description: "Consulta la identidad asociada a tu cuenta.",
  },
] as const;
