import type { DashboardMetricsModel } from "@/domain/models";
import { formatDashboardAmount } from "@/shared/utils";
import styles from "./dashboard-home.module.scss";

interface DashboardMetricsGridProps {
  metrics: DashboardMetricsModel;
}

export function DashboardMetricsGrid({
  metrics,
}: DashboardMetricsGridProps) {
  const cards = [
    {
      id: "money-sent",
      label: "Dinero enviado",
      value: formatDashboardAmount(metrics.moneySent),
    },
    {
      id: "money-received",
      label: "Dinero recibido",
      value: formatDashboardAmount(metrics.moneyReceived),
    },
    {
      id: "activity-today",
      label: "Actividad del día",
      value: String(metrics.activityToday),
    },
    {
      id: "topups-count",
      label: "Topups recientes",
      value: String(metrics.topupsCount),
    },
  ];

  return (
    <section className={styles.metricsGrid}>
      {cards.map((card) => (
        <article key={card.id} className={styles.metricCard}>
          <span className={styles.metricLabel}>{card.label}</span>
          <strong className={styles.metricValue}>{card.value}</strong>
        </article>
      ))}
    </section>
  );
}
