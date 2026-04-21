import type { ProfileViewModel } from "@/domain/models";

import { DashboardProfileCopyIdButton } from "./dashboard-profile-copy-id-button";
import styles from "./dashboard-profile.module.scss";

interface DashboardProfileReceiveIdCardProps {
  profile: ProfileViewModel;
}

export function DashboardProfileReceiveIdCard({
  profile,
}: DashboardProfileReceiveIdCardProps) {
  return (
    <section className={styles.receiveIdCard} id="receive-id">
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Recibir dinero</span>
          <h3 className={styles.cardTitle}>ID para recibir transferencias</h3>
          <p className={styles.receiveIdDescription}>
            Comparte este identificador para que otros usuarios lo usen como
            receiver_id al enviarte dinero.
          </p>
        </div>
      </div>

      <div className={styles.receiveIdBox}>
        <code>{profile.userId}</code>
        <DashboardProfileCopyIdButton userId={profile.userId} />
      </div>
    </section>
  );
}
