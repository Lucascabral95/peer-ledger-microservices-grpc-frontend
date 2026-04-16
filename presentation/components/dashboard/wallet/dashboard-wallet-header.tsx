import styles from "./dashboard-wallet.module.scss";

export function DashboardWalletHeader() {
  return (
    <header className={styles.walletHeader}>
      <div>
        <span className={styles.sectionEyebrow}>Mi billetera</span>
        <h1 className={styles.headerTitle}>Saldo y recargas</h1>
        <p className={styles.headerDescription}>
          Administra tu saldo disponible y audita tus recargas recientes.
        </p>
      </div>

      <div className={styles.statusBadge}>
        <span className={styles.statusDot} aria-hidden="true" />
        Wallet activa
      </div>
    </header>
  );
}
