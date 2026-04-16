import type { WalletAlertModel } from "@/domain/models";

import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletAlertsProps {
  alerts: WalletAlertModel[];
}

export function DashboardWalletAlerts({ alerts }: DashboardWalletAlertsProps) {
  return (
    <section className={styles.alertsCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Estado operativo</span>
          <h3 className={styles.cardTitle}>Alertas de billetera</h3>
        </div>
      </div>

      <div className={styles.alertList}>
        {alerts.map((alert) => (
          <article
            className={`${styles.alertItem} ${styles[getSeverityClass(alert.severity)]}`}
            key={alert.id}
          >
            {alert.message}
          </article>
        ))}
      </div>
    </section>
  );
}

function getSeverityClass(severity: WalletAlertModel["severity"]) {
  return `tone${severity[0].toUpperCase()}${severity.slice(1)}` as
    | "toneSuccess"
    | "toneInfo"
    | "toneWarning"
    | "toneDanger";
}
