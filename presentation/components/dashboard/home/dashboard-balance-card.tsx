import type { DashboardBalanceSummaryModel } from "@/domain/models";
import {
  formatDashboardAmount,
  formatDashboardDate,
} from "@/shared/utils";
import styles from "./dashboard-home.module.scss";

interface DashboardBalanceCardProps {
  balance: DashboardBalanceSummaryModel;
}

export function DashboardBalanceCard({ balance }: DashboardBalanceCardProps) {
  const isUnavailable = typeof balance.amount !== "number";

  return (
    <section className={styles.balanceCard}>
      <div>
        <span className={styles.sectionEyebrow}>Saldo actual</span>
        <h3 className={styles.balanceValue}>
          {formatDashboardAmount(balance.amount)}
        </h3>
        <p className={styles.balanceMeta}>
          {isUnavailable
            ? "Saldo no disponible con la información recibida."
            : `Última actualización: ${formatDashboardDate(balance.lastUpdatedAt)}`}
        </p>
      </div>

      <div className={styles.balanceAside}>
        <span className={styles.balanceAsideLabel}>Estado</span>
        <strong className={styles.balanceAsideValue}>
          {isUnavailable ? "Pendiente de sincronización" : "Operativo"}
        </strong>
      </div>
    </section>
  );
}
