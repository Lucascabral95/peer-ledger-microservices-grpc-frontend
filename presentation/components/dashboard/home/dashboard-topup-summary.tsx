import type { DashboardTopupSummaryModel } from "@/domain/models";
import {
  formatDashboardAmount,
  formatDashboardDate,
} from "@/shared/utils";
import styles from "./dashboard-home.module.scss";

interface DashboardTopupSummaryProps {
  summary: DashboardTopupSummaryModel;
}

export function DashboardTopupSummary({
  summary,
}: DashboardTopupSummaryProps) {
  return (
    <section className={styles.surfaceCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Topups</span>
          <h3 className={styles.cardTitle}>Resumen de recargas</h3>
        </div>
      </div>

      <div className={styles.topupGrid}>
        <div className={styles.topupStat}>
          <span className={styles.metricLabel}>Cantidad reciente</span>
          <strong className={styles.metricValue}>{summary.count}</strong>
        </div>
        <div className={styles.topupStat}>
          <span className={styles.metricLabel}>Último monto</span>
          <strong className={styles.metricValue}>
            {formatDashboardAmount(summary.lastTopupAmount)}
          </strong>
        </div>
      </div>

      <p className={styles.topupMeta}>
        {summary.lastTopupDate
          ? `Último topup registrado: ${formatDashboardDate(summary.lastTopupDate)}`
          : "Todavía no hay topups recientes para mostrar."}
      </p>
    </section>
  );
}
