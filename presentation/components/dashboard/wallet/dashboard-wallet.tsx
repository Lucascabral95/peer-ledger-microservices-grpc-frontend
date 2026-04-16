"use client";

import { AUTH_ROUTES } from "@/shared/constants";
import { useWalletViewModel } from "@/presentation/hooks";

import { DashboardWalletActions } from "./dashboard-wallet-actions";
import { DashboardWalletAlerts } from "./dashboard-wallet-alerts";
import { DashboardWalletBalanceCard } from "./dashboard-wallet-balance-card";
import { DashboardWalletEmpty } from "./dashboard-wallet-empty";
import { DashboardWalletError } from "./dashboard-wallet-error";
import { DashboardWalletFilters } from "./dashboard-wallet-filters";
import { DashboardWalletHeader } from "./dashboard-wallet-header";
import { DashboardWalletMetricsGrid } from "./dashboard-wallet-metrics-grid";
import { DashboardWalletPagination } from "./dashboard-wallet-pagination";
import { DashboardWalletSkeleton } from "./dashboard-wallet-skeleton";
import { DashboardWalletTopupForm } from "./dashboard-wallet-topup-form";
import { DashboardWalletTopupsTable } from "./dashboard-wallet-topups-table";
import styles from "./dashboard-wallet.module.scss";

export function DashboardWallet() {
  const {
    wallet,
    filters,
    setFrom,
    setTo,
    nextPage,
    previousPage,
    resetFilters,
    submitTopUp,
    submitState,
    isLoading,
    isError,
    hasTopupsError,
    topupsErrorMessage,
    errorMessage,
    isMissingSession,
    refetch,
  } = useWalletViewModel();

  if (isMissingSession) {
    return (
      <DashboardWalletError
        title="No hay una sesion activa"
        description="Necesitas iniciar sesion nuevamente para ver tu billetera."
        actionHref={AUTH_ROUTES.login}
        actionLabel="Ir al login"
      />
    );
  }

  if (isLoading) {
    return <DashboardWalletSkeleton />;
  }

  if (isError || !wallet) {
    return (
      <DashboardWalletError
        title="No pudimos cargar tu billetera"
        description={errorMessage}
        onRetry={refetch}
        retryLabel="Reintentar"
      />
    );
  }

  return (
    <div className={styles.walletPage}>
      <DashboardWalletHeader />
      <DashboardWalletBalanceCard wallet={wallet} />
      <DashboardWalletMetricsGrid metrics={wallet.metrics} />

      <div className={styles.walletGrid}>
        <div className={styles.primaryColumn}>
          <DashboardWalletTopupForm
            wallet={wallet}
            submitState={submitState}
            onSubmit={submitTopUp}
          />
          <DashboardWalletFilters
            from={filters.from}
            to={filters.to}
            onFromChange={setFrom}
            onToChange={setTo}
            onReset={resetFilters}
          />
        </div>

        <div className={styles.secondaryColumn}>
          <DashboardWalletAlerts alerts={wallet.alerts} />
          <DashboardWalletActions actions={wallet.actions} />
        </div>
      </div>

      {hasTopupsError ? (
        <DashboardWalletError
          title="No pudimos cargar tus recargas"
          description={topupsErrorMessage}
          onRetry={refetch}
          retryLabel="Reintentar"
        />
      ) : wallet.topups.length === 0 ? (
        <DashboardWalletEmpty message={wallet.emptyMessage} />
      ) : (
        <>
          <DashboardWalletTopupsTable topups={wallet.topups} />
          <DashboardWalletPagination
            pagination={wallet.pagination}
            onNext={nextPage}
            onPrevious={previousPage}
          />
        </>
      )}
    </div>
  );
}
