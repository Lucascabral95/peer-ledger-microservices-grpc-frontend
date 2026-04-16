import type { HistoryRowModel } from "@/domain/models";

import styles from "./dashboard-history.module.scss";

interface DashboardHistoryRowProps {
  row: HistoryRowModel;
}

export function DashboardHistoryRow({ row }: DashboardHistoryRowProps) {
  return (
    <tr className={styles.tableRow}>
      <td data-label="Tipo">
        <div className={styles.rowMain}>
          <strong>{row.label}</strong>
          <span>{row.directionLabel}</span>
        </div>
      </td>
      <td data-label="Fecha">{row.dateLabel}</td>
      <td data-label="Contraparte">{row.counterparty}</td>
      <td data-label="Monto" className={styles.amountCell}>
        {row.directionLabel === "Enviada" ? "-" : "+"}
        {row.amountLabel}
      </td>
      <td data-label="Saldo posterior">{row.balanceAfterLabel}</td>
      <td data-label="Estado">
        <span
          className={`${styles.statusBadge} ${
            styles[`tone${capitalize(row.tone)}`]
          }`.trim()}
        >
          {row.statusLabel}
        </span>
      </td>
    </tr>
  );
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
