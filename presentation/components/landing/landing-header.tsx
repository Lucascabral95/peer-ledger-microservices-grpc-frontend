import Link from "next/link";

import { LANDING_BRAND, LANDING_NAV_ACTIONS } from "@/shared/constants";

import styles from "./landing-page.module.scss";

export function LandingHeader() {
  return (
    <header className={styles.headerShell}>
      <nav className={styles.headerInner} aria-label="Navegacion principal">
        <Link href={LANDING_BRAND.href} className={styles.brand}>
          <span className={styles.brandMark}>{LANDING_BRAND.mark}</span>
          {LANDING_BRAND.name}
        </Link>

        <div className={styles.navActions}>
          {LANDING_NAV_ACTIONS.map((action) => (
            <Link
              href={action.href}
              className={
                action.variant === "primary"
                  ? styles.primaryNavLink
                  : styles.ghostNavLink
              }
              key={action.href}
            >
              {action.label}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}
