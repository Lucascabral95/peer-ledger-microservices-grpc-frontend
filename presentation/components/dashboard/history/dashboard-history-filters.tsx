import type { MeActivityKind } from "@/domain/interfaces";
import type { HistoryFilterModel } from "@/domain/models";

import styles from "./dashboard-history.module.scss";

interface DashboardHistoryFiltersProps {
  filters: HistoryFilterModel[];
  activeKind: MeActivityKind;
  from: string;
  to: string;
  onKindChange: (kind: MeActivityKind) => void;
  onFromChange: (from: string) => void;
  onToChange: (to: string) => void;
  onReset: () => void;
}

export function DashboardHistoryFilters({
  filters,
  activeKind,
  from,
  to,
  onKindChange,
  onFromChange,
  onToChange,
  onReset,
}: DashboardHistoryFiltersProps) {
  return (
    <section className={styles.filtersCard}>
      <div className={styles.filterTabs} role="tablist" aria-label="Filtro de tipo">
        {filters.map((filter) => (
          <button
            key={filter.id}
            type="button"
            aria-label={filter.label}
            className={`${styles.filterButton} ${
              activeKind === filter.id ? styles.filterButtonActive : ""
            }`.trim()}
            onClick={() => onKindChange(filter.id)}
          >
            <span>{filter.label}</span>
            <small>{filter.description}</small>
          </button>
        ))}
      </div>

      <div className={styles.dateFilters}>
        <label className={styles.dateField}>
          <span>Desde</span>
          <input
            type="date"
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
          />
        </label>
        <label className={styles.dateField}>
          <span>Hasta</span>
          <input
            type="date"
            value={to}
            onChange={(event) => onToChange(event.target.value)}
          />
        </label>
        <button type="button" className={styles.resetButton} onClick={onReset}>
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
