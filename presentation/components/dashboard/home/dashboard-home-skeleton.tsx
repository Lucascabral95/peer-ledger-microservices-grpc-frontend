import styles from "./dashboard-home.module.scss";

export function DashboardHomeSkeleton() {
  return (
    <div className={styles.home} aria-label="Dashboard loading">
      <section className={styles.skeletonHero}>
        <div className={styles.skeletonLineLong} />
        <div className={styles.skeletonLineMedium} />
      </section>

      <section className={styles.skeletonBalance} />

      <div className={styles.metricsGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.skeletonMetric} />
        ))}
      </div>

      <div className={styles.contentGrid}>
        <div className={styles.primaryColumn}>
          <div className={styles.skeletonPanelTall} />
          <div className={styles.skeletonPanelMedium} />
        </div>

        <div className={styles.secondaryColumn}>
          <div className={styles.skeletonPanelMedium} />
          <div className={styles.skeletonPanelMedium} />
        </div>
      </div>
    </div>
  );
}
