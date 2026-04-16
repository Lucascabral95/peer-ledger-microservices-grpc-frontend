import { LANDING_PRODUCT_MODULES } from "@/shared/constants";

import styles from "./landing-page.module.scss";

export function LandingProductModules() {
  return (
    <section className={styles.sectionShell}>
      <div className={styles.sectionHeader}>
        <span className={styles.eyebrow}>Producto</span>
        <h2>Todo lo necesario para una app P2P de primer nivel.</h2>
        <p>
          Cada vista esta separada por responsabilidad, consume servicios
          dedicados y entrega informacion accionable sin mezclar flujos.
        </p>
      </div>

      <div className={styles.moduleGrid}>
        {LANDING_PRODUCT_MODULES.map((module) => (
          <article className={styles.moduleCard} key={module.title}>
            <span className={styles.cardMarker} />
            <h3>{module.title}</h3>
            <p>{module.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
