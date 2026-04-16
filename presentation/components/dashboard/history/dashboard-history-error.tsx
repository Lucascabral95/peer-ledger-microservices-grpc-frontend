import Link from "next/link";

import styles from "./dashboard-history.module.scss";

interface DashboardHistoryErrorProps {
  title: string;
  description: string;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function DashboardHistoryError({
  title,
  description,
  onRetry,
  retryLabel = "Reintentar",
  actionHref,
  actionLabel,
}: DashboardHistoryErrorProps) {
  return (
    <section className={styles.errorCard}>
      <span className={styles.sectionEyebrow}>Historial</span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.emptyDescription}>{description}</p>

      <div className={styles.errorActions}>
        {onRetry ? (
          <button
            type="button"
            className={styles.primaryButton}
            onClick={() => void onRetry()}
          >
            {retryLabel}
          </button>
        ) : null}

        {actionHref && actionLabel ? (
          <Link href={actionHref} className={styles.secondaryLink}>
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
