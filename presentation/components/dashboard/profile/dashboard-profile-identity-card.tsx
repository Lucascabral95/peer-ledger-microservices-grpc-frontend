import type { ProfileViewModel } from "@/domain/models";

import styles from "./dashboard-profile.module.scss";

interface DashboardProfileIdentityCardProps {
  profile: ProfileViewModel;
}

export function DashboardProfileIdentityCard({
  profile,
}: DashboardProfileIdentityCardProps) {
  return (
    <section className={styles.identityCard}>
      <div className={styles.avatar}>{profile.initials}</div>

      <div className={styles.identityContent}>
        <span className={styles.sectionEyebrow}>Identidad sincronizada</span>
        <h3 className={styles.identityName}>{profile.displayName}</h3>
        <p className={styles.identityEmail}>{profile.email}</p>
      </div>

      <div className={styles.identityAside}>
        <span className={styles.asideLabel}>User ID</span>
        <strong className={styles.asideValue}>{profile.shortUserId}</strong>
      </div>
    </section>
  );
}
