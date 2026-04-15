"use client";

import { DashboardContentHeader } from "./dashboard-content-header";
import { DashboardNavigation } from "./dashboard-navigation";
import { DashboardSidebarFooter } from "./dashboard-sidebar-footer";
import { DashboardSidebarHeader } from "./dashboard-sidebar-header";
import { DashboardWorkspaceCard } from "./dashboard-workspace-card";
import UseDashboard from "@/presentation/hooks/use-dashbarod-hook";
import styles from "./dashboard-shell.module.scss";

interface DashboardShellProps {
  children: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  const {
    pathname,
    isCompact,
    setIsCompact,
    isMobileMenuOpen,
    setIsMobileMenuOpen,
    activeItem,
    userName,
    handleSignOut,
  } = UseDashboard();

  const sidebarClassName = `${styles.sidebar} ${
    isMobileMenuOpen ? styles.sidebarMobileOpen : ""
  }`.trim();

  return (
    <div
      className={`${styles.dashboardShell} ${
        isCompact ? styles.dashboardShellCompact : ""
      }`.trim()}
    >
      {isMobileMenuOpen ? (
        <button
          type="button"
          className={styles.mobileBackdrop}
          aria-label="Cerrar menu"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      ) : null}

      <aside className={sidebarClassName}>
        <DashboardSidebarHeader
          isCompact={isCompact}
          isMobileMenuOpen={isMobileMenuOpen}
          onToggleCompact={() => setIsCompact((current) => !current)}
          onCloseMobileMenu={() => setIsMobileMenuOpen(false)}
        />

        <div className={styles.sidebarTop}>
          <DashboardWorkspaceCard />
          <DashboardNavigation
            pathname={pathname}
            onNavigate={() => setIsMobileMenuOpen(false)}
          />
        </div>

        <DashboardSidebarFooter userName={userName} onSignOut={handleSignOut} />
      </aside>

      <main className={styles.contentPanel}>
        <div className={styles.contentFrame}>
          <DashboardContentHeader
            activeLabel={activeItem.label}
            onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          />

          <section className={styles.contentBody}>{children}</section>
        </div>
      </main>
    </div>
  );
}
