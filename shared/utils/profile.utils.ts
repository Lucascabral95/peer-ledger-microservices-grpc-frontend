import type { MeProfileDataInterface } from "@/domain/interfaces";
import type { ProfileViewModel } from "@/domain/models";
import {
  PROFILE_ACTIONS,
  PROFILE_SECURITY_SIGNALS,
  PROFILE_STATUS_LABELS,
} from "@/shared/constants";

export function buildProfileViewModel(
  profile: MeProfileDataInterface,
): ProfileViewModel {
  const normalizedName = profile.name?.trim() ?? "";
  const normalizedEmail = profile.email?.trim() ?? "";
  const normalizedUserId = profile.user_id?.trim() ?? "";
  const displayName = getProfileDisplayName(normalizedName, normalizedEmail);

  return {
    userId: normalizedUserId,
    shortUserId: truncateProfileUserId(normalizedUserId),
    name: normalizedName || "Nombre no informado",
    displayName,
    initials: getProfileInitials(normalizedName, normalizedEmail),
    email: normalizedEmail || "Email no informado",
    statusLabel: PROFILE_STATUS_LABELS.active,
    sessionLabel: PROFILE_STATUS_LABELS.sessionProtected,
    details: [
      {
        id: "name",
        label: "Nombre",
        value: normalizedName || "Nombre no informado",
        helper: "Nombre asociado a tu identidad operativa.",
      },
      {
        id: "email",
        label: "Email",
        value: normalizedEmail || "Email no informado",
        helper: "Canal principal de identificacion de cuenta.",
      },
      {
        id: "user-id",
        label: "ID de usuario",
        value: truncateProfileUserId(normalizedUserId),
        helper: "Identificador unico utilizado por los microservicios.",
      },
      {
        id: "privacy",
        label: "Privacidad",
        value: maskProfileEmail(normalizedEmail),
        helper: "Vista protegida del email para contexto seguro.",
      },
    ],
    securitySignals: PROFILE_SECURITY_SIGNALS.map((signal) => ({ ...signal })),
    actions: PROFILE_ACTIONS.map((action) => ({ ...action })),
  };
}

export function getProfileInitials(name: string, email: string): string {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((segment) => segment.charAt(0).toUpperCase())
    .join("");

  if (initials) {
    return initials;
  }

  const emailInitial = email.trim().charAt(0).toUpperCase();
  return emailInitial || "U";
}

export function getProfileDisplayName(name: string, email: string): string {
  const normalizedName = name.trim();

  if (normalizedName) {
    return normalizedName;
  }

  const emailLocalPart = email.trim().split("@")[0];
  return emailLocalPart || "Usuario";
}

export function truncateProfileUserId(userId: string): string {
  const normalizedUserId = userId.trim();

  if (!normalizedUserId) {
    return "ID no disponible";
  }

  if (normalizedUserId.length <= 12) {
    return normalizedUserId;
  }

  return `${normalizedUserId.slice(0, 8)}...`;
}

export function maskProfileEmail(email: string): string {
  const normalizedEmail = email.trim();
  const [localPart, domain] = normalizedEmail.split("@");

  if (!localPart || !domain) {
    return "Email no informado";
  }

  const visiblePrefix = localPart.slice(0, Math.min(2, localPart.length));
  return `${visiblePrefix}***@${domain}`;
}
