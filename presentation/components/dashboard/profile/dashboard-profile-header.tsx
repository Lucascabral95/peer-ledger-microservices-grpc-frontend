import styles from "./dashboard-profile.module.scss";

interface DashboardProfileHeaderProps {
  displayName: string;
  statusLabel: string;
}

export function DashboardProfileHeader({
  displayName,
  statusLabel,
}: DashboardProfileHeaderProps) {
  return (
    <section className={styles.profileHeader}>
      <div>
        <span className={styles.sectionEyebrow}>Perfil</span>
        <h2 className={styles.headerTitle}>Identidad de cuenta</h2>
        <p className={styles.headerDescription}>
          Consulta la informacion principal asociada a tu cuenta Peer Ledger.
        </p>
        <p className={styles.headerMeta}>Vista operativa para {displayName}</p>
      </div>

      <div className={styles.statusBadge}>
        <span className={styles.statusDot} />
        <span>{statusLabel}</span>
      </div>
    </section>
  );
}
