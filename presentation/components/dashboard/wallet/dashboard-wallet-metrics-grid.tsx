import type { WalletMetricModel } from "@/domain/models";

import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletMetricsGridProps {
  metrics: WalletMetricModel[];
}

export function DashboardWalletMetricsGrid({
  metrics,
}: DashboardWalletMetricsGridProps) {
  return (
    <section className={styles.metricsGrid} aria-label="Metricas de billetera">
      {metrics.map((metric) => (
        <article
          className={`${styles.metricCard} ${styles[getToneClass(metric.tone)]}`}
          key={metric.id}
        >
          <span className={styles.metricLabel}>{metric.label}</span>
          <strong className={styles.metricValue}>{metric.value}</strong>
          <p className={styles.metricHelper}>{metric.helper}</p>
        </article>
      ))}
    </section>
  );
}

function getToneClass(tone: WalletMetricModel["tone"]) {
  return `tone${tone[0].toUpperCase()}${tone.slice(1)}` as
    | "toneSuccess"
    | "toneInfo"
    | "toneWarning"
    | "toneDanger";
}
