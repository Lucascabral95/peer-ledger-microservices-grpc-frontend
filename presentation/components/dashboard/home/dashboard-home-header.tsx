import styles from "./dashboard-home.module.scss";

interface DashboardHomeHeaderProps {
  greetingName: string;
  sessionStatusLabel: string;
}

export function DashboardHomeHeader({
  greetingName,
  sessionStatusLabel,
}: DashboardHomeHeaderProps) {
  return (
    <section className={styles.heroHeader}>
      <div>
        <span className={styles.sectionEyebrow}>Resumen ejecutivo</span>
        <h2 className={styles.heroTitle}>Hola, {greetingName}</h2>
        <p className={styles.heroDescription}>
          Entraste a una vista pensada para responder rápido cómo está tu cuenta
          y qué podés hacer enseguida.
        </p>
      </div>

      <div className={styles.sessionBadge}>
        <span className={styles.sessionBadgeDot} />
        <span>{sessionStatusLabel}</span>
      </div>
    </section>
  );
}
