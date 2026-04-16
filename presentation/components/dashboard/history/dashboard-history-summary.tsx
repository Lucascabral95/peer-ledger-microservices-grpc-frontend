import type { HistorySummaryModel } from "@/domain/models";

import styles from "./dashboard-history.module.scss";

interface DashboardHistorySummaryProps {
  summary: HistorySummaryModel[];
}

export function DashboardHistorySummary({ summary }: DashboardHistorySummaryProps) {
  return (
    <section className={styles.summaryGrid} aria-label="Resumen de historial">
      {summary.map((item) => (
        <article
          key={item.id}
          className={`${styles.summaryCard} ${
            styles[`tone${capitalize(item.tone)}`]
          }`.trim()}
        >
          <span className={styles.summaryLabel}>{item.label}</span>
          <strong className={styles.summaryValue}>{item.value}</strong>
          <p className={styles.summaryHelper}>{item.helper}</p>
        </article>
      ))}
    </section>
  );
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
