import type { ProfileDetailItemModel } from "@/domain/models";

import styles from "./dashboard-profile.module.scss";

interface DashboardProfileDetailCardProps {
  detail: ProfileDetailItemModel;
}

export function DashboardProfileDetailCard({
  detail,
}: DashboardProfileDetailCardProps) {
  return (
    <article className={styles.detailCard}>
      <span className={styles.detailLabel}>{detail.label}</span>
      <strong className={styles.detailValue}>{detail.value}</strong>
      <p className={styles.detailHelper}>{detail.helper}</p>
    </article>
  );
}
