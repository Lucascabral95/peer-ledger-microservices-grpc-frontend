"use client";

import Link from "next/link";

import { AUTH_ROUTES, DASHBOARD_SECTION_ITEMS } from "@/shared/constants";

import styles from "./dashboard-shell.module.scss";
import { getSectionIcon } from "./dashboard-shell.utils";

interface DashboardNavigationProps {
  pathname: string;
  onNavigate: () => void;
}

export function DashboardNavigation({
  pathname,
  onNavigate,
}: DashboardNavigationProps) {
  return (
    <nav className={styles.sections} aria-label="Dashboard navigation">
      <span className={styles.sectionsLabel}>Secciones</span>

      {DASHBOARD_SECTION_ITEMS.map((item) => {
        const isActive =
          item.href === AUTH_ROUTES.home
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);

        const Icon = getSectionIcon(item.href, item.label);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`${styles.sectionLink} ${
              isActive ? styles.sectionLinkActive : ""
            }`.trim()}
            title={item.label}
            onClick={onNavigate}
          >
            <span className={styles.sectionIcon}>
              <Icon />
            </span>
            <span className={styles.sectionLabel}>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
