"use client";

import { FiMenu } from "react-icons/fi";

import styles from "./dashboard-shell.module.scss";

interface DashboardContentHeaderProps {
  activeLabel: string;
  onOpenMobileMenu: () => void;
}

export function DashboardContentHeader({
  activeLabel,
  onOpenMobileMenu,
}: DashboardContentHeaderProps) {
  return (
    <header className={styles.contentHeader}>
      <div className={styles.contentHeaderText}>
        <div className={styles.mobileToolbar}>
          <button
            type="button"
            className={styles.mobileMenuButton}
            onClick={onOpenMobileMenu}
            aria-label="Abrir menu"
          >
            <FiMenu />
          </button>
          <span className={styles.mobileToolbarLabel}>Menu</span>
        </div>

        <span className={styles.contentEyebrow}>Dashboard</span>
        <h1 className={styles.contentTitle}>{activeLabel}</h1>
        <p className={styles.contentDescription}>
          Este contenedor padre deja preparada la estructura para que cada
          modulo renderice su contenido a la derecha sin duplicar navegacion ni
          layout.
        </p>
      </div>

      <div className={styles.contentStatus}>
        <span className={styles.contentStatusDot} />
        <span>Entorno operativo listo</span>
      </div>
    </header>
  );
}
