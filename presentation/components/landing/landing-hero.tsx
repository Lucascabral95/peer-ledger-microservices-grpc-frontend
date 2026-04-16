import Link from "next/link";

import {
  LANDING_HERO,
  LANDING_PREVIEW,
  LANDING_TRUST_SIGNALS,
} from "@/shared/constants";

import styles from "./landing-page.module.scss";

export function LandingHero() {
  return (
    <section className={styles.heroShell}>
      <div className={styles.heroInner}>
        <div className={styles.heroContent}>
          <span className={styles.eyebrow}>{LANDING_HERO.eyebrow}</span>
          <h1>{LANDING_HERO.title}</h1>
          <p>{LANDING_HERO.description}</p>

          <div className={styles.heroActions}>
            <Link href={LANDING_HERO.primaryAction.href} className={styles.primaryCta}>
              {LANDING_HERO.primaryAction.label}
            </Link>
            <Link
              href={LANDING_HERO.secondaryAction.href}
              className={styles.secondaryCta}
            >
              {LANDING_HERO.secondaryAction.label}
            </Link>
          </div>

          <div className={styles.trustStrip} aria-label="Capacidades clave">
            {LANDING_TRUST_SIGNALS.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
        </div>

        <aside className={styles.heroPanel}>
          <div className={styles.panelHeader}>
            <span>Estado de plataforma</span>
            <strong>{LANDING_PREVIEW.statusLabel}</strong>
          </div>

          <div className={styles.balancePreview}>
            <span>Saldo disponible</span>
            <strong>{LANDING_PREVIEW.balanceLabel}</strong>
            <small>{LANDING_PREVIEW.balanceHelper}</small>
          </div>

          <div className={styles.activityList}>
            {LANDING_PREVIEW.activity.map((item) => (
              <article key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </article>
            ))}
          </div>
        </aside>
      </div>
    </section>
  );
}
