import type { DashboardAlertModel } from "@/domain/models";
import styles from "./dashboard-home.module.scss";

interface DashboardOperationalAlertsProps {
  alerts: DashboardAlertModel[];
}

export function DashboardOperationalAlerts({
  alerts,
}: DashboardOperationalAlertsProps) {
  return (
    <section className={styles.surfaceCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Alertas operativas</span>
          <h3 className={styles.cardTitle}>Qué conviene revisar ahora</h3>
        </div>
      </div>

      <div className={styles.alertList}>
        {alerts.map((alert) => (
          <article
            key={alert.id}
            className={`${styles.alertCard} ${
              styles[`alertCard${capitalize(alert.severity)}`]
            }`.trim()}
          >
            <span className={styles.alertSeverity}>
              {mapSeverityLabel(alert.severity)}
            </span>
            <p className={styles.alertMessage}>{alert.message}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function mapSeverityLabel(severity: DashboardAlertModel["severity"]) {
  switch (severity) {
    case "danger":
      return "Crítica";
    case "warning":
      return "Atención";
    case "info":
      return "Información";
    default:
      return severity;
  }
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
