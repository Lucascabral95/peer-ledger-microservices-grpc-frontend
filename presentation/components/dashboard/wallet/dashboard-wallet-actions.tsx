import Link from "next/link";

import type { WalletActionModel } from "@/domain/models";

import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletActionsProps {
  actions: WalletActionModel[];
}

export function DashboardWalletActions({ actions }: DashboardWalletActionsProps) {
  return (
    <section className={styles.actionsCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Acciones</span>
          <h3 className={styles.cardTitle}>Atajos operativos</h3>
        </div>
      </div>

      <div className={styles.actionsList}>
        {actions.map((action) => (
          <Link className={styles.actionLink} href={action.href} key={action.id}>
            <strong>{action.label}</strong>
            <span>{action.description}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
