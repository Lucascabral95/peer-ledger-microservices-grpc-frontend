import type { ProfileSecuritySignalModel } from "@/domain/models";

import styles from "./dashboard-profile.module.scss";

interface DashboardProfileSecurityCardProps {
  sessionLabel: string;
  signals: ProfileSecuritySignalModel[];
}

export function DashboardProfileSecurityCard({
  sessionLabel,
  signals,
}: DashboardProfileSecurityCardProps) {
  return (
    <section className={styles.securityCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Sesion</span>
          <h3 className={styles.cardTitle}>{sessionLabel}</h3>
        </div>
      </div>

      <div className={styles.securityList}>
        {signals.map((signal) => (
          <article
            key={signal.id}
            className={`${styles.securitySignal} ${
              styles[`securitySignal${capitalize(signal.tone)}`]
            }`.trim()}
          >
            <span className={styles.signalLabel}>{signal.label}</span>
            <p className={styles.signalDescription}>{signal.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
