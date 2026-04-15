"use client";

import styles from "./dashboard-shell.module.scss";

export function DashboardWorkspaceCard() {
  return (
    <section className={styles.workspaceCard}>
      <span className={styles.workspaceEyebrow}>Workspace</span>
      <h2 className={styles.workspaceTitle}>Centro operativo</h2>
      <p className={styles.workspaceDescription}>
        Navegacion sobria para administrar movimientos, identidad y seguridad
        dentro de una experiencia enterprise lista para P2P.
      </p>
    </section>
  );
}
