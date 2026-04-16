import Link from "next/link";

import type { DashboardQuickActionModel } from "@/domain/models";
import styles from "./dashboard-home.module.scss";

interface DashboardQuickActionsProps {
  actions: DashboardQuickActionModel[];
}

export function DashboardQuickActions({
  actions,
}: DashboardQuickActionsProps) {
  return (
    <section className={styles.surfaceCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Acciones rápidas</span>
          <h3 className={styles.cardTitle}>Operar sin salir de la home</h3>
        </div>
      </div>

      <div className={styles.actionsGrid}>
        {actions.map((action) => (
          <Link key={action.id} href={action.href} className={styles.actionLink}>
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
