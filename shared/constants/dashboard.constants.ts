export interface DashboardSectionItem {
  href: string;
  label: string;
  shortLabel: string;
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
