import { LANDING_STACK_ITEMS } from "@/shared/constants";

import styles from "./landing-page.module.scss";

export function LandingStack() {
  return (
    <section className={styles.stackSection}>
      <div>
        <span className={styles.eyebrow}>Stack</span>
        <h2>Frontend moderno para microservicios financieros.</h2>
      </div>
      <div className={styles.stackGrid}>
        {LANDING_STACK_ITEMS.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>
    </section>
  );
}
