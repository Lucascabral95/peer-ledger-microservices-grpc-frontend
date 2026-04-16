import type { WalletTopupItemModel } from "@/domain/models";

import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletTopupRowProps {
  topup: WalletTopupItemModel;
}

export function DashboardWalletTopupRow({ topup }: DashboardWalletTopupRowProps) {
  return (
    <tr className={styles.tableRow}>
      <td data-label="Fecha">
        <div className={styles.rowMain}>
          <strong>{topup.dateLabel}</strong>
          <span>{topup.date}</span>
        </div>
      </td>
      <td className={styles.amountCell} data-label="Monto">
        {topup.amountLabel}
      </td>
      <td data-label="Saldo posterior">{topup.balanceAfterLabel}</td>
      <td data-label="Estado">
        <span className={`${styles.statusPill} ${styles[getToneClass(topup.tone)]}`}>
          {topup.statusLabel}
        </span>
      </td>
    </tr>
  );
}

function getToneClass(tone: WalletTopupItemModel["tone"]) {
  return `tone${tone[0].toUpperCase()}${tone.slice(1)}` as
    | "toneSuccess"
    | "toneInfo"
    | "toneWarning"
    | "toneDanger";
}
