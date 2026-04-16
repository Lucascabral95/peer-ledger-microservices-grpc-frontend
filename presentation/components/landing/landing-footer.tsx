import { LANDING_FOOTER_LINKS } from "@/shared/constants";

import styles from "./landing-page.module.scss";

export function LandingFooter() {
  return (
    <footer className={styles.footerShell}>
      <div className={styles.footerInner}>
        <div>
          <strong>Peer Ledger Frontend</strong>
          <span>Desarrollado por Lucas Cabral.</span>
        </div>

        <div className={styles.footerLinks}>
          {LANDING_FOOTER_LINKS.map((link) => (
            <a
              href={link.href}
              key={link.label}
              target="_blank"
              rel="noreferrer"
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
