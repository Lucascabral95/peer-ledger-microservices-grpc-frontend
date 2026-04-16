import styles from "./dashboard-security.module.scss";

export function DashboardSecuritySkeleton() {
  return (
    <div className={styles.securityPage} aria-label="Security loading">
      <section className={styles.skeletonHeader}>
        <div className={styles.skeletonLineLong} />
        <div className={styles.skeletonLineMedium} />
      </section>

      <section className={styles.skeletonPanel} />

      <div className={styles.policyGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.skeletonPolicy} />
        ))}
      </div>

      <div className={styles.securityGrid}>
        <div className={styles.skeletonTallPanel} />
        <div className={styles.secondaryColumn}>
          <div className={styles.skeletonPanel} />
          <div className={styles.skeletonPanel} />
        </div>
      </div>
    </div>
  );
}
