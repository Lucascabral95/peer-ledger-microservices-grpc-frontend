import Link from "next/link";

import styles from "./dashboard-security.module.scss";

interface DashboardSecurityErrorProps {
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function DashboardSecurityError({
  title,
  description,
  actionHref,
  actionLabel,
}: DashboardSecurityErrorProps) {
  return (
    <section className={styles.errorCard}>
      <span className={styles.sectionEyebrow}>Seguridad</span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>

      {actionHref && actionLabel ? (
        <Link href={actionHref} className={styles.actionLink}>
          <span>{actionLabel}</span>
        </Link>
      ) : null}
    </section>
  );
}
