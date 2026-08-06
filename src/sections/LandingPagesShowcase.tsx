import type { Locale } from "@/i18n/routing";
import { getHomeLandingPages } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import styles from "./LandingPagesShowcase.module.css";

type LandingPagesShowcaseProps = {
  locale: Locale;
};

export async function LandingPagesShowcase({
  locale,
}: LandingPagesShowcaseProps) {
  const { eyebrow, title } = await getHomeLandingPages(locale);

  return (
    <section className={styles.section}>
      <Container className={styles.inner}>
        <p className={styles.eyebrow}>{eyebrow}</p>
        <h2 className={styles.heading}>{title}</h2>
        <div className={styles.mockups}>
          <div className={styles.mockupSlot} aria-hidden="true" />
          <div className={styles.mockupSlot} aria-hidden="true" />
        </div>
      </Container>
    </section>
  );
}
