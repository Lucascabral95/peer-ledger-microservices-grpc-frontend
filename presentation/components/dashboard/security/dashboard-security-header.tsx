import type { SecuritySessionModel } from "@/domain/models";

import styles from "./dashboard-security.module.scss";

interface DashboardSecurityHeaderProps {
  session: SecuritySessionModel;
  isMissingSession: boolean;
}

export function DashboardSecurityHeader({
  session,
  isMissingSession,
}: DashboardSecurityHeaderProps) {
  return (
    <section className={styles.securityHeader}>
      <div>
        <span className={styles.sectionEyebrow}>Seguridad</span>
        <h2 className={styles.headerTitle}>Controles operativos</h2>
        <p className={styles.headerDescription}>
          Resumen de protecciones activas para sesion, transferencias y
          antifraude.
        </p>
        {isMissingSession ? (
          <p className={styles.headerMeta}>
            La vista muestra politicas generales mientras se recupera la sesion.
          </p>
        ) : (
          <p className={styles.headerMeta}>
            Monitoreo local basado en el access token actual.
          </p>
        )}
      </div>

      <div
        className={`${styles.statusBadge} ${
          styles[`tone${capitalize(session.tone)}`]
        }`.trim()}
      >
        <span className={styles.statusDot} />
        <span>{session.statusLabel}</span>
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
