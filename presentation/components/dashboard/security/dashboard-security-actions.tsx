import Link from "next/link";

import type { SecurityActionModel } from "@/domain/models";

import styles from "./dashboard-security.module.scss";

interface DashboardSecurityActionsProps {
  actions: SecurityActionModel[];
}

export function DashboardSecurityActions({ actions }: DashboardSecurityActionsProps) {
  return (
    <section className={styles.actionsCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Acciones</span>
          <h3 className={styles.cardTitle}>Operar con controles</h3>
        </div>
      </div>

      <div className={styles.actionsList}>
        {actions.map((action) => (
          <Link key={action.id} href={action.href} className={styles.actionLink}>
            <span>{action.label}</span>
            <small>{action.description}</small>
          </Link>
        ))}
      </div>
    </section>
  );
}
