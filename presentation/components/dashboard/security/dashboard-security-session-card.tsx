import type { SecuritySessionModel } from "@/domain/models";
import { SECURITY_TOKEN_POLICY } from "@/shared/constants";

import styles from "./dashboard-security.module.scss";

interface DashboardSecuritySessionCardProps {
  session: SecuritySessionModel;
}

export function DashboardSecuritySessionCard({
  session,
}: DashboardSecuritySessionCardProps) {
  return (
    <section className={styles.sessionCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Sesion</span>
          <h3 className={styles.cardTitle}>{session.statusLabel}</h3>
        </div>
        <span
          className={`${styles.cardPill} ${
            styles[`tone${capitalize(session.tone)}`]
          }`.trim()}
        >
          {session.expiresInLabel}
        </span>
      </div>

      <p className={styles.cardDescription}>{session.description}</p>

      <dl className={styles.sessionStats}>
        <div>
          <dt>Access token</dt>
          <dd>{SECURITY_TOKEN_POLICY.accessTokenHours}h</dd>
        </div>
        <div>
          <dt>Refresh token</dt>
          <dd>{SECURITY_TOKEN_POLICY.refreshTokenHours}h</dd>
        </div>
        <div>
          <dt>Expiracion actual</dt>
          <dd>{session.expiresAt ?? "No disponible"}</dd>
        </div>
      </dl>
    </section>
  );
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
