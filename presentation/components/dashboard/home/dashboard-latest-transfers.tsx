import type { DashboardLatestTransferModel } from "@/domain/models";
import {
  formatDashboardAmount,
  formatDashboardDate,
} from "@/shared/utils";
import styles from "./dashboard-home.module.scss";

interface DashboardLatestTransfersProps {
  transfers: DashboardLatestTransferModel[];
}

export function DashboardLatestTransfers({
  transfers,
}: DashboardLatestTransfersProps) {
  return (
    <section className={styles.surfaceCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Últimas transferencias</span>
          <h3 className={styles.cardTitle}>Movimientos más recientes</h3>
        </div>
      </div>

      {transfers.length === 0 ? (
        <p className={styles.emptyState}>
          Todavía no hay transferencias recientes para mostrar.
        </p>
      ) : (
        <div className={styles.transferList}>
          {transfers.map((transfer) => (
            <article key={transfer.id} className={styles.transferRow}>
              <div className={styles.transferMeta}>
                <strong className={styles.transferCounterparty}>
                  {transfer.counterparty}
                </strong>
                <span className={styles.transferDate}>
                  {formatDashboardDate(transfer.date)}
                </span>
              </div>

              <div className={styles.transferSummary}>
                <span className={styles.transferDirection}>
                  {transfer.direction === "sent" ? "Enviada" : "Recibida"}
                </span>
                <strong className={styles.transferAmount}>
                  {formatDashboardAmount(transfer.amount)}
                </strong>
                <span
                  className={`${styles.statusBadge} ${
                    styles[`statusBadge${capitalize(transfer.status)}`]
                  }`.trim()}
                >
                  {mapStatusLabel(transfer.status)}
                </span>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function mapStatusLabel(status: DashboardLatestTransferModel["status"]) {
  switch (status) {
    case "completed":
      return "Completada";
    case "blocked":
      return "Bloqueada";
    case "failed":
      return "Fallida";
    case "partial":
      return "Parcial";
    default:
      return status;
  }
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
