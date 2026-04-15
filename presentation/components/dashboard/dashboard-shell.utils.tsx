import type { IconType } from "react-icons";
import {
  FiActivity,
  FiCreditCard,
  FiGrid,
  FiHome,
  FiLock,
  FiSettings,
  FiUser,
  FiUsers,
} from "react-icons/fi";
import { FaWallet } from "react-icons/fa";

import { AUTH_ROUTES } from "@/shared/constants";

const sectionIcons: Record<string, IconType> = {
  [AUTH_ROUTES.home]: FiHome,
};

export function getSectionIcon(href: string, label: string): IconType {
  if (sectionIcons[href]) {
    return sectionIcons[href];
  }

  const normalizedLabel = label.toLowerCase();

  if (
    normalizedLabel.includes("dashboard") ||
    normalizedLabel.includes("inicio")
  ) {
    return FiGrid;
  }

  if (
    normalizedLabel.includes("movimiento") ||
    normalizedLabel.includes("transaccion") ||
    normalizedLabel.includes("actividad") ||
    normalizedLabel.includes("historial")
  ) {
    return FiActivity;
  }

  if (
    normalizedLabel.includes("wallet") ||
    normalizedLabel.includes("billetera") ||
    normalizedLabel.includes("saldo")
  ) {
    return FaWallet;
  }

  if (
    normalizedLabel.includes("pago") ||
    normalizedLabel.includes("transferencia") ||
    normalizedLabel.includes("tarjeta")
  ) {
    return FiCreditCard;
  }

  if (normalizedLabel.includes("perfil") || normalizedLabel.includes("cuenta")) {
    return FiUser;
  }

  if (
    normalizedLabel.includes("usuario") ||
    normalizedLabel.includes("clientes") ||
    normalizedLabel.includes("equipo")
  ) {
    return FiUsers;
  }

  if (
    normalizedLabel.includes("seguridad") ||
    normalizedLabel.includes("auth") ||
    normalizedLabel.includes("acceso")
  ) {
    return FiLock;
  }

  if (
    normalizedLabel.includes("config") ||
    normalizedLabel.includes("ajuste")
  ) {
    return FiSettings;
  }

  return FiGrid;
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");
}
