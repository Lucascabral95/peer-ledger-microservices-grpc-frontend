import { LandingArchitectureSecurity } from "./landing-architecture-security";
import { LandingCta } from "./landing-cta";
import { LandingFooter } from "./landing-footer";
import { LandingHeader } from "./landing-header";
import { LandingHero } from "./landing-hero";
import { LandingMetrics } from "./landing-metrics";
import { LandingProductModules } from "./landing-product-modules";
import { LandingStack } from "./landing-stack";
import { LandingTransferReceiver } from "./landing-transfer-receiver";
import styles from "./landing-page.module.scss";

export function LandingPage() {
  return (
    <main className={styles.landingPage}>
      <LandingHeader />
      <LandingHero />
      <LandingMetrics />
      <LandingTransferReceiver />
      <LandingProductModules />
      <LandingArchitectureSecurity />
      <LandingStack />
      <LandingCta />
      <LandingFooter />
    </main>
  );
}
