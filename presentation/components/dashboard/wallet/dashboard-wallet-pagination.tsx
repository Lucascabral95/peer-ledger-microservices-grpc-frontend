import type { WalletPaginationModel } from "@/domain/models";

import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletPaginationProps {
  pagination: WalletPaginationModel;
  onNext: () => void;
  onPrevious: () => void;
}

export function DashboardWalletPagination({
  pagination,
  onNext,
  onPrevious,
}: DashboardWalletPaginationProps) {
  return (
    <nav className={styles.paginationCard} aria-label="Paginacion de recargas">
      <button
        type="button"
        className={styles.paginationButton}
        onClick={onPrevious}
        disabled={!pagination.canGoBack}
      >
        Anterior
      </button>
      <span>{pagination.label}</span>
      <button
        type="button"
        className={styles.paginationButton}
        onClick={onNext}
        disabled={!pagination.hasNext}
      >
        Siguiente
      </button>
    </nav>
  );
}
