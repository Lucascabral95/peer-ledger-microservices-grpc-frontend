"use client";

import { AUTH_ROUTES } from "@/shared/constants";
import { useTransfersViewModel } from "@/presentation/hooks";

import { DashboardTransferBalanceCard } from "./dashboard-transfer-balance-card";
import { DashboardTransferError } from "./dashboard-transfer-error";
import { DashboardTransferForm } from "./dashboard-transfer-form";
import { DashboardTransferLimitsCard } from "./dashboard-transfer-limits-card";
import { DashboardTransferRecentList } from "./dashboard-transfer-recent-list";
import { DashboardTransferSkeleton } from "./dashboard-transfer-skeleton";
import { DashboardTransfersHeader } from "./dashboard-transfers-header";
import styles from "./dashboard-transfers.module.scss";

export function DashboardTransfers() {
  const {
    transfers,
    isLoading,
    isError,
    errorMessage,
    isMissingSession,
    submitState,
    submitTransfer,
    refetch,
  } = useTransfersViewModel();

  if (isMissingSession) {
    return (
      <DashboardTransferError
        title="No hay una sesion activa"
        description="Necesitas iniciar sesion nuevamente para enviar dinero."
        actionHref={AUTH_ROUTES.login}
        actionLabel="Ir al login"
      />
    );
  }

  if (isLoading) {
    return <DashboardTransferSkeleton />;
  }

  if (isError || !transfers) {
    return (
      <DashboardTransferError
        title="No pudimos cargar transferencias"
        description={errorMessage}
        onRetry={refetch}
        retryLabel="Reintentar"
      />
    );
  }

  return (
    <div className={styles.transfersPage}>
      <DashboardTransfersHeader />
      <DashboardTransferBalanceCard wallet={transfers.wallet} />

      <div className={styles.transfersGrid}>
        <div className={styles.primaryColumn}>
          <DashboardTransferForm
            transfers={transfers}
            submitState={submitState}
            onSubmit={submitTransfer}
          />
          <DashboardTransferRecentList transfers={transfers.recentTransfers} />
        </div>

        <DashboardTransferLimitsCard limits={transfers.limits} />
      </div>
    </div>
  );
}
