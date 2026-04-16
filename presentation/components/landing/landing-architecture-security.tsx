import {
  LANDING_ARCHITECTURE_LAYERS,
  LANDING_SECURITY_SIGNALS,
} from "@/shared/constants";

import styles from "./landing-page.module.scss";

export function LandingArchitectureSecurity() {
  return (
    <section className={styles.splitSection}>
      <div className={styles.architectureCard}>
        <span className={styles.eyebrow}>Arquitectura</span>
        <h2>Capas claras, componentes testeables y peticiones aisladas.</h2>
        <div className={styles.layerList}>
          {LANDING_ARCHITECTURE_LAYERS.map((layer) => (
            <article key={layer.label}>
              <strong>{layer.label}</strong>
              <span>{layer.detail}</span>
            </article>
          ))}
        </div>
      </div>

      <div className={styles.securityCard}>
        <span className={styles.eyebrow}>Seguridad</span>
        <h2>Controles visibles para operar con confianza.</h2>
        <ul>
          {LANDING_SECURITY_SIGNALS.map((signal) => (
            <li key={signal}>{signal}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
