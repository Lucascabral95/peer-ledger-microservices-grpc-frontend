import styles from "./dashboard-history.module.scss";

export function DashboardHistorySkeleton() {
  return (
    <div className={styles.historyPage} aria-label="History loading">
      <section className={styles.skeletonHeader}>
        <div className={styles.skeletonLineLong} />
        <div className={styles.skeletonLineMedium} />
      </section>
      <div className={styles.summaryGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.skeletonSummary} />
        ))}
      </div>
      <section className={styles.skeletonPanel} />
      <section className={styles.skeletonTable} />
    </div>
  );
}
