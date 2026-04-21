export interface DashboardSectionItem {
  href: string;
  label: string;
  shortLabel: string;
}

export interface DashboardQuickActionItem {
  id: string;
  label: string;
  href: string;
}

export const DASHBOARD_SECTION_ITEMS: DashboardSectionItem[] = [
  {
    href: "/api/v1/dashboard",
    label: "Dashboard principal",
    shortLabel: "DP",
  },
  {
    href: "/api/v1/dashboard/my-wallet",
    label: "Mi billetera",
    shortLabel: "MB",
  },
  {
    href: "/api/v1/dashboard/tranfers",
    label: "Transferencias",
    shortLabel: "TR",
  },
  {
    href: "/api/v1/dashboard/history",
    label: "Historial",
    shortLabel: "HI",
  },
  {
    href: "/api/v1/dashboard/profile",
    label: "Perfil",
    shortLabel: "PE",
  },
  {
    href: "/api/v1/dashboard/security",
    label: "Seguridad",
    shortLabel: "SE",
  },
];

export const DASHBOARD_HOME_QUICK_ACTIONS: DashboardQuickActionItem[] = [
  {
    id: "top-up",
    label: "Recargar saldo",
    href: "/api/v1/dashboard/my-wallet",
  },
  {
    id: "transfer",
    label: "Enviar dinero",
    href: "/api/v1/dashboard/tranfers",
  },
  {
    id: "history",
    label: "Ver historial",
    href: "/api/v1/dashboard/history",
  },
  {
    id: "receive-money",
    label: "Recibir dinero",
    href: "/api/v1/dashboard/profile#receive-id",
  },
  {
    id: "profile",
    label: "Ir a mi perfil",
    href: "/api/v1/dashboard/profile",
  },
];
