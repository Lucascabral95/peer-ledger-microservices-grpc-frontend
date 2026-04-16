import styles from "./dashboard-history.module.scss";

interface DashboardHistoryHeaderProps {
  title: string;
  subtitle: string;
}

export function DashboardHistoryHeader({
  title,
  subtitle,
}: DashboardHistoryHeaderProps) {
  return (
    <section className={styles.historyHeader}>
      <div>
        <span className={styles.sectionEyebrow}>Historial</span>
        <h2 className={styles.headerTitle}>{title}</h2>
        <p className={styles.headerDescription}>{subtitle}</p>
      </div>

      <div className={styles.statusBadge}>
        <span className={styles.statusDot} />
        <span>Auditoria activa</span>
      </div>
    </section>
  );
}
