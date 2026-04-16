import type { TransfersRecentTransferModel } from "@/domain/models";

import styles from "./dashboard-transfers.module.scss";

interface DashboardTransferRecentListProps {
  transfers: TransfersRecentTransferModel[];
}

export function DashboardTransferRecentList({
  transfers,
}: DashboardTransferRecentListProps) {
  return (
    <section className={styles.recentCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Recientes</span>
          <h3 className={styles.cardTitle}>Ultimas transferencias</h3>
        </div>
      </div>

      {transfers.length === 0 ? (
        <p className={styles.cardDescription}>
          Todavia no hay transferencias recientes para mostrar.
        </p>
      ) : (
        <div className={styles.recentList}>
          {transfers.map((transfer) => (
            <article key={transfer.id} className={styles.recentItem}>
              <div>
                <strong>{transfer.counterparty}</strong>
                <span>{transfer.dateLabel}</span>
              </div>

              <div className={styles.recentSummary}>
                <span>{transfer.directionLabel}</span>
                <strong>{transfer.amountLabel}</strong>
                <small>{transfer.statusLabel}</small>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
