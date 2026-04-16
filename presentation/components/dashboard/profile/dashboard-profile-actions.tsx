import Link from "next/link";

import type { ProfileActionModel } from "@/domain/models";

import styles from "./dashboard-profile.module.scss";

interface DashboardProfileActionsProps {
  actions: ProfileActionModel[];
}

export function DashboardProfileActions({ actions }: DashboardProfileActionsProps) {
  return (
    <section className={styles.actionsCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Acciones</span>
          <h3 className={styles.cardTitle}>Operar desde tu perfil</h3>
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
