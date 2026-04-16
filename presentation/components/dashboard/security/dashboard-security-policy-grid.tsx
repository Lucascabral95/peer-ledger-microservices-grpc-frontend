import type { SecurityPolicyModel } from "@/domain/models";

import { DashboardSecurityPolicyCard } from "./dashboard-security-policy-card";
import styles from "./dashboard-security.module.scss";

interface DashboardSecurityPolicyGridProps {
  policies: SecurityPolicyModel[];
}

export function DashboardSecurityPolicyGrid({
  policies,
}: DashboardSecurityPolicyGridProps) {
  return (
    <section className={styles.policyGrid} aria-label="Politicas base">
      {policies.map((policy) => (
        <DashboardSecurityPolicyCard key={policy.id} policy={policy} />
      ))}
    </section>
  );
}
