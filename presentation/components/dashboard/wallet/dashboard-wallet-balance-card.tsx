import type { WalletViewModel } from "@/domain/models";

import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletBalanceCardProps {
  wallet: WalletViewModel;
}

export function DashboardWalletBalanceCard({
  wallet,
}: DashboardWalletBalanceCardProps) {
  return (
    <section className={styles.balanceCard}>
      <div>
        <span className={styles.sectionEyebrow}>Saldo disponible</span>
        <h2 className={styles.balanceValue}>{wallet.balance.amountLabel}</h2>
        <p className={styles.cardDescription}>{wallet.balance.helper}</p>
      </div>

      <aside className={styles.balanceAside}>
        <span>{wallet.identity.label}</span>
        <strong>{wallet.identity.shortUserId}</strong>
        <small>Identificador operativo de tu billetera.</small>
      </aside>
    </section>
  );
}
