import styles from "./dashboard-wallet.module.scss";

export function DashboardWalletSkeleton() {
  return (
    <div className={styles.walletPage} aria-label="Cargando billetera">
      <section className={styles.skeletonHeader}>
        <div className={styles.skeletonLineLong} />
        <div className={styles.skeletonLineMedium} />
      </section>
      <section className={styles.skeletonBalance} />
      <section className={styles.skeletonMetrics} />
      <div className={styles.walletGrid}>
        <section className={styles.skeletonPanel} />
        <section className={styles.skeletonPanel} />
      </div>
      <section className={styles.skeletonTable} />
    </div>
  );
}
