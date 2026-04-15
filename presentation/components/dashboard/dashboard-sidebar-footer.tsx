"use client";

import styles from "./dashboard-shell.module.scss";
import { getInitials } from "./dashboard-shell.utils";

interface DashboardSidebarFooterProps {
  userName: string;
  onSignOut: () => Promise<void>;
}

export function DashboardSidebarFooter({
  userName,
  onSignOut,
}: DashboardSidebarFooterProps) {
  return (
    <div className={styles.sidebarFooter}>
      <div className={styles.profileCard}>
        <div className={styles.profileMeta}>
          <div className={styles.profileAvatar}>{getInitials(userName)}</div>
          <div className={styles.profileText}>
            <span className={styles.profileLabel}>Sesion activa</span>
            <strong className={styles.profileName}>{userName}</strong>
          </div>
        </div>

        <button
          type="button"
          className={styles.signOutButton}
          onClick={() => {
            void onSignOut();
          }}
        >
          <span className={styles.hiddenDesktopText}>Salir</span>
          <span>Cerrar sesion</span>
        </button>
      </div>
    </div>
  );
}
