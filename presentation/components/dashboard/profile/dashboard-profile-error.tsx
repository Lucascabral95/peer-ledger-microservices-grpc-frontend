import Link from "next/link";

import styles from "./dashboard-profile.module.scss";

interface DashboardProfileErrorProps {
  title: string;
  description: string;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function DashboardProfileError({
  title,
  description,
  onRetry,
  retryLabel = "Reintentar",
  actionHref,
  actionLabel,
}: DashboardProfileErrorProps) {
  return (
    <section className={styles.errorCard}>
      <span className={styles.sectionEyebrow}>Perfil</span>
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
          <Link href={actionHref} className={styles.secondaryActionLink}>
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
