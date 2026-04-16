import type { TransfersWalletModel } from "@/domain/models";

import styles from "./dashboard-transfers.module.scss";

interface DashboardTransferBalanceCardProps {
  wallet: TransfersWalletModel;
}

export function DashboardTransferBalanceCard({
  wallet,
}: DashboardTransferBalanceCardProps) {
  return (
    <section className={styles.balanceCard}>
      <div>
        <span className={styles.sectionEyebrow}>Saldo disponible</span>
        <h3 className={styles.balanceValue}>{wallet.balanceLabel}</h3>
        <p className={styles.cardDescription}>{wallet.helper}</p>
      </div>

      <div className={styles.balanceAside}>
        <span>Maximo por transferencia</span>
        <strong>20000</strong>
      </div>
    </section>
  );
}
