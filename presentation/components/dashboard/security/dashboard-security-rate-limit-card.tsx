import type { SecurityPolicyModel } from "@/domain/models";

import styles from "./dashboard-security.module.scss";

interface DashboardSecurityRateLimitCardProps {
  rateLimits: SecurityPolicyModel[];
}

export function DashboardSecurityRateLimitCard({
  rateLimits,
}: DashboardSecurityRateLimitCardProps) {
  return (
    <section className={styles.rateLimitCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Rate limits</span>
          <h3 className={styles.cardTitle}>Control de rafagas</h3>
        </div>
      </div>

      <p className={styles.cardDescription}>
        Los limites reducen abuso y protegen operaciones sensibles.
      </p>

      <div className={styles.compactList}>
        {rateLimits.map((limit) => (
          <article
            key={limit.id}
            className={`${styles.compactItem} ${
              styles[`tone${capitalize(limit.tone)}`]
            }`.trim()}
          >
            <span className={styles.policyLabel}>{limit.label}</span>
            <strong className={styles.policyValue}>{limit.value}</strong>
            <p className={styles.policyDescription}>{limit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
