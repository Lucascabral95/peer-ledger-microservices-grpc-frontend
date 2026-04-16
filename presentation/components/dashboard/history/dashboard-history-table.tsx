import type { HistoryRowModel } from "@/domain/models";

import { DashboardHistoryRow } from "./dashboard-history-row";
import styles from "./dashboard-history.module.scss";

interface DashboardHistoryTableProps {
  rows: HistoryRowModel[];
}

export function DashboardHistoryTable({ rows }: DashboardHistoryTableProps) {
  return (
    <section className={styles.tableCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Movimientos</span>
          <h3 className={styles.cardTitle}>Actividad reciente</h3>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.historyTable}>
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Contraparte</th>
              <th>Monto</th>
              <th>Saldo posterior</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <DashboardHistoryRow key={row.id} row={row} />
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
