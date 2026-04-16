import styles from "./dashboard-transfers.module.scss";

export function DashboardTransferSkeleton() {
  return (
    <div className={styles.transfersPage} aria-label="Transfers loading">
      <section className={styles.skeletonHeader}>
        <div className={styles.skeletonLineLong} />
        <div className={styles.skeletonLineMedium} />
      </section>
      <section className={styles.skeletonBalance} />
      <div className={styles.transfersGrid}>
        <div className={styles.primaryColumn}>
          <section className={styles.skeletonPanel} />
          <section className={styles.skeletonPanel} />
        </div>
        <section className={styles.skeletonTallPanel} />
      </div>
    </div>
  );
}
