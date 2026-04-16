"use client";

import { DashboardHomeError } from "./dashboard-home-error";
import { DashboardHomeHeader } from "./dashboard-home-header";
import { DashboardHomeSkeleton } from "./dashboard-home-skeleton";
import { DashboardBalanceCard } from "./dashboard-balance-card";
import { DashboardMetricsGrid } from "./dashboard-metrics-grid";
import { DashboardLatestTransfers } from "./dashboard-latest-transfers";
import { DashboardTopupSummary } from "./dashboard-topup-summary";
import { DashboardOperationalAlerts } from "./dashboard-operational-alerts";
import { DashboardQuickActions } from "./dashboard-quick-actions";
import { useDashboardHomeQuery } from "@/presentation/hooks";
import { getMissingSessionHref } from "@/shared/utils";
import styles from "./dashboard-home.module.scss";

export function DashboardHome() {
  const {
    dashboard,
    isLoading,
    isError,
    errorMessage,
    refetchAll,
    isHistoryUnavailable,
    isMissingSession,
  } = useDashboardHomeQuery();

  if (isMissingSession) {
    return (
      <DashboardHomeError
        title="No hay una sesión activa"
        description="Necesitás iniciar sesión nuevamente para cargar tu resumen operativo."
        actionHref={getMissingSessionHref()}
        actionLabel="Ir al login"
      />
    );
  }

  if (isLoading) {
    return <DashboardHomeSkeleton />;
  }

  if (isError || !dashboard) {
    return (
      <DashboardHomeError
        title="No pudimos cargar el dashboard"
        description={errorMessage}
        onRetry={refetchAll}
        retryLabel="Reintentar"
      />
    );
  }

  if (isHistoryUnavailable) {
    return (
      <div className={styles.home}>
        <DashboardHomeHeader
          greetingName={dashboard.greetingName}
          sessionStatusLabel={dashboard.sessionStatusLabel}
        />
        <DashboardHomeError
          title="No pudimos obtener tu actividad reciente"
          description={errorMessage}
          onRetry={refetchAll}
          retryLabel="Reintentar"
          compact
        />
      </div>
    );
  }

  return (
    <div className={styles.home}>
      <DashboardHomeHeader
        greetingName={dashboard.greetingName}
        sessionStatusLabel={dashboard.sessionStatusLabel}
      />

      <DashboardBalanceCard balance={dashboard.balance} />
      <DashboardMetricsGrid metrics={dashboard.metrics} />

      <div className={styles.contentGrid}>
        <div className={styles.primaryColumn}>
          <DashboardLatestTransfers transfers={dashboard.latestTransfers} />
          <DashboardOperationalAlerts alerts={dashboard.alerts} />
        </div>

        <div className={styles.secondaryColumn}>
          <DashboardTopupSummary summary={dashboard.topupSummary} />
          <DashboardQuickActions actions={dashboard.quickActions} />
        </div>
      </div>
    </div>
  );
}
