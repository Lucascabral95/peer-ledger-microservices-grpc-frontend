export type SecurityTone = "success" | "info" | "warning" | "danger";

export interface SecurityViewModel {
  session: SecuritySessionModel;
  policies: SecurityPolicyModel[];
  fraudRules: SecurityFraudRuleModel[];
  rateLimits: SecurityPolicyModel[];
  passwordRequirements: SecurityPolicyModel[];
  actions: SecurityActionModel[];
}

export interface SecuritySessionModel {
  statusLabel: string;
  description: string;
  expiresAt: string | null;
  expiresInLabel: string;
  tone: Exclude<SecurityTone, "info">;
}

export interface SecurityPolicyModel {
  id: string;
  label: string;
  value: string;
  description: string;
  tone: SecurityTone;
}

export interface SecurityFraudRuleModel {
  id: string;
  label: string;
  value: string;
  description: string;
  ruleCode?: string;
  tone: SecurityTone;
}

export interface SecurityActionModel {
  id: string;
  label: string;
  href: string;
  description: string;
}
