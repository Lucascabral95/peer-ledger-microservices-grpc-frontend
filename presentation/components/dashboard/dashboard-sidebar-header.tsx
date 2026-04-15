"use client";

import { FiX } from "react-icons/fi";

import styles from "./dashboard-shell.module.scss";

interface DashboardSidebarHeaderProps {
  isCompact: boolean;
  isMobileMenuOpen: boolean;
  onToggleCompact: () => void;
  onCloseMobileMenu: () => void;
}

export function DashboardSidebarHeader({
  isCompact,
  isMobileMenuOpen,
  onToggleCompact,
  onCloseMobileMenu,
}: DashboardSidebarHeaderProps) {
  return (
    <div className={styles.brandRow}>
      <div className={styles.brand}>
        <span className={styles.brandMark}>PL</span>
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>Peer Ledger</span>
          <span className={styles.brandSubtitle}>Plataforma operativa P2P</span>
        </div>
      </div>

      <div className={styles.sidebarActions}>
        <button
          type="button"
          className={`${styles.collapseButton} ${styles.desktopOnlyButton}`.trim()}
          onClick={onToggleCompact}
          aria-label={
            isCompact ? "Expandir panel lateral" : "Contraer panel lateral"
          }
          title={isCompact ? "Expandir panel lateral" : "Contraer panel lateral"}
        >
          {isCompact ? ">" : "<"}
        </button>

        <button
          type="button"
          className={`${styles.collapseButton} ${styles.mobileOnlyButton}`.trim()}
          onClick={onCloseMobileMenu}
          aria-label={isMobileMenuOpen ? "Cerrar menu" : "Abrir menu"}
        >
          <FiX />
        </button>
      </div>
    </div>
  );
}
