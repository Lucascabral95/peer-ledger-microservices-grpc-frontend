import type { SecurityPolicyModel } from "@/domain/models";

import styles from "./dashboard-security.module.scss";

interface DashboardSecurityPolicyCardProps {
  policy: SecurityPolicyModel;
}

export function DashboardSecurityPolicyCard({
  policy,
}: DashboardSecurityPolicyCardProps) {
  return (
    <article
      className={`${styles.policyCard} ${
        styles[`tone${capitalize(policy.tone)}`]
      }`.trim()}
    >
      <span className={styles.policyLabel}>{policy.label}</span>
      <strong className={styles.policyValue}>{policy.value}</strong>
      <p className={styles.policyDescription}>{policy.description}</p>
    </article>
  );
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
