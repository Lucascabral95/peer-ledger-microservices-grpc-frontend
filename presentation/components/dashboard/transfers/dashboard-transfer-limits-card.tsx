import type { TransfersLimitModel } from "@/domain/models";

import styles from "./dashboard-transfers.module.scss";

interface DashboardTransferLimitsCardProps {
  limits: TransfersLimitModel[];
}

export function DashboardTransferLimitsCard({
  limits,
}: DashboardTransferLimitsCardProps) {
  return (
    <section className={styles.limitsCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Controles</span>
          <h3 className={styles.cardTitle}>Limites antifraude</h3>
        </div>
      </div>

      <div className={styles.limitsList}>
        {limits.map((limit) => (
          <article
            key={limit.id}
            className={`${styles.limitItem} ${
              styles[`tone${capitalize(limit.tone)}`]
            }`.trim()}
          >
            <span>{limit.label}</span>
            <strong>{limit.value}</strong>
            <p>{limit.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
