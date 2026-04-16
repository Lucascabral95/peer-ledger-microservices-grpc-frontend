import type { HistoryPaginationModel } from "@/domain/models";

import styles from "./dashboard-history.module.scss";

interface DashboardHistoryPaginationProps {
  pagination: HistoryPaginationModel;
  onNext: () => void;
  onPrevious: () => void;
}

export function DashboardHistoryPagination({
  pagination,
  onNext,
  onPrevious,
}: DashboardHistoryPaginationProps) {
  return (
    <nav className={styles.paginationCard} aria-label="Paginacion de historial">
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
