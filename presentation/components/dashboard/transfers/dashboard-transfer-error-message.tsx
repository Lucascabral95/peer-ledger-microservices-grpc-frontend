import styles from "./dashboard-transfers.module.scss";

interface DashboardTransferErrorMessageProps {
  message: string;
}

export function DashboardTransferErrorMessage({
  message,
}: DashboardTransferErrorMessageProps) {
  return (
    <div className={styles.inlineError} role="alert">
      {message}
    </div>
  );
}
