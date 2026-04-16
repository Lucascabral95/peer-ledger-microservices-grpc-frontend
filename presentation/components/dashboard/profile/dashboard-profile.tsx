"use client";

import { AUTH_ROUTES } from "@/shared/constants";
import { useProfileViewModel } from "@/presentation/hooks";

import { DashboardProfileActions } from "./dashboard-profile-actions";
import { DashboardProfileDetailsGrid } from "./dashboard-profile-details-grid";
import { DashboardProfileError } from "./dashboard-profile-error";
import { DashboardProfileHeader } from "./dashboard-profile-header";
import { DashboardProfileIdentityCard } from "./dashboard-profile-identity-card";
import { DashboardProfileSecurityCard } from "./dashboard-profile-security-card";
import { DashboardProfileSkeleton } from "./dashboard-profile-skeleton";
import styles from "./dashboard-profile.module.scss";

export function DashboardProfile() {
  const {
    profile,
    isLoading,
    isError,
    errorMessage,
    isMissingSession,
    refetch,
  } = useProfileViewModel();

  if (isMissingSession) {
    return (
      <DashboardProfileError
        title="No hay una sesion activa"
        description="Necesitas iniciar sesion nuevamente para ver tu perfil."
        actionHref={AUTH_ROUTES.login}
        actionLabel="Ir al login"
      />
    );
  }

  if (isLoading) {
    return <DashboardProfileSkeleton />;
  }

  if (isError || !profile) {
    return (
      <DashboardProfileError
        title="No pudimos cargar tu perfil"
        description={errorMessage}
        onRetry={refetch}
        retryLabel="Reintentar"
      />
    );
  }

  return (
    <div className={styles.profilePage}>
      <DashboardProfileHeader
        displayName={profile.displayName}
        statusLabel={profile.statusLabel}
      />

      <DashboardProfileIdentityCard profile={profile} />
      <DashboardProfileDetailsGrid details={profile.details} />

      <div className={styles.profileGrid}>
        <DashboardProfileSecurityCard
          sessionLabel={profile.sessionLabel}
          signals={profile.securitySignals}
        />
        <DashboardProfileActions actions={profile.actions} />
      </div>
    </div>
  );
}
