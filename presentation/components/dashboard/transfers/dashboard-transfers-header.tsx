import styles from "./dashboard-transfers.module.scss";

export function DashboardTransfersHeader() {
  return (
    <section className={styles.transfersHeader}>
      <div>
        <span className={styles.sectionEyebrow}>Transferencias</span>
        <h2 className={styles.headerTitle}>Transferencias P2P</h2>
        <p className={styles.headerDescription}>
          Envia dinero con controles de idempotencia, rate limit y antifraude.
        </p>
      </div>

      <div className={styles.statusBadge}>
        <span className={styles.statusDot} />
        <span>Operacion protegida</span>
      </div>
    </section>
  );
}
