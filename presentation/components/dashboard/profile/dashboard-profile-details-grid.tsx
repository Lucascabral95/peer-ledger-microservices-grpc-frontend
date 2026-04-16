import type { ProfileDetailItemModel } from "@/domain/models";

import { DashboardProfileDetailCard } from "./dashboard-profile-detail-card";
import styles from "./dashboard-profile.module.scss";

interface DashboardProfileDetailsGridProps {
  details: ProfileDetailItemModel[];
}

export function DashboardProfileDetailsGrid({
  details,
}: DashboardProfileDetailsGridProps) {
  return (
    <section className={styles.detailsGrid} aria-label="Detalles de perfil">
      {details.map((detail) => (
        <DashboardProfileDetailCard key={detail.id} detail={detail} />
      ))}
    </section>
  );
}
