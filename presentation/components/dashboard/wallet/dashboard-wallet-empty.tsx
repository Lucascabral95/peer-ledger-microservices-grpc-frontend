import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletEmptyProps {
  message: string;
}

export function DashboardWalletEmpty({ message }: DashboardWalletEmptyProps) {
  return (
    <section className={styles.emptyCard}>
      <span className={styles.sectionEyebrow}>Recargas</span>
      <h3 className={styles.cardTitle}>Sin movimientos de recarga</h3>
      <p className={styles.cardDescription}>{message}</p>
    </section>
  );
}
