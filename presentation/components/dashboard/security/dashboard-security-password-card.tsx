import type { SecurityPolicyModel } from "@/domain/models";

import styles from "./dashboard-security.module.scss";

interface DashboardSecurityPasswordCardProps {
  requirements: SecurityPolicyModel[];
}

export function DashboardSecurityPasswordCard({
  requirements,
}: DashboardSecurityPasswordCardProps) {
  return (
    <section className={styles.passwordCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Password</span>
          <h3 className={styles.cardTitle}>Politica obligatoria</h3>
        </div>
      </div>

      <p className={styles.cardDescription}>
        La validacion final vive en backend; frontend solo debe ayudar al
        usuario.
      </p>

      <div className={styles.requirementGrid}>
        {requirements.map((requirement) => (
          <article key={requirement.id} className={styles.requirementItem}>
            <span className={styles.policyLabel}>{requirement.label}</span>
            <strong>{requirement.value}</strong>
          </article>
        ))}
      </div>
    </section>
  );
}
