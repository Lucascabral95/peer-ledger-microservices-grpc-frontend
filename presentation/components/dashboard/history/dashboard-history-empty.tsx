import styles from "./dashboard-history.module.scss";

interface DashboardHistoryEmptyProps {
  message: string;
}

export function DashboardHistoryEmpty({ message }: DashboardHistoryEmptyProps) {
  return (
    <section className={styles.emptyCard}>
      <span className={styles.sectionEyebrow}>Sin resultados</span>
      <h3 className={styles.cardTitle}>No encontramos movimientos</h3>
      <p className={styles.emptyDescription}>{message}</p>
    </section>
  );
}
