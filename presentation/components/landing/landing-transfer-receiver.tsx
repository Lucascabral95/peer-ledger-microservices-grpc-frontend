import { LANDING_TRANSFER_RECEIVER } from "@/shared/constants";

import styles from "./landing-page.module.scss";

export function LandingTransferReceiver() {
  return (
    <section className={styles.transferReceiverSection}>
      <div className={styles.transferReceiverContent}>
        <div>
          <span className={styles.eyebrow}>
            {LANDING_TRANSFER_RECEIVER.eyebrow}
          </span>
          <h2>{LANDING_TRANSFER_RECEIVER.title}</h2>
          <p>{LANDING_TRANSFER_RECEIVER.description}</p>
        </div>

        <div className={styles.receiveFeatureList}>
          {LANDING_TRANSFER_RECEIVER.highlights.map((highlight) => (
            <article className={styles.receiveFeatureCard} key={highlight.label}>
              <span>{highlight.label}</span>
              <p>{highlight.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
