import type { SecurityFraudRuleModel } from "@/domain/models";
import { getFraudRuleMessage } from "@/shared/utils";

import styles from "./dashboard-security.module.scss";

interface DashboardSecurityFraudCardProps {
  rules: SecurityFraudRuleModel[];
}

export function DashboardSecurityFraudCard({
  rules,
}: DashboardSecurityFraudCardProps) {
  return (
    <section className={styles.fraudCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Antifraude</span>
          <h3 className={styles.cardTitle}>Reglas de movimiento seguro</h3>
        </div>
      </div>

      <p className={styles.cardDescription}>
        Estas reglas reducen abuso, rafagas y movimientos sospechosos antes de
        confirmar transferencias.
      </p>

      <div className={styles.fraudRules}>
        {rules.map((rule) => (
          <article
            key={rule.id}
            className={`${styles.fraudRule} ${
              styles[`tone${capitalize(rule.tone)}`]
            }`.trim()}
          >
            <div>
              <span className={styles.policyLabel}>{rule.label}</span>
              <strong
                style={{ marginLeft: "4px" }}
                className={styles.policyValue}
              >
                {rule.value}
              </strong>
            </div>
            <p className={styles.policyDescription}>{rule.description}</p>
            {rule.ruleCode ? (
              <small className={styles.ruleCode}>
                {rule.ruleCode}: {getFraudRuleMessage(rule.ruleCode)}
              </small>
            ) : null}
          </article>
        ))}
      </div>

      <div className={styles.operationalNote}>
        <p>
          Si el backend devuelve <code>rule_code</code>, la UI muestra un
          mensaje especifico. Si devuelve <code>Retry-After</code>, la UI debe
          esperar ese tiempo. Para reintentos de transferencia, reutilizar la
          misma <code>idempotency_key</code>.
        </p>
      </div>
    </section>
  );
}

function capitalize(value: string) {
  return `${value.charAt(0).toUpperCase()}${value.slice(1)}`;
}
