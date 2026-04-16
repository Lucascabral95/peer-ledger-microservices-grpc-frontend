import styles from "./dashboard-profile.module.scss";

export function DashboardProfileSkeleton() {
  return (
    <div className={styles.profilePage} aria-label="Profile loading">
      <section className={styles.skeletonHeader}>
        <div className={styles.skeletonLineLong} />
        <div className={styles.skeletonLineMedium} />
      </section>

      <section className={styles.skeletonIdentity} />

      <div className={styles.detailsGrid}>
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className={styles.skeletonDetail} />
        ))}
      </div>

      <div className={styles.profileGrid}>
        <div className={styles.skeletonPanel} />
        <div className={styles.skeletonPanel} />
      </div>
    </div>
  );
}
