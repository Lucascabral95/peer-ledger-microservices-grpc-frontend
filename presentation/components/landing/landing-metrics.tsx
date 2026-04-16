import { LANDING_METRICS } from "@/shared/constants";

import styles from "./landing-page.module.scss";

export function LandingMetrics() {
  return (
    <section className={styles.metricsSection} aria-label="Metricas de producto">
      <div className={styles.contentRail}>
        {LANDING_METRICS.map((metric) => (
          <article key={metric.label}>
            <strong>{metric.value}</strong>
            <span>{metric.label}</span>
          </article>
        ))}
      </div>
    </section>
  );
}
