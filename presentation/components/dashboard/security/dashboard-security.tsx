"use client";

import { useSecurityViewModel } from "@/presentation/hooks";

import { DashboardSecurityActions } from "./dashboard-security-actions";
import { DashboardSecurityFraudCard } from "./dashboard-security-fraud-card";
import { DashboardSecurityHeader } from "./dashboard-security-header";
import { DashboardSecurityPasswordCard } from "./dashboard-security-password-card";
import { DashboardSecurityPolicyGrid } from "./dashboard-security-policy-grid";
import { DashboardSecurityRateLimitCard } from "./dashboard-security-rate-limit-card";
import { DashboardSecuritySessionCard } from "./dashboard-security-session-card";
import styles from "./dashboard-security.module.scss";

export function DashboardSecurity() {
  const { security, isMissingSession } = useSecurityViewModel();

  return (
    <div className={styles.securityPage}>
      <DashboardSecurityHeader
        session={security.session}
        isMissingSession={isMissingSession}
      />

      <DashboardSecuritySessionCard session={security.session} />
      <DashboardSecurityPolicyGrid policies={security.policies} />

      <div className={styles.securityGrid}>
        <DashboardSecurityFraudCard rules={security.fraudRules} />

        <div className={styles.secondaryColumn}>
          <DashboardSecurityRateLimitCard rateLimits={security.rateLimits} />
          <DashboardSecurityPasswordCard
            requirements={security.passwordRequirements}
          />
          <DashboardSecurityActions actions={security.actions} />
        </div>
      </div>
    </div>
  );
}
