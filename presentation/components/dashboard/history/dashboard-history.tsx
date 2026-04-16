"use client";

import { AUTH_ROUTES } from "@/shared/constants";
import { useHistoryViewModel } from "@/presentation/hooks";

import { DashboardHistoryEmpty } from "./dashboard-history-empty";
import { DashboardHistoryError } from "./dashboard-history-error";
import { DashboardHistoryFilters } from "./dashboard-history-filters";
import { DashboardHistoryHeader } from "./dashboard-history-header";
import { DashboardHistoryPagination } from "./dashboard-history-pagination";
import { DashboardHistorySkeleton } from "./dashboard-history-skeleton";
import { DashboardHistorySummary } from "./dashboard-history-summary";
import { DashboardHistoryTable } from "./dashboard-history-table";
import styles from "./dashboard-history.module.scss";

export function DashboardHistory() {
  const {
    history,
    filters,
    setKind,
    setFrom,
    setTo,
    nextPage,
    previousPage,
    resetFilters,
    isLoading,
    isError,
    errorMessage,
    isMissingSession,
    refetch,
  } = useHistoryViewModel();

  if (isMissingSession) {
    return (
      <DashboardHistoryError
        title="No hay una sesion activa"
        description="Necesitas iniciar sesion nuevamente para ver tu historial."
        actionHref={AUTH_ROUTES.login}
        actionLabel="Ir al login"
      />
    );
  }

  if (isLoading) {
    return <DashboardHistorySkeleton />;
  }

  if (isError || !history) {
    return (
      <DashboardHistoryError
        title="No pudimos cargar el historial"
        description={errorMessage}
        onRetry={refetch}
        retryLabel="Reintentar"
      />
    );
  }

  return (
    <div className={styles.historyPage}>
      <DashboardHistoryHeader title={history.title} subtitle={history.subtitle} />
      <DashboardHistorySummary summary={history.summary} />
      <DashboardHistoryFilters
        filters={history.filters}
        activeKind={filters.kind}
        from={filters.from}
        to={filters.to}
        onKindChange={setKind}
        onFromChange={setFrom}
        onToChange={setTo}
        onReset={resetFilters}
      />

      {history.rows.length === 0 ? (
        <DashboardHistoryEmpty message={history.emptyMessage} />
      ) : (
        <>
          <DashboardHistoryTable rows={history.rows} />
          <DashboardHistoryPagination
            pagination={history.pagination}
            onNext={nextPage}
            onPrevious={previousPage}
          />
        </>
      )}
    </div>
  );
}
