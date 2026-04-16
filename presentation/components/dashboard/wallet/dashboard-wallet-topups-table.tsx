import type { WalletTopupItemModel } from "@/domain/models";

import { DashboardWalletTopupRow } from "./dashboard-wallet-topup-row";
import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletTopupsTableProps {
  topups: WalletTopupItemModel[];
}

export function DashboardWalletTopupsTable({
  topups,
}: DashboardWalletTopupsTableProps) {
  return (
    <section className={styles.topupsCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Recargas recientes</span>
          <h3 className={styles.cardTitle}>Historial de recargas</h3>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.walletTable}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Monto</th>
              <th>Saldo posterior</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {topups.map((topup) => (
              <DashboardWalletTopupRow key={topup.id} topup={topup} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
