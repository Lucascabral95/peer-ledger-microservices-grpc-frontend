import type {
  AuthSessionModel,
  SecurityActionModel,
  SecurityFraudRuleModel,
  SecurityPolicyModel,
  SecuritySessionModel,
  SecurityViewModel,
} from "@/domain/models";

import {
  SECURITY_ACTIONS,
  SECURITY_FRAUD_RULE_MESSAGES,
  SECURITY_FRAUD_RULES,
  SECURITY_PASSWORD_REQUIREMENTS,
  SECURITY_PROTECTED_ROUTES,
  SECURITY_RATE_LIMITS,
} from "@/shared/constants";

import { parseJwtExpiration } from "./auth-session.utils";

const SESSION_RENEWAL_WARNING_MINUTES = 60;
const GENERIC_FRAUD_RULE_MESSAGE =
  "La operacion fue revisada por controles de seguridad.";

export function buildSecurityViewModel(
  session: AuthSessionModel | null,
): SecurityViewModel {
  return {
    session: getSecuritySessionModel(session?.token),
    policies: getSecurityPolicies(),
    fraudRules: SECURITY_FRAUD_RULES.map((rule) => ({ ...rule })),
    rateLimits: SECURITY_RATE_LIMITS.map((limit) => ({ ...limit })),
    passwordRequirements: SECURITY_PASSWORD_REQUIREMENTS.map((requirement) => ({
      ...requirement,
    })),
    actions: SECURITY_ACTIONS.map((action) => ({ ...action })),
  };
}

export function getSecuritySessionModel(
  token?: string | null,
): SecuritySessionModel {
  const expiration = parseJwtExpiration(token);

  if (!token || !expiration) {
    return {
      statusLabel: "Sesion no disponible",
      description:
        "No encontramos un access token activo en el cliente. Inicia sesion para operar.",
      expiresAt: null,
      expiresInLabel: "Sin token activo",
      tone: "danger",
    };
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  const remainingSeconds = expiration - nowInSeconds;
  const expiresAt = formatTokenExpiration(token);

  if (remainingSeconds <= 0) {
    return {
      statusLabel: "Sesion expirada",
      description:
        "El access token ya expiro. El interceptor intentara renovar la sesion si el refresh token sigue vigente.",
      expiresAt,
      expiresInLabel: "Token expirado",
      tone: "danger",
    };
  }

  if (remainingSeconds <= SESSION_RENEWAL_WARNING_MINUTES * 60) {
    return {
      statusLabel: "Sesion proxima a renovar",
      description:
        "Tu sesion se renovara automaticamente mientras el refresh token siga siendo valido.",
      expiresAt,
      expiresInLabel: getTokenExpiresInLabel(token),
      tone: "warning",
    };
  }

  return {
    statusLabel: "Sesion activa",
    description:
      "Tu sesion esta protegida con bearer token y refresh automatico.",
    expiresAt,
    expiresInLabel: getTokenExpiresInLabel(token),
    tone: "success",
  };
}

export function formatTokenExpiration(token?: string | null): string | null {
  const expiration = parseJwtExpiration(token);

  if (!expiration) {
    return null;
  }

  return new Intl.DateTimeFormat("es-AR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(expiration * 1000));
}

export function getTokenExpiresInLabel(token?: string | null): string {
  const expiration = parseJwtExpiration(token);

  if (!token || !expiration) {
    return "Sin token activo";
  }

  const remainingSeconds = expiration - Math.floor(Date.now() / 1000);

  if (remainingSeconds <= 0) {
    return "Token expirado";
  }

  const remainingMinutes = Math.ceil(remainingSeconds / 60);

  if (remainingMinutes < 60) {
    return `Expira en ${remainingMinutes} min`;
  }

  const remainingHours = Math.ceil(remainingMinutes / 60);

  return `Expira en ${remainingHours} h`;
}

export function getFraudRuleMessage(ruleCode?: string | null): string {
  if (!ruleCode) {
    return GENERIC_FRAUD_RULE_MESSAGE;
  }

  return (
    SECURITY_FRAUD_RULE_MESSAGES[
      ruleCode as keyof typeof SECURITY_FRAUD_RULE_MESSAGES
    ] ?? GENERIC_FRAUD_RULE_MESSAGE
  );
}

function getSecurityPolicies(): SecurityPolicyModel[] {
  return [
    {
      id: "protected-routes",
      label: "Rutas protegidas",
      value: SECURITY_PROTECTED_ROUTES.join(", "),
      description: "Las operaciones sensibles requieren bearer token valido.",
      tone: "success",
    },
    {
      id: "bearer-token",
      label: "Bearer token",
      value: "Requerido",
      description:
        "Las rutas /me, topups, transfers e history se consumen con Authorization.",
      tone: "success",
    },
    {
      id: "refresh",
      label: "Refresh automatico",
      value: "Activo",
      description:
        "Si el access token vence, el interceptor solicita un token nuevo.",
      tone: "info",
    },
    {
      id: "retry-after",
      label: "Retry-After",
      value: "Respetar espera",
      description:
        "Cuando el backend devuelve Retry-After, la UI debe esperar antes de reintentar.",
      tone: "warning",
    },
  ];
}

export type {
  SecurityActionModel,
  SecurityFraudRuleModel,
  SecurityPolicyModel,
};
