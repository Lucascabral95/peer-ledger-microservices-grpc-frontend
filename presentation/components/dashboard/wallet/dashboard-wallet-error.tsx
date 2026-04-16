import Link from "next/link";

import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletErrorProps {
  title: string;
  description: string;
  onRetry?: () => void | Promise<void>;
  retryLabel?: string;
  actionHref?: string;
  actionLabel?: string;
}

export function DashboardWalletError({
  title,
  description,
  onRetry,
  retryLabel = "Reintentar",
  actionHref,
  actionLabel,
}: DashboardWalletErrorProps) {
  return (
    <section className={styles.errorCard}>
      <span className={styles.sectionEyebrow}>Mi billetera</span>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardDescription}>{description}</p>

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
