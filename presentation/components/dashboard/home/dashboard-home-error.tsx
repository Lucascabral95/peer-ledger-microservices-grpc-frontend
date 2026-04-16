import Link from "next/link";

import styles from "./dashboard-home.module.scss";

interface DashboardHomeErrorProps {
  title: string;
  description: string;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  actionHref?: string;
  actionLabel?: string;
  compact?: boolean;
}

export function DashboardHomeError({
  title,
  description,
  onRetry,
  retryLabel = "Reintentar",
  actionHref,
  actionLabel,
  compact = false,
}: DashboardHomeErrorProps) {
  return (
    <section
      className={`${styles.errorCard} ${
        compact ? styles.errorCardCompact : ""
      }`.trim()}
    >
      <span className={styles.sectionEyebrow}>Estado de carga</span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.errorDescription}>{description}</p>

      <div className={styles.errorActions}>
        {onRetry ? (
          <button
            type="button"
            className={styles.retryButton}
            onClick={() => void onRetry()}
          >
            {retryLabel}
          </button>
        ) : null}

        {actionHref && actionLabel ? (
          <Link href={actionHref} className={styles.actionLinkSecondary}>
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
