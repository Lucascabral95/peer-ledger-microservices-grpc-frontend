import styles from "./dashboard-wallet.module.scss";

interface DashboardWalletFiltersProps {
  from: string;
  to: string;
  onFromChange: (from: string) => void;
  onToChange: (to: string) => void;
  onReset: () => void;
}

export function DashboardWalletFilters({
  from,
  to,
  onFromChange,
  onToChange,
  onReset,
}: DashboardWalletFiltersProps) {
  return (
    <section className={styles.filtersCard}>
      <div className={styles.cardHeader}>
        <div>
          <span className={styles.sectionEyebrow}>Filtros</span>
          <h3 className={styles.cardTitle}>Recargas por fecha</h3>
        </div>
      </div>

      <div className={styles.dateFilters}>
        <label className={styles.dateField} htmlFor="wallet-from">
          <span>Desde</span>
          <input
            id="wallet-from"
            aria-label="Desde"
            type="date"
            value={from}
            onChange={(event) => onFromChange(event.target.value)}
          />
        </label>

        <label className={styles.dateField} htmlFor="wallet-to">
          <span>Hasta</span>
          <input
            id="wallet-to"
            aria-label="Hasta"
            type="date"
            value={to}
            onChange={(event) => onToChange(event.target.value)}
          />
        </label>

        <button type="button" className={styles.secondaryButton} onClick={onReset}>
          Limpiar filtros
        </button>
      </div>
    </section>
  );
}
