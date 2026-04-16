import styles from "./dashboard-transfers.module.scss";

interface DashboardTransferSuccessProps {
  message: string;
}

export function DashboardTransferSuccess({ message }: DashboardTransferSuccessProps) {
  return (
    <div className={styles.successMessage} role="status">
      {message}
    </div>
  );
}
