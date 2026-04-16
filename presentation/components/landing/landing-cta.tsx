import Link from "next/link";

import { LANDING_HERO } from "@/shared/constants";

import styles from "./landing-page.module.scss";

export function LandingCta() {
  return (
    <section className={styles.ctaSection}>
      <div>
        <span className={styles.eyebrow}>Peer Ledger</span>
        <h2>Ingresá, validá tu sesión y operá desde el dashboard.</h2>
        <p>
          La landing es el punto de entrada. El dashboard queda protegido por
          middleware y mantiene la experiencia operativa completa.
        </p>
      </div>
      <Link
        href={LANDING_HERO.secondaryAction.href}
        className={styles.primaryCta}
      >
        Acceder al dashboard
      </Link>
    </section>
  );
}
