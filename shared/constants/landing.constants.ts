export const LANDING_BRAND = {
  name: "Peer Ledger",
  mark: "PL",
  href: "/",
} as const;

export const LANDING_NAV_ACTIONS = [
  {
    label: "Iniciar sesion",
    href: "/api/v1/login",
    variant: "ghost",
  },
  {
    label: "Registrarme",
    href: "/api/v1/register",
    variant: "primary",
  },
] as const;

export const LANDING_HERO = {
  eyebrow: "P2P financial command center",
  title: "Infraestructura visual para operar dinero entre usuarios.",
  description:
    "Peer Ledger une autenticación, billetera, recargas, transferencias, historial y antifraude en una experiencia precisa, segura y lista para escalar.",
  primaryAction: {
    label: "Crear cuenta",
    href: "/api/v1/register",
  },
  secondaryAction: {
    label: "Entrar al dashboard",
    href: "/api/v1/login",
  },
} as const;

export const LANDING_TRUST_SIGNALS = [
  "JWT + refresh automatico",
  "Cache con TanStack Query",
  "Antifraude visible",
  "Arquitectura por capas",
] as const;

export const LANDING_PREVIEW = {
  statusLabel: "Operacion activa",
  balanceLabel: "128.430,00",
  balanceHelper: "Saldo disponible centralizado en /me/wallet.",
  activity: [
    {
      label: "Transferencia enviada",
      value: "Completada",
    },
    {
      label: "Recarga reciente",
      value: "Sin alertas",
    },
    {
      label: "Sesion",
      value: "Protegida",
    },
  ],
} as const;

export const LANDING_METRICS = [
  {
    value: "24h",
    label: "Access token",
  },
  {
    value: "168h",
    label: "Refresh token",
  },
  {
    value: "20/min",
    label: "Rate limit transfers",
  },
  {
    value: "20000",
    label: "Maximo por transferencia",
  },
] as const;

export const LANDING_TRANSFER_RECEIVER = {
  eyebrow: "Recibir transferencias",
  title: "Recibí dinero compartiendo tu ID.",
  description:
    "Cada usuario tiene un identificador unico que puede copiar desde su perfil para recibir transferencias P2P.",
  highlights: [
    {
      label: "Copiar ID",
      description:
        "El usuario copia su receiver_id desde el dashboard protegido.",
    },
    {
      label: "Compartir",
      description: "Ese ID se usa como receptor al enviar dinero.",
    },
    {
      label: "Auditar",
      description:
        "La transferencia queda visible en historial y actividad reciente.",
    },
  ],
} as const;

export const LANDING_PRODUCT_MODULES = [
  {
    title: "Dashboard ejecutivo",
    description:
      "Saldo, actividad reciente, ultimas transferencias, topups y alertas operativas en una vista de decisión rápida.",
  },
  {
    title: "Mi billetera",
    description:
      "Saldo disponible, recargas reales, metricas, filtros, paginacion y estado operativo de la wallet.",
  },
  {
    title: "Transferencias P2P",
    description:
      "Envio por receiver_id con Zod, idempotency key, manejo antifraude y bloqueo temporal por Retry-After.",
  },
  {
    title: "Historial operativo",
    description:
      "Auditoría de transferencias y recargas con estados, direccion recibida/enviada, filtros y tabla responsive.",
  },
] as const;

export const LANDING_ARCHITECTURE_LAYERS = [
  {
    label: "Domain",
    detail: "Interfaces, types y view models.",
  },
  {
    label: "Infrastructure",
    detail: "Http client, services y API actions.",
  },
  {
    label: "Presentation",
    detail: "Componentes, hooks y providers.",
  },
  {
    label: "Shared",
    detail: "Constants, schemas y utils puros.",
  },
] as const;

export const LANDING_SECURITY_SIGNALS = [
  "Access token de 24h y refresh token de 168h.",
  "Rutas protegidas con middleware y bearer token.",
  "Refresh automatico con interceptor Axios.",
  "Password policy con mayúscula, minúscula, número y simbolo.",
  "Rate limits y antifraude visibles para el usuario.",
  "rule_code y Retry-After normalizados para flujos sensibles.",
] as const;

export const LANDING_STACK_ITEMS = [
  "Next.js 16",
  "React 19",
  "TypeScript",
  "SCSS Modules",
  "TanStack Query",
  "Zustand",
  "Axios",
  "React Hook Form",
  "Zod",
  "Jest",
] as const;

export const LANDING_FOOTER_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/Lucascabral95",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/lucas-gast%C3%B3n-cabral/",
  },
  {
    label: "Portfolio",
    href: "https://portfolio-web-dev-git-main-lucascabral95s-projects.vercel.app/",
  },
] as const;
